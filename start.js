const { spawn, execSync } = require('child_process');

const colors = { red: '\x1b[31m', blue: '\x1b[34m', green: '\x1b[32m', reset: '\x1b[0m', bold: '\x1b[1m' };

function killPort(port) {
  try {
    execSync(`for /f "tokens=5" %a in ('netstat -aon ^| find ":${port} "') do taskkill /F /PID %a`, { shell: true, stdio: 'ignore' });
  } catch (_) {}
}

function run(name, cmd, args, cwd, color) {
  const proc = spawn(cmd, args, { cwd, shell: true });
  proc.stdout.on('data', d => process.stdout.write(`${color}[${name}]${colors.reset} ${d}`));
  proc.stderr.on('data', d => process.stderr.write(`${color}[${name}]${colors.reset} ${d}`));
  proc.on('close', code => console.log(`${color}[${name}] exited with code ${code}${colors.reset}`));
  return proc;
}

console.log(`\n${colors.bold}${colors.red}🩸 Starting RaktaSetu...${colors.reset}`);
console.log(`${colors.green}Freeing ports 3000 and 3001...${colors.reset}\n`);

killPort(3000);
killPort(3001);

setTimeout(() => {
  const backend  = run('BACKEND',  'npm', ['start'],      `${__dirname}/backend`,  colors.red);
  const frontend = run('FRONTEND', 'npm', ['run', 'dev'], `${__dirname}/frontend`, colors.blue);

  process.on('SIGINT', () => {
    console.log(`\n${colors.green}Shutting down...${colors.reset}`);
    backend.kill();
    frontend.kill();
    process.exit();
  });
}, 1000);
