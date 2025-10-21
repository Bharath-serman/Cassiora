import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const hrQuestions: { question: string; answer: React.ReactNode }[] = [
  {
    question: "Tell me about yourself.",
    answer: (
      <div className="space-y-3">
        <p>This is a great opportunity to give your elevator pitch. Structure it like a story.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Present:</strong> Start with your current role or status.
            <em className="block pl-2 text-gray-400">"I'm a [Your Role] with a passion for [Your Interest]."</em>
          </li>
          <li>
            <strong>Past:</strong> Briefly mention a key experience or achievement that shows your skills.
            <em className="block pl-2 text-gray-400">"In my previous role at [Company], I successfully [Key Achievement], which honed my skills in [Skill 1] and [Skill 2]."</em>
          </li>
          <li>
            <strong>Future:</strong> Connect your story to the job you're applying for.
            <em className="block pl-2 text-gray-400">"I'm excited by this opportunity to bring my technical skills and collaborative spirit to your team."</em>
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "Walk me through your resume.",
    answer: (
      <div className="space-y-3">
        <p>Think of this as narrating your career journey. Don't just read it; explain the 'why'.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Foundation:</strong>
            <em className="block pl-2 text-gray-400">"My journey began at [University], where I built a strong foundation in..."</em>
          </li>
          <li>
            <strong>Growth:</strong>
            <em className="block pl-2 text-gray-400">"My role at [Company 1] was pivotal. There, I learned [Key Skill] while working on [Project]. This prepared me for [Company 2], where I took on more responsibility, leading to [Achievement]."</em>
          </li>
          <li>
            <strong>Highlight:</strong>
            <em className="block pl-2 text-gray-400">"A project I'm particularly proud of is [Project Name], as it showcases my ability to [Your Strength]."</em>
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "How would you describe yourself in 3 words?",
    answer: (
      <div className="space-y-3">
        <p>Choose three words that are relevant to the role and be ready to back them up with examples.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Driven:</strong>
            <em className="block pl-2 text-gray-400">"I'm passionate about setting and achieving goals. For example, I taught myself [New Skill] to improve a personal project."</em>
          </li>
          <li>
            <strong>Collaborative:</strong>
            <em className="block pl-2 text-gray-400">"I believe the best results come from teamwork. I thrive in environments where I can share ideas and learn from my colleagues."</em>
          </li>
          <li>
            <strong>Adaptable:</strong>
            <em className="block pl-2 text-gray-400">"The tech landscape is always changing, and I pride myself on my ability to quickly learn new technologies and adjust to new challenges."</em>
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "What are your strengths and weaknesses?",
    answer: (
      <div className="space-y-4">
        <p>Be honest but strategic. Frame your weakness as an area of growth.</p>
        <div>
          <p><strong>Strength: Problem-Solving</strong></p>
          <em className="block pl-4 text-gray-400">"My greatest strength is my ability to deconstruct complex problems. For example, I once resolved a critical bug at [Company] by systematically tracing data flows, which saved the team significant time."</em>
        </div>
        <div>
          <p><strong>Weakness: Over-commitment (as an area of growth)</strong></p>
          <em className="block pl-4 text-gray-400">"In the past, my enthusiasm sometimes led me to take on too much at once. I've since learned to prioritize effectively using methods like the Eisenhower Matrix, which helps me focus on tasks with the highest impact. This ensures I deliver high-quality work without spreading myself too thin."</em>
        </div>
      </div>
    ),
  },
  {
    question: "Where do you see yourself in 5 years?",
    answer: (
      <div className="space-y-3">
        <p>Show ambition and a desire to grow with the company.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Role Progression:</strong>
            <em className="block pl-2 text-gray-400">"I aim to have grown into a senior technical role where I can take on more ownership and contribute to high-impact projects."</em>
          </li>
          <li>
            <strong>Mentorship:</strong>
            <em className="block pl-2 text-gray-400">"I'm also passionate about helping others grow, so I see myself mentoring junior developers."</em>
          </li>
          <li>
            <strong>Expertise:</strong>
            <em className="block pl-2 text-gray-400">"Ultimately, I want to become a subject-matter expert in [Relevant Technology] within the company, helping to drive innovation."</em>
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "What motivates you?",
    answer: (
      <div className="space-y-3">
        <p>Focus on intrinsic motivators that align with a healthy work culture.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Solving Challenges:</strong>
            <em className="block pl-2 text-gray-400">"I'm driven by the intellectual challenge of solving complex problems and creating elegant, effective solutions."</em>
          </li>
          <li>
            <strong>Learning & Growth:</strong>
            <em className="block pl-2 text-gray-400">"The opportunity to continuously learn and master new technologies is a huge motivator for me."</em>
          </li>
          <li>
            <strong>Collaboration & Impact:</strong>
            <em className="block pl-2 text-gray-400">"I thrive on working with a talented team to build something meaningful that has a positive impact on users."</em>
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "How do you handle stress or pressure?",
    answer: (
      <div className="space-y-3">
        <p>Describe a clear, logical process that shows you are reliable and composed.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Organize & Prioritize:</strong>
            <em className="block pl-2 text-gray-400">"My first step is to break down the situation into a clear, prioritized list of tasks. This helps me focus on what's controllable."</em>
          </li>
          <li>
            <strong>Proactive Communication:</strong>
            <em className="block pl-2 text-gray-400">"I believe in transparency. If a deadline is at risk, I communicate early to manage expectations or ask for support."</em>
          </li>
          <li>
            <strong>Focused Execution:</strong>
            <em className="block pl-2 text-gray-400">"I tackle one task at a time to maintain progress and avoid feeling overwhelmed."</em>
          </li>
          <li>
            <strong>Maintain Composure:</strong>
            <em className="block pl-2 text-gray-400">"I take short, strategic breaks to clear my head and ensure I'm working effectively."</em>
          </li>
        </ol>
      </div>
    ),
  },
];

export default function HrQuestionsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 relative">
      <div className="mb-4 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-md bg-gray-800/60 md:bg-transparent text-sm font-medium shadow"
          style={{ minWidth: 0 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">HR Interview Prep</h1>
        <p className="text-lg text-gray-400 mt-2">Common questions and how to answer them.</p>
      </div>
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {hrQuestions.map((item, index) => (
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-red-500/60 rounded-lg shadow-lg shadow-red-500/20 overflow-hidden"
            >
              <AccordionTrigger className="text-lg text-left hover:no-underline text-white p-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-300 px-6 pb-6 pt-0">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
