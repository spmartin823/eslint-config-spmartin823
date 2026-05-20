#!/usr/bin/env node
const { execFileSync } = require('child_process');
const { mkdtempSync, writeFileSync, rmSync, symlinkSync } = require('fs');
const { tmpdir } = require('os');
const path = require('path');

const PKG_ROOT = path.resolve(__dirname, '..');

const FIXTURE_TSX = `
import { useState } from 'react';
import { something } from 'other';
import { useState } from 'react';

class Box {
  public render() {
    if (1 == 1) return <div className={"x"}>hi</div>;
  }
}
`;

const FIXTURE_NODE_TS = `
import { join } from 'path';
import { readFileSync } from 'fs';
import { join } from 'path';

if (1 == 1) console.log("bad");
`;

const cases = [
  {
    name: 'react flavor (base + react + browser)',
    config: "const { base, react, browser } = require('eslint-config-spmartin823');\nmodule.exports = [...base, ...react, ...browser];",
    fixture: { file: 'sample.tsx', body: FIXTURE_TSX },
    expectedRules: [
      '@typescript-eslint/explicit-member-accessibility',
      'eqeqeq',
      'quotes',
      'curly',
      'import/no-duplicates',
      'simple-import-sort/imports',
      'react/jsx-curly-brace-presence',
    ],
  },
  {
    name: 'node flavor (base + node)',
    config: "const { base, node } = require('eslint-config-spmartin823');\nmodule.exports = [...base, ...node];",
    fixture: { file: 'sample.ts', body: FIXTURE_NODE_TS },
    expectedRules: [
      'eqeqeq',
      'quotes',
      'curly',
      'import/no-duplicates',
      'simple-import-sort/imports',
    ],
  },
  {
    name: 'autofix wires fixable rules through --fix',
    config: "const { base, react, browser } = require('eslint-config-spmartin823');\nmodule.exports = [...base, ...react, ...browser];",
    fixture: { file: 'fixme.tsx', body: "import { useState } from 'react';\nconst x = \"double\";\n" },
    fixCheck: { rule: 'quotes', fixedSubstring: "'double'" },
  },
];

function setupSandbox() {
  const dir = mkdtempSync(path.join(tmpdir(), 'eslint-cfg-test-'));
  writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'sandbox', private: true }));
  const nm = path.join(dir, 'node_modules');
  execFileSync('mkdir', ['-p', nm]);
  symlinkSync(PKG_ROOT, path.join(nm, 'eslint-config-spmartin823'));
  symlinkSync(path.join(PKG_ROOT, 'node_modules', 'eslint'), path.join(nm, 'eslint'));
  symlinkSync(path.join(PKG_ROOT, 'node_modules', '.bin'), path.join(nm, '.bin'));
  return dir;
}

function runEslint(dir, args) {
  try {
    return {
      code: 0,
      out: execFileSync(path.join(dir, 'node_modules', '.bin', 'eslint'), args, { cwd: dir, encoding: 'utf8' }),
    };
  } catch (err) {
    return { code: err.status, out: (err.stdout || '') + (err.stderr || '') };
  }
}

let failed = 0;

const sandbox = setupSandbox();
try {
  for (const c of cases) {
    writeFileSync(path.join(sandbox, 'eslint.config.js'), c.config);
    writeFileSync(path.join(sandbox, c.fixture.file), c.fixture.body);

    if (c.fixCheck) {
      runEslint(sandbox, [c.fixture.file, '--fix']);
      const after = require('fs').readFileSync(path.join(sandbox, c.fixture.file), 'utf8');
      const ok = after.includes(c.fixCheck.fixedSubstring);
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}`);
      if (!ok) {
        failed++;
        console.log('  expected file to contain:', c.fixCheck.fixedSubstring);
        console.log('  got:', after.trim());
      }
      continue;
    }

    const { out } = runEslint(sandbox, [c.fixture.file, '-f', 'json']);
    let parsed;
    try {
      parsed = JSON.parse(out);
    } catch {
      failed++;
      console.log(`FAIL  ${c.name}: could not parse eslint json output`);
      console.log(out);
      continue;
    }
    const ruleIds = new Set(parsed.flatMap((r) => r.messages.map((m) => m.ruleId)));
    const missing = c.expectedRules.filter((r) => !ruleIds.has(r));
    if (missing.length === 0) {
      console.log(`PASS  ${c.name}`);
    } else {
      failed++;
      console.log(`FAIL  ${c.name}`);
      console.log('  missing rules:', missing.join(', '));
      console.log('  saw rules:', [...ruleIds].filter(Boolean).join(', '));
    }
  }
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}

if (failed > 0) {
  console.log(`\n${failed} case(s) failed`);
  process.exit(1);
}
console.log('\nAll plugin checks passed.');
