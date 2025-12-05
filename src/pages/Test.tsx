import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/components/UserContext";
import StreakCompletionAnimation from "@/components/StreakCompletionAnimation";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";

type Question = {
  type: 'mcq' | 'coding';
  question: string;
  options?: Record<string, string>; // Only for MCQ
  answer?: string; // Only for MCQ
  explanation?: string;
  company?: string;
  starterCode?: string; // Only for coding
  starterCodes?: Record<string, string>; // Only for coding, language -> code
  difficulty?: 'easy' | 'intermediate'; // Only for coding
  sampleInput?: string; // Only for coding
  sampleOutput?: string; // Only for coding
  constraints?: string; // Only for coding
  testCases?: { input: string; expectedOutput: string }[]; // Only for coding
};

type TestState = "loading" | "ready" | "in-progress" | "finished" | "animating-streak";

export default function TestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, refresh } = useUser();
  const [state, setState] = useState<TestState>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState("");
  const [newStreak, setNewStreak] = useState(0);
  const [questionTypeChoice, setQuestionTypeChoice] = useState<"mcq" | "coding" | "">("");
  const [finishedTestQuestions, setFinishedTestQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Get topic from URL params or state
    const urlParams = new URLSearchParams(window.location.search);
    const topicFromUrl = urlParams.get('topic');
    const state = location.state as { topic?: string, topicName?: string };

    // If no topic in URL or state, redirect to home
    if (!topicFromUrl && !state?.topic) {
      toast({
        title: "No topic selected",
        description: "Please select a topic from the topics page.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    // Use topic from URL (if present) or from state
    const selectedTopic = topicFromUrl || state?.topic || '';
    setTopic(selectedTopic);

    // If we have a topic name from state, use it for display
    if (state?.topicName) {
      document.title = `${state.topicName} Test | Spideo`;
    }

    // Fetch questions from MongoDB
    const fetchQuestions = async () => {
      setState("loading");
      const token = localStorage.getItem('token');
      if (!token) {
        toast({ title: "Authentication Error", description: "You must be logged in to view questions." });
        navigate("/auth");
        return;
      }
      try {
        const res = await fetch(`/api/questions?topic=${state.topic}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          toast({ title: "Session Expired", description: "Please log in again." });
          navigate("/auth");
          return;
        }

        if (!res.ok) throw new Error(`Failed to fetch questions (${res.status})`);
        const data = await res.json();
        if (!data?.questions?.length) throw new Error("No questions found for this topic.");
        setQuestions(data.questions);
        console.log('Fetched questions:', data.questions);

        // Always show confirmation/start page for all topics
        setQuestions(data.questions);
        setFilteredQuestions(data.questions);
        setQuestionTypeChoice("");
        setState("ready");
        setCurrentQuestion(0);
        setAnswers({});
        setScore(0);
      } catch (err: any) {
        toast({ title: "Error", description: err.message });
        navigate("/");
      }
    };

    fetchQuestions();
  }, [location.state, navigate]);

  const handleStart = () => {
    setState("in-progress");
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    // Determine the questions that are actually part of the test
    const questionsToShow = questionTypeChoice
      ? filteredQuestions.filter(q => q.type === questionTypeChoice)
      : filteredQuestions;

    if (currentQuestion < questionsToShow.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      console.log('[Test] handleNext: Calling handleSubmit');
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Determine the questions that were actually part of the test
    const questionsToShow = questionTypeChoice
      ? filteredQuestions.filter(q => q.type === questionTypeChoice)
      : filteredQuestions;

    let correct = 0;
    questionsToShow.forEach((q, i) => {
      const answer = answers[i];
      if (q.type === 'mcq') {
        if (answer === q.answer) {
          correct++;
        }
      } else if (q.type === 'coding') {
        // A coding question is correct if all test cases passed
        if (answer?.results && answer.results.every(r => r.passed)) {
          correct++;
        }
      }
    });
    setScore(correct);

    // Update streak and activity only if user is logged in
    if (profile) {
      try {
        // Submit test results and update streak in a single API call
        const res = await fetch(`/api/profile/streak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({
            topic: topic.toUpperCase(),
            score: correct,
            totalQuestions: questionsToShow.length,
          }),
        });
        const data = await res.json();

        refresh(); // Refresh user profile to get updated streak in context
        toast({ title: "Progress Updated!", description: "Your streak and activity have been recorded." });

        // Only show streak animation for first test of the day
        if (data.isFirstTestOfDay) {
          console.log('[Test] handleSubmit: First test of day, triggering animation with streak:', data.streak);
          setNewStreak(data.streak);
          setState("animating-streak");
          return;
        } else {
          console.log('[Test] handleSubmit: Not first test of day, no animation');
        }
      } catch (err: any) {
        console.error("Failed to update progress:", err);
        toast({ title: "Progress Update Failed", description: err.message });
      }
    }

    setFinishedTestQuestions(questionsToShow);
    setState("finished");
  };

  // Handle navigation after animation
  const handleAnimationComplete = () => {
    navigate("/");
  };

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (state === "animating-streak") {
    console.log('[Test] Rendering StreakCompletionAnimation with streak:', newStreak);
    return <StreakCompletionAnimation streak={newStreak} onComplete={handleAnimationComplete} />;
  }

  if (state === "ready") {
    // Only show type selection for DSA, ML, AI
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <CardTitle className="text-2xl flex-1 text-center">Choose Question Type</CardTitle>
            <div className="w-9 h-9"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Select which type of questions you want to practice for {topic.toUpperCase()}.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                variant={questionTypeChoice === "mcq" ? "default" : "outline"}
                onClick={() => setQuestionTypeChoice("mcq")}
                size="lg"
              >
                MCQ Only
              </Button>
              <Button
                variant={questionTypeChoice === "coding" ? "default" : "outline"}
                onClick={() => setQuestionTypeChoice("coding")}
                size="lg"
              >
                Coding Only
              </Button>
            </div>
            {questionTypeChoice && (
              questions.filter(q => q.type === questionTypeChoice).length > 0 ? (
                <div className="flex justify-center mt-4">
                  <Button size="lg" onClick={() => {
                    setFilteredQuestions(
                      questions.filter(q => q.type === questionTypeChoice)
                    );
                    setState("in-progress");
                    setCurrentQuestion(0);
                    setAnswers({});
                    setScore(0);
                  }}>
                    Start {questionTypeChoice === "mcq" ? "MCQ" : "Coding"} Test
                  </Button>
                </div>
              ) : (
                <div className="text-center text-red-600 font-semibold mt-4">
                  No {questionTypeChoice === "mcq" ? "MCQ" : "Coding"} questions available for this topic.
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "finished") {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Test Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">
                Score: {score}/{finishedTestQuestions.length}
              </p>
              <p className="text-muted-foreground">
                {score === finishedTestQuestions.length ? "Perfect score! 🎉" :
                  score >= finishedTestQuestions.length * 0.7 ? "Great job! 🌟" :
                    "Keep practicing! 💪"}
              </p>
            </div>
            <div className="space-y-4">
              {finishedTestQuestions.map((q, i) => (
                <Card key={i} className={
                  q.type === 'mcq'
                    ? (answers[i] === q.answer ? "border-green-500" : "border-red-500")
                    : (answers[i]?.results?.every((r: any) => r.passed) ? "border-green-500" : "border-red-500")
                }>
                  <CardContent className="pt-6">
                    <p className="font-semibold mb-2">Q{i + 1}: {q.question}</p>
                    {q.type === 'mcq' && (
                      <div className="space-y-2">
                        <div className="mb-2">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                            <span className="font-semibold whitespace-nowrap pt-1">Your Answer:</span>
                            <div className="flex-1 min-w-0">
                              <span className={`inline-block px-3 py-1.5 rounded text-white break-words w-full ${answers[i] === q.answer ? 'bg-green-500' : 'bg-red-500'}`}>
                                {answers[i] ? `${answers[i].toUpperCase()}. ${q.options?.[answers[i]]}` : 'No Answer'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                            <span className="font-semibold whitespace-nowrap pt-1">Correct Answer:</span>
                            <div className="flex-1 min-w-0">
                              <span className="inline-block px-3 py-1.5 rounded bg-green-500 text-white break-words w-full">
                                {q.answer?.toUpperCase()}. {q.options?.[q.answer!]}
                              </span>
                            </div>
                          </div>
                        </div>
                        {q.explanation && (
                          <div className="mt-3">
                            <p className="font-semibold mb-1">Explanation:</p>
                            <div className="bg-muted p-3 rounded-md text-sm break-words whitespace-pre-wrap">
                              {q.explanation}
                            </div>
                          </div>
                        )}
                        {q.company && (
                          <div className="mt-3">
                            <p className="font-semibold mb-1">Company:</p>
                            <div className="inline-block px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium">
                              {q.company}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {q.type === 'coding' && (
                      <div className="space-y-2">
                        <div className="w-full overflow-hidden">
                          <span className="font-semibold">Your Code:</span>
                          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-1 text-xs sm:text-sm overflow-x-auto max-w-full">
                            <code className="whitespace-pre-wrap break-words">
                              {answers[i]?.code || "No code submitted."}
                            </code>
                          </pre>
                        </div>
                        <div>
                          <span className="font-semibold">Results:</span>
                          {answers[i]?.results ? (
                            <ul className="list-disc list-inside">
                              {answers[i].results.map((r: any, idx: number) => (
                                <li key={idx} className={r.passed ? 'text-green-600' : 'text-red-600'}>
                                  Test Case {idx + 1}: {r.passed ? 'Passed' : 'Failed'}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No results available.</p>
                          )}
                        </div>
                        {q.explanation && (
                          <div className="mt-3">
                            <p className="font-semibold mb-1">Explanation:</p>
                            <div className="bg-muted p-3 rounded-md text-sm break-words whitespace-pre-wrap">
                              {q.explanation}
                            </div>
                          </div>
                        )}
                        {q.company && (
                          <div className="mt-3">
                            <p className="font-semibold mb-1">Company:</p>
                            <div className="inline-block px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium">
                              {q.company}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button onClick={() => navigate("/")}>Back to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questionsToShow = filteredQuestions.length ? filteredQuestions : questions;
  const question = questionsToShow[currentQuestion];

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
        {/* You can add score, summary, or actions here */}
        <Link to="/"><Button>Go Home</Button></Link>
      </div>
    );
  }
  const progress = ((currentQuestion + 1) / questionsToShow.length) * 100;

  // Markdown/code rendering for question text
  function renderQuestionText(text: string) {
    // Very basic: render code blocks and inline code
    if (!text) return null;
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let idx = 0;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={idx++}>{text.slice(lastIndex, match.index)}</span>);
      }
      parts.push(<pre key={idx++} className="bg-muted rounded p-2 my-2 overflow-x-auto"><code>{match[1]}</code></pre>);
      lastIndex = codeBlockRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(<span key={idx++}>{text.slice(lastIndex)}</span>);
    }
    return <>{parts}</>;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center gap-4 px-8 py-4 border-b bg-white/80 dark:bg-slate-900/80 shadow-sm">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">
          Question {currentQuestion + 1} of {questionsToShow.length}
        </h2>
        <span className="text-sm text-muted-foreground ml-auto">
          {topic.toUpperCase()}
        </span>
      </div>
      <Progress value={progress} className="h-2 mx-8 mt-2" />
      <div className="flex-1 w-full flex flex-col md:flex-row gap-0 overflow-hidden">
        {/* MCQ question full height center */}
        {question.type === 'mcq' && (
          <div className="flex-1 flex justify-center items-center">
            <Card className="w-full max-w-2xl mx-auto shadow-xl">
              <CardContent className="pt-8 pb-10">
                <div className="text-lg font-medium mb-4">{renderQuestionText(question.question)}</div>
                {question.options && Object.keys(question.options).length > 0 ? (
                  <RadioGroup
                    value={answers[currentQuestion] || ""}
                    onValueChange={handleAnswer}
                    className="space-y-3"
                  >
                    {Object.entries(question.options).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent"
                      >
                        <RadioGroupItem value={key} id={`q${currentQuestion}_${key}`} />
                        <span className="font-medium">{key.toUpperCase()}.</span>
                        <span>{value}</span>
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-red-600 font-semibold mt-2">No options available for this question.</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        {/* Coding question split view full height */}
        {question.type === 'coding' && (
          <div className="flex-1 flex flex-col md:flex-row h-full w-full overflow-hidden">
            {/* Left: Question Prompt */}
            <div className="md:w-1/2 w-full h-full overflow-y-auto px-8 py-10 bg-white/90 dark:bg-slate-900/90 border-r">
              <div className="text-lg font-medium mb-4">{renderQuestionText(question.question)}</div>
              {question.sampleInput && (
                <div className="mb-2">
                  <span className="font-semibold">Sample Input:</span>
                  <pre className="bg-muted rounded p-2 my-1 overflow-x-auto whitespace-pre-wrap">{question.sampleInput}</pre>
                </div>
              )}
              {question.sampleOutput && (
                <div className="mb-2">
                  <span className="font-semibold">Sample Output:</span>
                  <pre className="bg-muted rounded p-2 my-1 overflow-x-auto whitespace-pre-wrap">{question.sampleOutput}</pre>
                </div>
              )}
              {question.constraints && (
                <div className="mb-2">
                  <span className="font-semibold">Constraints:</span>
                  <pre className="bg-muted rounded p-2 my-1 overflow-x-auto whitespace-pre-wrap">{question.constraints}</pre>
                </div>
              )}
              {question.explanation && (
                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold">Explanation:</span> {question.explanation}
                </p>
              )}
              {question.company && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Company:</span> {question.company}
                </p>
              )}
            </div>
            {/* Right: Code Editor & Results */}
            <div className="md:w-1/2 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-800 px-8 py-10 overflow-y-auto">
              <CodeEditor
                key={currentQuestion}
                starterCode={question.starterCode}
                starterCodes={question.starterCodes}
                loading={!!answers[currentQuestion]?.loading}
                error={answers[currentQuestion]?.error}
                hideTestCases={true}
                onRun={async ({ code, language }) => {
                  // Use question.testCases if present, else fallback to sampleInput/sampleOutput
                  let actualTestCases = question.testCases;
                  if (!actualTestCases || !Array.isArray(actualTestCases) || actualTestCases.length === 0) {
                    actualTestCases = question.sampleInput && question.sampleOutput
                      ? [{ input: question.sampleInput, expectedOutput: question.sampleOutput }]
                      : [];
                  }
                  setAnswers(prev => ({ ...prev, [currentQuestion]: { loading: true } }));
                  try {
                    const res = await fetch('http://localhost:3002/api/compile', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ code, language, testCases: actualTestCases }),
                    });
                    const data = await res.json();
                    setAnswers(prev => ({ ...prev, [currentQuestion]: { code, language, results: data.results, loading: false, error: data.error || undefined } }));
                  } catch (err) {
                    setAnswers(prev => ({ ...prev, [currentQuestion]: { code, language, results: [], error: 'Error running code', loading: false } }));
                  }
                }}
              />
              {answers[currentQuestion]?.results && (
                <div className="mt-4 text-slate-800 dark:text-slate-200 w-full max-w-full">
                  {/* Summary of passed/failed test cases */}
                  {(() => {
                    const results = answers[currentQuestion].results;
                    const passed = results.filter((r: any) => r.passed).length;
                    const total = results.length;
                    return (
                      <div className="mb-2 font-semibold break-words overflow-wrap-anywhere max-w-full">
                        Passed: <span className="text-green-600 dark:text-green-400">{passed}</span> / <span className="text-blue-700 dark:text-blue-400">{total}</span> test cases
                      </div>
                    );
                  })()}
                  <div className="font-semibold mb-2">Results:</div>
                  <ul className="space-y-2 w-full max-w-full">
                    {answers[currentQuestion].results.map((r, i) => (
                      <li
                        key={i}
                        className={`p-3 rounded border w-full max-w-full ${r.passed
                            ? 'border-green-500 bg-green-100 dark:bg-green-900/50'
                            : 'border-red-500 bg-red-100 dark:bg-red-900/50'
                          }`}
                      >
                        <div className="font-semibold">
                          Test Case {i + 1}:{' '}
                          <span className={r.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {r.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <div className="mt-2">
                          <b className="text-sm">Input:</b>
                          <pre className="mt-1 p-2 rounded bg-slate-200 dark:bg-slate-700 text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full overflow-x-auto">
                            {r.input}
                          </pre>
                        </div>
                        <div className="mt-2">
                          <b className="text-sm">Your Output:</b>
                          <pre className="mt-1 p-2 rounded bg-slate-200 dark:bg-slate-700 text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full overflow-x-auto">
                            {r.output}
                          </pre>
                        </div>
                        {!r.passed && (
                          <div className="mt-2">
                            <b className="text-sm">Expected Output:</b>
                            <pre className="mt-1 p-2 rounded bg-slate-200 dark:bg-slate-700 text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full overflow-x-auto">
                              {r.expectedOutput}
                            </pre>
                          </div>
                        )}
                        {r.error && (
                          <div className="mt-2 text-red-600 dark:text-red-400">
                            <b>Error:</b>
                            <pre className="mt-1 p-2 rounded bg-red-100 dark:bg-red-900/50 text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full overflow-x-auto">
                              {r.error}
                            </pre>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Navigation */}
      <div className="flex justify-between items-center px-8 py-4 border-t bg-white/80 dark:bg-slate-900/80">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
        >
          {currentQuestion === questionsToShow.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
} 