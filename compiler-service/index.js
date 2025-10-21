import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { runPython } from './runners/pythonRunner.js';
import { runJava } from './runners/javaRunner.js';
import { runC } from './runners/cRunner.js';
import { runCpp } from './runners/cppRunner.js';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/api/compile', async (req, res) => {
  const { code, language, testCases } = req.body;
  try {
    let results;
    if (language === 'python') results = await runPython(code, testCases);
    else if (language === 'java') results = await runJava(code, testCases);
    else if (language === 'c') results = await runC(code, testCases);
    else if (language === 'cpp') results = await runCpp(code, testCases);
    else throw new Error('Unsupported language');
    res.json({ results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3002, () => console.log('Compiler API running on port 3002'));
