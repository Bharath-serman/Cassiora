import { Link } from "react-router-dom";

const FAQS = [
  {
    q: "What is Cassiora?",
    a: "Cassiora is an interactive platform for practicing communication, interview, and language skills using chat simulations, voice playback, and daily MCQ tests."
  },
  {
    q: "Is Cassiora free to use?",
    a: "Yes, Cassiora is free for learners. Some advanced features may require an account."
  },
  {
    q: "How do I practice conversations?",
    a: "Simply select a conversation, press play, and follow the chat. Voice playback and fade-in animations make it realistic!"
  },
  {
    q: "Can I track my progress?",
    a: "Yes! Cassiora tracks your daily streaks, quiz results, and lets you take notes in the built-in notepad."
  },
  {
    q: "How is my data used?",
    a: "Your data is used only to enhance your learning experience. We do not sell your information. See our Privacy Policy for details."
  },
  {
    q: "Who can I contact for support?",
    a: "Email us at bharathserman@gmail.com with any questions or feedback."
  }
];

export default function FaqPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">Frequently Asked Questions</h1>
      <div className="space-y-6 text-base leading-relaxed text-muted-foreground bg-card/80 p-6 rounded-xl border shadow">
        {FAQS.map((item, idx) => (
          <div key={idx} className="">
            <h2 className="font-semibold text-lg mb-1">Q: {item.q}</h2>
            <p className="mb-2">{item.a}</p>
          </div>
        ))}
        <div className="pt-6 border-t text-center">
          <Link to="/" className="text-primary underline hover:text-blue-600 transition">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
