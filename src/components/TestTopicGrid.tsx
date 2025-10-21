import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import Tilt from "react-parallax-tilt";

// Define a type for a single topic for better type safety
interface Topic {
  name: string;
  description: string;
  path: string;
  emoji: string;
  gradient: string; // For the main card background
  glow: string; // For the hover glow effect
  topicId?: string; // Matches the topic ID in the database
}

const topics: Topic[] = [
  { 
    name: "DSA", 
    description: "Data Structures & Algorithms", 
    path: "/test", 
    emoji: "📚", 
    gradient: "from-blue-500 to-indigo-600", 
    glow: "shadow-blue-500/50",
    topicId: "dsa"
  },
  { 
    name: "ML", 
    description: "Machine Learning", 
    path: "/test", 
    emoji: "🤖", 
    gradient: "from-green-400 to-teal-500", 
    glow: "shadow-teal-500/50",
    topicId: "ml"
  },
  { 
    name: "AI", 
    description: "Artificial Intelligence", 
    path: "/test", 
    emoji: "🧠", 
    gradient: "from-pink-500 to-rose-500", 
    glow: "shadow-rose-500/50",
    topicId: "ai"
  },
  { 
    name: "Quant", 
    description: "Quantitative Aptitude", 
    path: "/test", 
    emoji: "🧮", 
    gradient: "from-yellow-400 to-amber-500", 
    glow: "shadow-amber-500/50",
    topicId: "quant"
  },
  { 
    name: "LR", 
    description: "Logic & Patterns", 
    path: "/test", 
    emoji: "🔗", 
    gradient: "from-cyan-400 to-sky-500", 
    glow: "shadow-sky-500/50",
    topicId: "lr"
  },
  { 
    name: "Verbal", 
    description: "Verbal Ability", 
    path: "/test", 
    emoji: "🗣️", 
    gradient: "from-purple-500 to-violet-600", 
    glow: "shadow-violet-500/50",
    topicId: "verbal"
  },
  { 
    name: "Comm", 
    description: "Communication Skills", 
    path: "/test", 
    emoji: "💬", 
    gradient: "from-orange-400 to-red-500", 
    glow: "shadow-red-500/50",
    topicId: "comm"
  },
  { 
    name: "Visualizer", 
    description: "DSA Visualizer", 
    path: "/dsa-visualizer", 
    emoji: "📈", 
    gradient: "from-slate-500 to-slate-600", 
    glow: "shadow-slate-500/50" 
  },
  { 
    name: "HR Prep", 
    description: "Interview Questions", 
    path: "/hr-prep", 
    emoji: "👔", 
    gradient: "from-emerald-500 to-lime-600", 
    glow: "shadow-lime-500/50" 
  },
  { 
    name: "Mock Interview", 
    description: "Live HR Simulation", 
    path: "/mock-interview", 
    emoji: "🎥", 
    gradient: "from-red-500 to-orange-500", 
    glow: "shadow-orange-500/50" 
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
};

interface TestTopicGridProps {
  onTopicSelect: (topic: string) => void;
  showLoading: (duration?: number) => void;
}

export default function TestTopicGrid({ onTopicSelect, showLoading }: TestTopicGridProps) {
  const navigate = useNavigate();

  const handleCardClick = (topic: Topic) => {
    showLoading(1000); // Show loading for 1 second
    
    if (topic.path === '/test' && topic.topicId) {
      // For test topics, navigate to /test with the topic in state
      navigate(topic.path, { 
        state: { 
          topic: topic.topicId, // Use the topicId that matches the database
          topicName: topic.name // Keep the display name
        } 
      });
    } else if (topic.path.startsWith('/')) {
      // For other paths, use regular navigation
      navigate(topic.path);
    } else {
      // Fallback to the old behavior if needed
      onTopicSelect(topic.name);
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto px-2 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {topics.map((topic) => (
        <motion.div
          key={topic.name}
          variants={cardVariants}
          whileHover={{ scale: 1.06, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)', borderColor: '#fff' }}
          whileTap={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          tabIndex={0}
          aria-label={topic.name}
          onClick={() => handleCardClick(topic)}
        >
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            glareEnable={true}
            glareMaxOpacity={0.18}
            glarePosition="all"
            className={`relative p-0 pt-2 rounded-3xl text-white cursor-pointer h-[260px] w-full flex flex-col justify-between bg-gradient-to-br ${topic.gradient} border border-white/20 shadow-xl hover:shadow-2xl hover:border-white/40 transition-all duration-300 group overflow-hidden`}
          >
            {/* Abstract SVG blob background */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
              <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id={`blob-gradient-${topic.name}`} x1="0" y1="0" x2="320" y2="200" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff" stopOpacity="0.13" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
                  </linearGradient>
                </defs>
                <path d="M60,40 Q160,0 260,40 Q320,100 260,160 Q160,200 60,160 Q0,100 60,40 Z" fill={`url(#blob-gradient-${topic.name})`} />
              </svg>
            </div>
            {/* Accent bar */}
            <div className={`h-2 w-full rounded-t-3xl mb-2 bg-gradient-to-r ${topic.gradient} group-hover:opacity-90 opacity-70 transition-all duration-300`}></div>
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl z-0"></div>
            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center items-start px-7 py-6">
              <h3 className="font-extrabold text-3xl md:text-4xl drop-shadow-lg mb-2 tracking-tight leading-tight text-white group-hover:text-slate-100 transition-all duration-200">
                {topic.name}
              </h3>
              <div className="w-12 h-1 rounded bg-white/40 mb-2"></div>
              <p className="text-base opacity-90 mt-1 font-medium text-white/90 drop-shadow-sm">
                {topic.description}
              </p>
            </div>
          </Tilt>
        </motion.div>
      ))}
    </motion.div >
  );
}
