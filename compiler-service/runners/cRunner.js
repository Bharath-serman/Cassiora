import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import tmp from 'tmp-promise';

export async function runC(code, testCases) {
  const dir = await tmp.dir();
  const filePath = path.join(dir.path, 'main.c');
  const outPath = path.join(dir.path, 'main.out');
  await fs.writeFile(filePath, code);
  const compileCmd = `gcc ${filePath} -o ${outPath}`;
  let compileError = '';
  await new Promise((resolve) => {
    exec(compileCmd, (err, stdout, stderr) => {
      compileError = stderr;
      resolve();
    });
  });
  if (compileError) {
    // await dir.cleanup();
    return testCases.map(tc => ({ ...tc, output: '', passed: false, error: 'Compile Error: ' + compileError }));
  }
  const results = [];
  for (const { input, expectedOutput } of testCases) {
    const runCmd = outPath;
    const { stdout, stderr } = await execPromise(runCmd, input);
    results.push({
      input,
      output: stdout.trim(),
      expectedOutput,
      passed: stdout.trim() === expectedOutput.trim(),
      error: stderr
    });
  }
  // await dir.cleanup();
  return results;
}

function execPromise(cmd, input) {
  return new Promise((resolve, reject) => {
    const proc = exec(cmd, (err, stdout, stderr) => {
      if (err && !stdout) return reject(err);
      resolve({ stdout, stderr });
    });
    if (input) proc.stdin.write(input);
    proc.stdin.end();
  });
}
