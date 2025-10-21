import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import tmp from 'tmp-promise';

export async function runPython(code, testCases) {
  const file = await tmp.file({ postfix: '.py' });
  await fs.writeFile(file.path, code);
  const results = [];
  for (const { input, expectedOutput } of testCases) {
    const cmd = `python ${file.path}`;
    const { stdout, stderr } = await execPromise(cmd, input);
    results.push({
      input,
      output: stdout.trim(),
      expectedOutput,
      passed: stdout.trim() === expectedOutput.trim(),
      error: stderr
    });
  }
  // await file.cleanup();
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
