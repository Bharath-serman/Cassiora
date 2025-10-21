import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown, Target } from 'lucide-react';

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

interface InterviewAnalysisProps {
  feedback: FeedbackData;
  onClose: () => void;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold text-red-400 border-b border-gray-700 pb-2 mb-4">{title}</h3>
    <div className="text-gray-300 space-y-4">{children}</div>
  </div>
);

const InterviewAnalysis = ({ feedback, onClose }: InterviewAnalysisProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-red-500/50 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Interview Analysis & Feedback</h2>
        </div>
        <div className="p-8 overflow-y-auto space-y-8">

          <Section title="Overall Performance Summary">
            <p>{feedback.overallSummary}</p>
          </Section>

          <Section title="Question-by-Question Breakdown">
            {feedback.questionBreakdown.map((item, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg mb-6">
                <p className="text-lg font-semibold text-white mb-2">Question: "{item.question}"</p>
                <blockquote className="border-l-4 border-gray-600 pl-4 py-2 text-gray-400 italic mb-4">
                  Your Answer: "{item.answer}"
                </blockquote>
                <p className="mb-4">{item.analysis}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/30 p-3 rounded-lg">
                    <h4 className="font-bold text-green-400 flex items-center gap-2 mb-2"><ThumbsUp size={16} /> Strengths</h4>
                    <ul className="list-disc pl-5 text-green-300/90">{item.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                  <div className="bg-yellow-900/30 p-3 rounded-lg">
                    <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-2"><ThumbsDown size={16} /> Areas for Improvement</h4>
                    <ul className="list-disc pl-5 text-yellow-300/90">{item.improvements.map((imp, i) => <li key={i}>{imp}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Top 3 Actionable Suggestions">
            <ol className="list-decimal pl-5 space-y-2">
              {feedback.finalSuggestions.map((sugg, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Target size={18} className="text-red-400 mt-1 flex-shrink-0" />
                  <span>{sugg}</span>
                </li>
              ))}
            </ol>
          </Section>

        </div>
        <div className="p-4 border-t border-gray-700 text-right bg-gray-900/80 backdrop-blur-sm">
          <Button onClick={onClose}>Close Report</Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnalysis;
