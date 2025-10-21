import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Video, PhoneOff, ArrowLeft, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InterviewAnalysis from '@/components/InterviewAnalysis';
import { useNavigate } from 'react-router-dom';

// Define the structure of the feedback object
interface FeedbackData {
  overallSummary: string;
  questionBreakdown: {
    question: string;
    answer: string;
    analysis: string;
    strengths: string[];
    improvements: string[];
  }[];
  finalSuggestions: string[];
}

const jobRoles = [
  "General HR",
  "Full Stack Developer",
  "MERN Stack Developer",
  "Data Analyst",
  "Database Engineer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "AI/ML Engineer"
];

const MockInterviewPage = () => {
  const navigate = useNavigate();
  const [interviewState, setInterviewState] = useState<'idle' | 'fetching' | 'starting' | 'asking' | 'listening' | 'processing_answer' | 'finished'>('idle');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [transcript, setTranscript] = useState<{ question: string; answer: string; }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(jobRoles[0]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FeedbackData | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const [currentSpokenText, setCurrentSpokenText] = useState('');

  // --- Core Functions ---

  const speak = (text: string, onEnd: () => void) => {
    setCurrentSpokenText(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setCurrentSpokenText('');
      onEnd();
    };
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setInterviewState('listening');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
const API_BASE = "http://localhost:3001";
  const fetchQuestionsAndStart = async () => {
    setInterviewState('fetching');
    try {
      const response = await fetch(`${API_BASE}/api/interview/questions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({ role: selectedRole }),
});

      if (!response.ok) throw new Error('Failed to fetch questions.');

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('AI did not return any questions.');
      }
      setQuestions(data.questions);
      setInterviewState('starting');

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      setMediaStream(stream);

    } catch (error) {
      console.error(error);
      alert('Could not start the interview. Please ensure the server is running and try again.');
      setInterviewState('idle');
    }
  };

  const startNewInterview = () => {
    setAnalysisResult(null);
    setTranscript([]);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setInterviewState('idle');
  }

  const handleEndInterview = useCallback(async () => {
    window.speechSynthesis.cancel(); // Immediately stop any ongoing speech
    setCurrentSpokenText('');
    setInterviewState('finished');
    stopListening();
    mediaStream?.getTracks().forEach(track => track.stop());
    setMediaStream(null);

    if (transcript.length === 0) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE}/api/interview/analyze`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify({ transcript, role: selectedRole }),
});

      if (!response.ok) throw new Error('Analysis failed');
      const result = await response.json();
      setAnalysisResult(result.feedback);
    } catch (error) {
      console.error('Error analyzing transcript:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [mediaStream, transcript, selectedRole]);

  // --- Effects ---

  // Effect to set up speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript.trim();
          if (finalTranscript) {
            recognition.stop(); // Stop listening as soon as we have a final result
            setInterviewState('processing_answer');
            setTranscript(prev => [...prev, { question: questions[currentQuestionIndex], answer: finalTranscript }]);
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
            } else {
              handleEndInterview();
            }
          }
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [questions, currentQuestionIndex, handleEndInterview]); // Correct dependencies

  // Effect to drive the interview by asking questions
  useEffect(() => {
    const askQuestion = () => {
      setInterviewState('asking');
      speak(questions[currentQuestionIndex], () => {
        startListening();
      });
    };

    // Ask the first question when ready
    if (interviewState === 'starting' && questions.length > 0 && transcript.length === 0) {
      askQuestion();
    } 
    // Ask subsequent questions when an answer has been processed
    else if (interviewState === 'processing_answer' && currentQuestionIndex > 0 && currentQuestionIndex === transcript.length) {
      askQuestion();
    }
  }, [interviewState, questions, currentQuestionIndex, transcript.length]); // Correct dependencies

  // --- JSX ---
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
      {analysisResult && (
        <InterviewAnalysis 
          feedback={analysisResult} 
          onClose={() => setAnalysisResult(null)} 
        />
      )}
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Cassiora Mock Interview</h1>
        <Button onClick={() => navigate('/')} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" /> 
          Back to Dashboard
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6">
        
        {/* Video Panels */}
        <div className="w-full max-w-6xl flex-1 flex items-stretch justify-center gap-6">
          {interviewState === 'idle' || interviewState === 'fetching' ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-300">Ready when you are.</h2>
              <p className="text-gray-600 dark:text-gray-500 mt-2">Your camera feed will appear here once the interview starts.</p>
            </div>
          ) : (
            <>
              {/* AI Interviewer Panel */}
              <div className={`flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 relative transition-all duration-300 ${interviewState === 'asking' ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-gray-200 dark:border-gray-800'}`}>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <p className="text-xl font-bold">AI Interviewer</p>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">{interviewState === 'asking' ? 'Asking...' : 'Listening...'}</p>
                {interviewState === 'asking' && currentSpokenText && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-black/60 p-4 m-2 rounded-lg">
                    <p className="text-center text-sm max-h-24 overflow-y-auto text-gray-800 dark:text-white">{currentSpokenText}</p>
                  </div>
                )}
              </div>

              {/* User Video Panel */}
              <div className={`flex-1 bg-black rounded-lg border overflow-hidden relative transition-all duration-300 ${interviewState === 'listening' ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-gray-200 dark:border-gray-800'}`}>
                <video ref={userVideoRef} autoPlay muted className="w-full h-full object-cover" />
                <span className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">You</span>
              </div>
              {/* Live subtitle below video for accessibility */}
              {interviewState === 'listening' && (
                <div className="w-full flex justify-center mt-4">
                  <div className="px-6 py-3 rounded-xl bg-black/80 text-white text-xl font-semibold shadow-lg max-w-2xl w-full text-center animate-fade-in">
                    {interimTranscript || '...'}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="shrink-0 w-full max-w-md min-h-[120px] flex flex-col items-center justify-center">
          {interviewState === 'idle' && (
            <div className="text-center animate-fade-in w-full">
              <div className="mb-6">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full h-12 text-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700">
                    {jobRoles.map(role => (
                      <SelectItem key={role} value={role} className="text-lg focus:bg-red-500/20 dark:focus:bg-red-500/50">{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={fetchQuestionsAndStart} size="lg" className="text-xl p-8 rounded-full bg-red-600 hover:bg-red-700">
                Start Interview
              </Button>
            </div>
          )}
          {interviewState === 'fetching' && (
              <div className="flex flex-col items-center text-center animate-fade-in">
                  <Loader2 className="h-12 w-12 animate-spin text-red-500" />
                  <p className="text-xl mt-4">Generating questions for {selectedRole}...</p>
              </div>
          )}
          {(interviewState === 'asking' || interviewState === 'listening' || interviewState === 'processing_answer') && (
            <div className="flex items-center gap-6 animate-fade-in">
              <Button variant="outline" className="p-4 rounded-full bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700" disabled><Video className="h-6 w-6" /></Button>
              <Button onClick={handleEndInterview} variant="destructive" className="p-6 rounded-full">
                  <PhoneOff className="h-8 w-8" />
              </Button>
              <Button variant="outline" className="p-4 rounded-full bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700" disabled><Mic className="h-6 w-6" /></Button>
            </div>
          )}
          {interviewState === 'finished' && !isAnalyzing && (
            <Button onClick={startNewInterview} size="lg" className="w-full animate-fade-in">
              Start New Interview
            </Button>
          )}
        </div>
      </main>

      {/* Modals */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-white/80 dark:bg-black/80 flex flex-col items-center justify-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-xl mt-4 text-gray-800 dark:text-white">Analyzing your performance...</p>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
