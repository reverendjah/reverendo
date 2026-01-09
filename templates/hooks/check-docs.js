#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  const diff = execSync('git diff --name-only HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });

  const codeChanges = diff.split('\n').filter(f =>
    /\.(ts|tsx|js|jsx|py|go|rs)$/.test(f)
  ).length;

  const docChanges = diff.split('\n').filter(f =>
    /(CLAUDE\.md|README\.md|docs\/)/.test(f)
  ).length;

  if (codeChanges > 0 && docChanges === 0) {
    console.error('Code changed but no documentation updated.');
    console.error('Run rev-documenter agent or update docs manually.');
    process.exit(2);
  }
} catch (e) {
  // Git not available or not a repo - ignore
}
process.exit(0);
