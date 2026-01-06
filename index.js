#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const VERSION = '1.5.3';
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Colors for terminal
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// Ask user a yes/no question
function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('s') || answer.toLowerCase().startsWith('y') || answer === '');
    });
  });
}

// Copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Get list of template files
function getTemplateFiles(dir, base = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files.push(...getTemplateFiles(path.join(dir, entry.name), relPath));
    } else {
      files.push(relPath);
    }
  }

  return files;
}

// Initialize new project
async function init(targetDir) {
  console.log('\n  Inicializando Reverendo...\n');

  const claudeDir = path.join(targetDir, '.claude');
  const claudeMd = path.join(targetDir, 'CLAUDE.md');

  // Copy .claude folder
  fs.mkdirSync(claudeDir, { recursive: true });

  // Copy settings.json
  fs.copyFileSync(
    path.join(TEMPLATES_DIR, 'settings.json'),
    path.join(claudeDir, 'settings.json')
  );
  console.log(`  ${c.green('✓')} .claude/settings.json`);

  // Copy commands
  const commandsDir = path.join(claudeDir, 'commands');
  fs.mkdirSync(commandsDir, { recursive: true });
  const commandFiles = fs.readdirSync(path.join(TEMPLATES_DIR, 'commands'));
  for (const file of commandFiles) {
    fs.copyFileSync(
      path.join(TEMPLATES_DIR, 'commands', file),
      path.join(commandsDir, file)
    );
    console.log(`  ${c.green('✓')} .claude/commands/${file}`);
  }

  // Copy agents
  const agentsDir = path.join(claudeDir, 'agents');
  fs.mkdirSync(agentsDir, { recursive: true });
  const agentFiles = fs.readdirSync(path.join(TEMPLATES_DIR, 'agents'));
  for (const file of agentFiles) {
    fs.copyFileSync(
      path.join(TEMPLATES_DIR, 'agents', file),
      path.join(agentsDir, file)
    );
    console.log(`  ${c.green('✓')} .claude/agents/${file}`);
  }

  // Copy CLAUDE.md
  fs.copyFileSync(
    path.join(TEMPLATES_DIR, 'claude.md'),
    claudeMd
  );
  console.log(`  ${c.green('✓')} CLAUDE.md`);

  // Copy .mcp.json (MCP servers config)
  const mcpJson = path.join(targetDir, '.mcp.json');
  const mcpTemplate = path.join(TEMPLATES_DIR, 'mcp.json');

  if (fs.existsSync(mcpJson)) {
    // Merge with existing .mcp.json
    try {
      const existing = JSON.parse(fs.readFileSync(mcpJson, 'utf8'));
      const template = JSON.parse(fs.readFileSync(mcpTemplate, 'utf8'));

      existing.mcpServers = {
        ...existing.mcpServers,
        ...template.mcpServers,
      };

      fs.writeFileSync(mcpJson, JSON.stringify(existing, null, 2) + '\n');
      console.log(`  ${c.green('✓')} .mcp.json ${c.dim('(merged)')}`);
    } catch (e) {
      // If parsing fails, backup and overwrite
      fs.copyFileSync(mcpJson, path.join(targetDir, '.mcp.json.backup'));
      fs.copyFileSync(mcpTemplate, mcpJson);
      console.log(`  ${c.green('✓')} .mcp.json ${c.dim('(backup created)')}`);
    }
  } else {
    fs.copyFileSync(mcpTemplate, mcpJson);
    console.log(`  ${c.green('✓')} .mcp.json`);
  }

  // Save version
  fs.writeFileSync(
    path.join(claudeDir, '.reverendo-version'),
    VERSION
  );

  console.log(`\n  ${c.green('✅')} Pronto!\n`);

  return true; // Signal success for starting Claude
}

// Start Claude Code
function startClaude() {
  console.log(`  ${c.cyan('🚀')} Iniciando Claude Code...\n`);

  const claude = spawn('claude', [], {
    stdio: 'inherit',
    shell: true,
  });

  claude.on('error', (err) => {
    console.error(`\n  ${c.yellow('!')} Não foi possível iniciar Claude Code.`);
    console.error(`  Instale com: ${c.cyan('npm install -g @anthropic-ai/claude-code')}\n`);
  });
}

// Check for updates
async function update(targetDir, currentVersion) {
  console.log(`\n  Reverendo ${c.dim(currentVersion)} → ${c.green(VERSION)}\n`);

  // TODO: In future versions, compare files and show diff
  // For now, just offer to reinitialize

  const shouldUpdate = await ask(`  Atualizar? [S/n] `);

  if (shouldUpdate) {
    // Backup CLAUDE.md if it exists
    const claudeMd = path.join(targetDir, 'CLAUDE.md');
    if (fs.existsSync(claudeMd)) {
      const backup = path.join(targetDir, 'CLAUDE.md.backup');
      fs.copyFileSync(claudeMd, backup);
      console.log(`\n  ${c.yellow('!')} CLAUDE.md salvo em CLAUDE.md.backup`);
    }

    await init(targetDir);
  } else {
    console.log('\n  Cancelado.\n');
  }
}

// Main
async function main() {
  const targetDir = process.cwd();
  const claudeDir = path.join(targetDir, '.claude');
  const versionFile = path.join(claudeDir, '.reverendo-version');

  let shouldStartClaude = false;

  // Check if already initialized
  if (fs.existsSync(versionFile)) {
    const currentVersion = fs.readFileSync(versionFile, 'utf8').trim();

    if (currentVersion === VERSION) {
      console.log(`\n  ${c.green('✓')} Reverendo ${c.dim(VERSION)} já está instalado.`);
      shouldStartClaude = true;
    } else {
      await update(targetDir, currentVersion);
      shouldStartClaude = true;
    }
  } else if (fs.existsSync(claudeDir)) {
    // .claude exists but no version file - ask if should overwrite
    console.log(`\n  ${c.yellow('!')} Pasta .claude/ encontrada (não é do Reverendo)`);
    const shouldOverwrite = await ask(`  Sobrescrever? [S/n] `);

    if (shouldOverwrite) {
      const success = await init(targetDir);
      shouldStartClaude = success;
    } else {
      console.log('\n  Cancelado.\n');
    }
  } else {
    // Fresh install
    const success = await init(targetDir);
    shouldStartClaude = success;
  }

  // Start Claude Code
  if (shouldStartClaude) {
    startClaude();
  }
}

main().catch(console.error);
