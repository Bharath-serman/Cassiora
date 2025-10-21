import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read the question bank JSON
const questionBank = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'questionBank.json'), 'utf-8'));

// 2. Flatten into an array of questions with topic field
const questions = [];
for (const topic in questionBank) {
  questionBank[topic].forEach(q => {
    const isMCQ = !!q.options;
    let isCoding = !!q.starterCode || q.type === 'coding';

    const questionToAdd = { ...q, topic, type: isMCQ ? 'mcq' : (isCoding ? 'coding' : (q.type || undefined)) };

    // If it's a coding question, ensure it has starter codes for all languages
    if (isCoding) {
      questionToAdd.starterCodes = {
        python: q.starterCode || '# Write your Python code here',
        java: q.starterCodes?.java || 'public class Solution {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}',
        c: q.starterCodes?.c || '#include <stdio.h>\nint main() {\n    // Write your C code here\n    return 0;\n}',
        cpp: q.starterCodes?.cpp || '#include <iostream>\nusing namespace std;\nint main() {\n    // Write your C++ code here\n    return 0;\n}'
      };
      // For backward compatibility, ensure starterCode is set (e.g., to Python's)
      if (!questionToAdd.starterCode) {
        questionToAdd.starterCode = questionToAdd.starterCodes.python;
      }
    }

    questions.push(questionToAdd);
  });
}

// 3. Connect to MongoDB and insert
const uri = 'mongodb://localhost:27017'; // Change if your MongoDB is elsewhere
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('placement'); // Use your DB name
    const collection = db.collection('questions');
    await collection.deleteMany({}); // Optional: clear old data
    const result = await collection.insertMany(questions);
    console.log(`Inserted ${result.insertedCount} questions!`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir); 