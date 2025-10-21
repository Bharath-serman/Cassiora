import React, { useState, useCallback } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { githubDark } from '@uiw/codemirror-theme-github';

const languageOptions = [
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
];

const languageExtensions = {
  python: python(),
  java: java(),
  c: cpp(), // C uses the C++ extension
  cpp: cpp(),
};

const defaultTemplates = {
  python: "# Write your Python code here\n",
  java: "public class Solution {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}\n",
  c: "#include <stdio.h>\nint main() {\n    // Write your C code here\n    return 0;\n}\n",
  cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    // Write your C++ code here\n    return 0;\n}\n"
};

interface CodeEditorProps {
  starterCode?: string;
  starterCodes?: Record<string, string>;
  onRun: (args: { code: string; language: string; testCases: any[] }) => void;
  loading: boolean;
  error: any;
  hideTestCases?: boolean;
}

export default function CodeEditor({ starterCode = "", starterCodes = {}, onRun, loading, error, hideTestCases = false }: CodeEditorProps) {
  const [language, setLanguage] = useState(languageOptions[0].value);
  const [code, setCode] = useState(starterCode || defaultTemplates[language]);
  const [isDirty, setIsDirty] = useState(false);
  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "" }
  ]);

  const handleLanguageChange = (newLanguage: string) => {
    const changeLanguage = () => {
      setLanguage(newLanguage);
      const newStarter = starterCodes[newLanguage] || starterCode || defaultTemplates[newLanguage];
      setCode(newStarter);
      setIsDirty(false);
    };

    if (isDirty) {
      if (window.confirm("You have edited the code. Do you want to switch and lose your changes?")) {
        changeLanguage();
      }
    } else {
      changeLanguage();
    }
  };

  const onCodeChange = useCallback((value) => {
    setCode(value);
    setIsDirty(true);
  }, []);

  const handleTestCaseChange = (i, field, value) => {
    setTestCases(tc => tc.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const addTestCase = () => setTestCases(tc => [...tc, { input: "", expectedOutput: "" }]);
  const removeTestCase = i => setTestCases(tc => tc.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex gap-3 items-center">
        <label className="font-semibold">Language:</label>
        <select
          value={language}
          onChange={e => handleLanguageChange(e.target.value)}
          className="border rounded px-2 py-1 bg-background text-foreground"
        >
          {languageOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="border rounded overflow-hidden">
        <CodeMirror
          value={code}
          height="300px"
          extensions={[languageExtensions[language]]}
          theme={githubDark}
          onChange={onCodeChange}
        />
      </div>
      {!hideTestCases && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Test Cases</span>
            <button type="button" className="text-primary underline" onClick={addTestCase}>Add</button>
          </div>
          {testCases.map((tc, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                className="border rounded px-2 py-1 flex-1 bg-background text-foreground"
                placeholder="Input"
                value={tc.input}
                onChange={e => handleTestCaseChange(i, "input", e.target.value)}
              />
              <input
                className="border rounded px-2 py-1 flex-1 bg-background text-foreground"
                placeholder="Expected Output"
                value={tc.expectedOutput}
                onChange={e => handleTestCaseChange(i, "expectedOutput", e.target.value)}
              />
              {testCases.length > 1 && (
                <button type="button" className="text-red-500" onClick={() => removeTestCase(i)}>Remove</button>
              )}
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className="text-left">
          <b className="font-semibold text-red-600 dark:text-red-400">Execution Error:</b>
          <pre className="mt-1 p-2 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap break-words max-w-full overflow-x-auto">
            {error}
          </pre>
        </div>
      )}
      <button
        className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/80 disabled:opacity-70"
        disabled={loading}
        onClick={() => onRun({ code, language, testCases })}
      >
        {loading ? "Running..." : "Run Code"}
      </button>
    </div>
  );
}

