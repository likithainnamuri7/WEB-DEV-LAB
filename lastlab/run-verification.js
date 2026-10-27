const { fork } = require('child_process');
const path = require('path');

const serverProcess = fork(path.join(__dirname, 'server.js'));

setTimeout(() => {
  const testProcess = fork(path.join(__dirname, 'test-server.js'));
  testProcess.on('exit', (code) => {
    serverProcess.kill();
    process.exit(code);
  });
}, 1000);
