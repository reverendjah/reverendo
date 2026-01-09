#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

const VERSION = '1.7.1';
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

// Generate MCP servers config (cross-platform)
function generateMcpJson() {
  const isWindows = process.platform === 'win32';

  const mcpServer = (pkg) => isWindows
    ? { type: 'stdio', command: 'cmd', args: ['/c', 'npx', '-y', pkg] }
    : { type: 'stdio', command: 'npx', args: ['-y', pkg] };

  return {
    mcpServers: {
      'context7': mcpServer('@upstash/context7-mcp@latest'),
      'sequential-thinking': mcpServer('@modelcontextprotocol/server-sequential-thinking'),
      'playwright': mcpServer('@playwright/mcp@latest'),
    },
  };
}

// Detect project stack from files
function detectProject(targetDir) {
  const result = {
    name: path.basename(targetDir),
    description: '',
    stack: {
      framework: '',
      language: '',
      database: '',
      styling: '',
      runtime: '',
    },
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
      test: 'npm run test',
      lint: 'npm run lint',
    },
    packageManager: 'npm',
  };

  // Detect package.json (Node.js)
  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      result.name = pkg.name || result.name;
      result.description = pkg.description || '';
      result.stack.language = 'TypeScript/JavaScript';
      result.stack.runtime = 'Node.js';

      // Detect framework
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps['next']) result.stack.framework = 'Next.js';
      else if (deps['nuxt']) result.stack.framework = 'Nuxt';
      else if (deps['react']) result.stack.framework = 'React';
      else if (deps['vue']) result.stack.framework = 'Vue';
      else if (deps['svelte']) result.stack.framework = 'Svelte';
      else if (deps['express']) result.stack.framework = 'Express';
      else if (deps['fastify']) result.stack.framework = 'Fastify';

      // Detect styling
      if (deps['tailwindcss']) result.stack.styling = 'Tailwind CSS';
      else if (deps['styled-components']) result.stack.styling = 'Styled Components';
      else if (deps['@emotion/react']) result.stack.styling = 'Emotion';

      // Detect database
      if (deps['prisma'] || deps['@prisma/client']) result.stack.database = 'Prisma';
      else if (deps['drizzle-orm']) result.stack.database = 'Drizzle';
      else if (deps['mongoose']) result.stack.database = 'MongoDB (Mongoose)';
      else if (deps['pg']) result.stack.database = 'PostgreSQL';
      else if (deps['mysql2']) result.stack.database = 'MySQL';

      // Detect package manager
      if (fs.existsSync(path.join(targetDir, 'bun.lockb'))) {
        result.packageManager = 'bun';
      } else if (fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml'))) {
        result.packageManager = 'pnpm';
      } else if (fs.existsSync(path.join(targetDir, 'yarn.lock'))) {
        result.packageManager = 'yarn';
      }

      // Update commands with correct package manager
      const pm = result.packageManager;
      const run = pm === 'npm' ? 'npm run' : pm;
      if (pkg.scripts?.dev) result.commands.dev = `${run} dev`;
      if (pkg.scripts?.build) result.commands.build = `${run} build`;
      if (pkg.scripts?.test) result.commands.test = `${run} test`;
      if (pkg.scripts?.lint) result.commands.lint = `${run} lint`;
    } catch (e) {
      // Invalid package.json - ignore
    }
  }

  // Detect Python
  const pyprojectPath = path.join(targetDir, 'pyproject.toml');
  const requirementsPath = path.join(targetDir, 'requirements.txt');
  if (fs.existsSync(pyprojectPath) || fs.existsSync(requirementsPath)) {
    result.stack.language = 'Python';
    result.stack.runtime = 'Python 3.x';
    result.commands.dev = 'python main.py';
    result.commands.build = '';
    result.commands.test = 'pytest';
    result.commands.lint = 'ruff check .';
  }

  // Detect Go
  if (fs.existsSync(path.join(targetDir, 'go.mod'))) {
    result.stack.language = 'Go';
    result.stack.runtime = 'Go';
    result.commands.dev = 'go run .';
    result.commands.build = 'go build';
    result.commands.test = 'go test ./...';
    result.commands.lint = 'golangci-lint run';
  }

  // Detect Rust
  if (fs.existsSync(path.join(targetDir, 'Cargo.toml'))) {
    result.stack.language = 'Rust';
    result.stack.runtime = 'Rust';
    result.commands.dev = 'cargo run';
    result.commands.build = 'cargo build --release';
    result.commands.test = 'cargo test';
    result.commands.lint = 'cargo clippy';
  }

  return result;
}

