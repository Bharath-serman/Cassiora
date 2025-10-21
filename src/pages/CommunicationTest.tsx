import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationChatPlayer } from "@/components/ConversationChatPlayer";

import conversationsData from "../data/conversations.json";

// Type definitions
interface Conversation {
  id: number;
  title: string;
  conversation: { speaker: "A" | "B"; text: string }[];
  questions: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

const conversations: Conversation[] = conversationsData as Conversation[];

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const CommunicationTest: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);

  // Update state when switching conversations
  useEffect(() => {
    setPlaying(false);
    setCurrentLine(0);
    setShowQuestions(false);
    setAnswers(Array(conversations[selectedIdx].questions.length).fill(null));
    setSubmitted(false);
  }, [selectedIdx]);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentLine === conversations[selectedIdx].conversation.length - 1 && playing) {
      setTimeout(() => {
        setShowQuestions(true);
        setPlaying(false);
      }, 1800);
    }
  }, [currentLine, playing]);

  const handleOption = (qIdx: number, optIdx: number) => {
    setAnswers(ans => ans.map((v, i) => (i === qIdx ? optIdx : v)));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="container max-w-xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-lg font-semibold">Back</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Conversation Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conversation selector */}
          <div className="mb-8">
            <label className="block text-base font-semibold mb-2 text-gray-700">Choose a Conversation</label>
            <div className="relative w-full max-w-md">
              <select
                className="block w-full px-4 py-2 pr-8 text-base rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-zinc-900 dark:text-zinc-100 appearance-none transition-colors disabled:bg-gray-100 dark:disabled:bg-zinc-800"
                value={selectedIdx}
                onChange={e => setSelectedIdx(Number(e.target.value))}
                disabled={playing}
              >
                {conversations.map((conv, idx) => (
                  <option key={conv.id} value={idx} className="bg-white dark:bg-zinc-900 text-black dark:text-zinc-100">
                    {conv.title}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-zinc-400">
                ▼
              </span>
            </div>
          </div>

          {/* Audio/Text Toggle */}
          <div className="flex items-center gap-4 mb-4">
            <span className="font-semibold">Mode:</span>
            <button
              type="button"
              disabled={playing}
              onClick={() => {
                if (!audioOnly) {
                  window.speechSynthesis.cancel();
                }
                setAudioOnly(true);
              }}
              className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 focus:outline-none
                ${audioOnly
                  ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-400 dark:text-zinc-900 dark:border-blue-400'
                  : 'bg-zinc-200 text-zinc-900 border-gray-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-700'}
                ${playing ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              aria-pressed={audioOnly}
            >
              Audio Only
            </button>
            <button
              type="button"
              disabled={playing}
              onClick={() => {
                if (audioOnly) {
                  window.speechSynthesis.cancel();
                }
                setAudioOnly(false);
              }}
              className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 focus:outline-none
                ${!audioOnly
                  ? 'bg-blue-700 text-white border-blue-700 dark:bg-blue-400 dark:text-zinc-900 dark:border-blue-400'
                  : 'bg-zinc-200 text-zinc-900 border-gray-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-700'}
                ${playing ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              aria-pressed={!audioOnly}
            >
              Show Text
            </button>
          </div>

          <div className="relative">
            <ConversationChatPlayer
              lines={conversations[selectedIdx].conversation}
              playing={playing}
              onEnd={() => setShowQuestions(true)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              currentLine={currentLine}
              setCurrentLine={setCurrentLine}
              audioOnly={audioOnly}
            />
            {showQuestions && (
              <>
                {/* Overlay lock */}
                <div className="absolute inset-0 bg-black bg-opacity-100 flex flex-col items-center justify-center z-10 rounded-lg">
                  <Button
                    variant="outline"
                    size="lg"
                    className="mb-4"
                    onClick={() => {
                      setShowQuestions(false);
                      setCurrentLine(0);
                      setPlaying(false);
                      setSubmitted(false);
                      setAnswers(Array(conversations[selectedIdx].questions.length).fill(null));
                    }}
                  >
                    Replay Conversation
                  </Button>
                  <span className="text-white text-lg font-semibold">Conversation Locked</span>
                </div>
              </>
            )}
          </div>

          {showQuestions && (
            <div className="mt-8 space-y-6">
              <div className="font-semibold text-lg mb-2">Questions about the Conversation</div>
              {conversations[selectedIdx].questions.map((q, qIdx) => (
                <div key={qIdx} className="mb-4">
                  <div className="mb-2">{qIdx + 1}. {q.question}</div>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q${qIdx}`}
                          checked={answers[qIdx] === optIdx}
                          onChange={() => handleOption(qIdx, optIdx)}
                          disabled={submitted}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {submitted && (
                    <div className={
                      answers[qIdx] === q.answer
                        ? "text-green-600 font-semibold mt-1"
                        : "text-red-600 font-semibold mt-1"
                    }>
                      {answers[qIdx] === q.answer ? "Correct!" : `Incorrect. Correct answer: ${q.options[q.answer]}`}
                    </div>
                  )}
                </div>
              ))}
              {!submitted && (
                <Button onClick={handleSubmit} className="mt-4">Submit Answers</Button>
              )}
              {submitted && (
                <div className="mt-4 font-bold text-center text-primary">
                  Score: {answers.filter((ans, i) => ans === conversations[selectedIdx].questions[i].answer).length} / {conversations[selectedIdx].questions.length}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationTest;
