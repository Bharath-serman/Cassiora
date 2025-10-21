import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const interviewSentences = [
  "Could you describe a situation where you had to adapt quickly to significant changes in your work environment, and explain how you managed the transition?",
  "In your opinion, what are the most critical qualities of an effective leader, and how have you demonstrated these in your previous roles?",
  "Tell me about a time when you encountered a major obstacle in a project and the specific steps you took to overcome it.",
  "How do you prioritize competing deadlines while maintaining a high standard of quality in your work?",
  "Describe an instance when you had to communicate a complex idea to someone with less technical knowledge—how did you ensure your message was understood?",
  "Reflect on a professional failure you have experienced, what you learned from it, and how it influenced your future approach.",
  "If you could change one thing about your previous job to make it more effective, what would it be and why?",
  "Explain how you stay updated with industry trends and how you apply new knowledge to your work.",
  "Discuss a time when you had to mediate a conflict between team members and the strategies you used to resolve it.",
  "What motivates you to achieve your goals, and how do you maintain your motivation during challenging times?"
];

function getSimilarityScore(a: string, b: string): number {
  // Very simple similarity: percentage of matching words
  const aWords = a.toLowerCase().split(/\s+/);
  const bWords = b.toLowerCase().split(/\s+/);
  const matches = aWords.filter(word => bWords.includes(word)).length;
  return Math.round((matches / Math.max(aWords.length, bWords.length)) * 100);
}

const InterviewSpeakingPractice: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [listening, setListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [score, setScore] = useState<number|null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance|null>(null);

  const speakSentence = () => {
    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(interviewSentences[current]);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    setListening(true);
    setUserTranscript("");
    setScore(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserTranscript(transcript);
      const sim = getSimilarityScore(interviewSentences[current], transcript);
      setScore(sim);
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
      // No alert on cancel or error
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const cancelListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setListening(false);
    }
  };

  const nextSentence = () => {
    setCurrent((prev) => (prev + 1) % interviewSentences.length);
    setUserTranscript("");
    setScore(null);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="w-full flex flex-col items-start px-4 mt-0.05 mb-4">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Back to Dashboard"
        >
          Back
        </button>
      </div>
      <h2 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-gray-100 tracking-tight text-center drop-shadow-lg">Interview Speaking Practice</h2>
      <div className="w-full flex flex-col items-center mb-12 px-4">
        <div className="text-2xl md:text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 max-w-4xl py-6">
          {interviewSentences[current]}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-12 w-full justify-center items-center">
        <button
          onClick={speakSentence}
          className={`w-40 h-16 text-xl font-bold rounded-2xl transition-colors duration-200 ${isSpeaking ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400'} text-white`}
        >
          {isSpeaking ? 'Stop' : 'Listen'}
        </button>
        <button
          onClick={listening ? cancelListening : startListening}
          className={`w-40 h-16 text-xl font-bold rounded-2xl transition-colors duration-200 ${listening ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400' : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400'} text-white`}
        >
          {listening ? 'Cancel' : 'Speak'}
        </button>
        <button
          onClick={nextSentence}
          className="w-40 h-16 text-xl font-bold rounded-2xl bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          Next
        </button>
      </div>
      {userTranscript && (
        <div className="w-full flex flex-col items-center mb-4 px-4">
          <div className="w-full text-center text-lg">
            <span className="font-semibold text-gray-900 dark:text-gray-100">You said:</span> <span className="text-gray-800 dark:text-gray-200">"{userTranscript}"</span>
          </div>
        </div>
      )}
      {score !== null && (
        <div className="w-full flex flex-col items-center mb-8 px-4">
          <div className="w-full text-center text-lg">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Similarity Score:</span> <span className="text-gray-800 dark:text-gray-200">{score}%</span>
            <div className="mt-2 text-gray-800 dark:text-gray-200">
              {score > 80 ? "Excellent!" : score > 60 ? "Good job!" : "Keep practicing!"}
            </div>
          </div>
        </div>
      )}
      {listening && <div className="text-blue-600 dark:text-blue-400 mt-2 text-lg">Listening...</div>}
      <div className="mt-10 mb-4 text-base text-gray-500 dark:text-gray-400 text-center">Tip: Use Chrome for best voice support.</div>
    </div>
  );
};

export default InterviewSpeakingPractice;