// Generate CLAUDE.md from template with detected project info
function generateClaudeMd(project, templatePath) {
  let template = fs.readFileSync(templatePath, 'utf8');

  // Replace name and description
  template = template.replace('# Project Name', `# ${project.name}`);
  if (project.description) {
    template = template.replace(
      'Brief description of your project.',
      project.description
    );
  }

  // Replace stack table
  template = template.replace('| Framework | |', `| Framework | ${project.stack.framework} |`);
  template = template.replace('| Language | |', `| Language | ${project.stack.language} |`);
  template = template.replace('| Database | |', `| Database | ${project.stack.database} |`);
  template = template.replace('| Styling | |', `| Styling | ${project.stack.styling} |`);
  template = template.replace('| Runtime | |', `| Runtime | ${project.stack.runtime} |`);

  // Replace commands
  template = template.replace('npm run dev', project.commands.dev);
  template = template.replace('npm run build', project.commands.build);
  template = template.replace('npm run test', project.commands.test);
  template = template.replace('npm run lint', project.commands.lint);

  return template;
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

  // Copy hooks
  const hooksDir = path.join(claudeDir, 'hooks');
  fs.mkdirSync(hooksDir, { recursive: true });
  const hookFiles = fs.readdirSync(path.join(TEMPLATES_DIR, 'hooks'));
  for (const file of hookFiles) {
    fs.copyFileSync(
      path.join(TEMPLATES_DIR, 'hooks', file),
      path.join(hooksDir, file)
    );
    console.log(`  ${c.green('✓')} .claude/hooks/${file}`);
  }

  // Generate personalized CLAUDE.md
  const project = detectProject(targetDir);
  const templatePath = path.join(TEMPLATES_DIR, 'claude.md');
  const claudeContent = generateClaudeMd(project, templatePath);
  fs.writeFileSync(claudeMd, claudeContent);
  const detected = project.stack.framework || project.stack.language || 'generic';
  console.log(`  ${c.green('✓')} CLAUDE.md ${c.dim('(detected: ' + detected + ')')}`);

  // Generate .mcp.json (MCP servers config - cross-platform)
  const mcpJson = path.join(targetDir, '.mcp.json');
  const mcpConfig = generateMcpJson();

  if (fs.existsSync(mcpJson)) {
    // Merge with existing .mcp.json
    try {
      const existing = JSON.parse(fs.readFileSync(mcpJson, 'utf8'));

      existing.mcpServers = {
        ...existing.mcpServers,
        ...mcpConfig.mcpServers,
      };

      fs.writeFileSync(mcpJson, JSON.stringify(existing, null, 2) + '\n');
      console.log(`  ${c.green('✓')} .mcp.json ${c.dim('(merged)')}`);
    } catch (e) {
      // If parsing fails, backup and overwrite
      fs.copyFileSync(mcpJson, path.join(targetDir, '.mcp.json.backup'));
      fs.writeFileSync(mcpJson, JSON.stringify(mcpConfig, null, 2) + '\n');
      console.log(`  ${c.green('✓')} .mcp.json ${c.dim('(backup created)')}`);
    }
  } else {
    fs.writeFileSync(mcpJson, JSON.stringify(mcpConfig, null, 2) + '\n');
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

// Fix global Claude config if needed (Windows MCP format)
async function fixGlobalConfig() {
  if (process.platform !== 'win32') return; // Only needed on Windows

  const homeDir = process.env.USERPROFILE || process.env.HOME;
  const globalConfig = path.join(homeDir, '.claude.json');

  if (!fs.existsSync(globalConfig)) return;

  try {
    const config = JSON.parse(fs.readFileSync(globalConfig, 'utf8'));

    if (!config.mcpServers) return;

    // Check if any MCP uses old format (npx directly)
    let needsFix = false;
    for (const [name, server] of Object.entries(config.mcpServers)) {
      if (server.command === 'npx') {
        needsFix = true;
        break;
      }
    }

    if (!needsFix) return;

    console.log(`\n  ${c.yellow('!')} Seu config global tem MCPs no formato antigo.`);
    const shouldFix = await ask(`  Corrigir ~/.claude.json? [S/n] `);

    if (shouldFix) {
      // Backup
      fs.copyFileSync(globalConfig, globalConfig + '.backup');

      // Fix each MCP server
      for (const [name, server] of Object.entries(config.mcpServers)) {
        if (server.command === 'npx') {
          config.mcpServers[name] = {
            ...server,
            command: 'cmd',
            args: ['/c', 'npx', ...server.args],
          };
        }
      }

      fs.writeFileSync(globalConfig, JSON.stringify(config, null, 2));
      console.log(`  ${c.green('✓')} Config global corrigido (backup em .claude.json.backup)`);
    }
  } catch (e) {
    // Ignore errors reading global config
  }
}

// Start Claude Code
function startClaude(args = []) {
  console.log(`  ${c.cyan('🚀')} Iniciando Claude Code...\n`);

  const claude = spawn('claude', args, {
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
  const args = process.argv.slice(2); // Argumentos após 'reverendo'
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

  // Fix global config if needed (Windows MCP format)
  if (shouldStartClaude) {
    await fixGlobalConfig();
    startClaude(args);
  }
}

main().catch(console.error);
