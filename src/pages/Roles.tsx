import React, { useState } from "react";
import { Link } from "react-router-dom";
import SkillRoadmapModal from "@/components/SkillRoadmapModal";

// List of top growing roles for freshers in 2025
const roles = [
  {
    title: "AI/ML Engineer",
    description: "AI/ML Engineers build, train, and deploy machine learning and artificial intelligence models to solve real-world problems. They handle data preprocessing, feature engineering, algorithm selection, model training, evaluation, and deployment. They also work on integrating AI solutions into products, optimizing models for performance, and staying updated with the latest research and tools. This role is at the forefront of innovation, powering automation, personalization, and intelligent systems across industries.",
    skills: ["Python", "TensorFlow", "PyTorch", "Data Analysis", "Statistics", "Machine Learning Algorithms", "Model Deployment", "Data Preprocessing"]
  },
  {
    title: "Data Analyst / Data Scientist",
    description: "Data Analysts and Data Scientists extract actionable insights from large datasets. They clean, process, and analyze data, build dashboards, and create predictive models to support business decisions. Their work involves statistical analysis, data visualization, storytelling with data, and often collaboration with business and engineering teams. This role is critical for organizations looking to leverage data for strategic advantage.",
    skills: ["SQL", "Python", "R", "Data Visualization", "Statistics", "Excel", "Power BI", "Tableau", "Machine Learning"]
  },
  {
    title: "Cloud Engineer",
    description: "Cloud Engineers design, deploy, and manage scalable cloud infrastructure and services using platforms like AWS, Azure, or Google Cloud. They focus on automation, security, performance, and cost optimization. Responsibilities include setting up CI/CD pipelines, managing cloud resources, and ensuring high availability and disaster recovery. Cloud skills are in high demand as businesses migrate to cloud-native architectures.",
    skills: ["AWS", "Azure", "Google Cloud", "DevOps", "CI/CD", "Docker", "Kubernetes", "Infrastructure as Code", "Scripting"]
  },
  {
    title: "Cybersecurity Analyst",
    description: "Cybersecurity Analysts protect organizations from cyber threats by monitoring systems, investigating incidents, and implementing security measures. They conduct vulnerability assessments, respond to breaches, and educate teams about best practices. As digital threats evolve, this role is essential for safeguarding sensitive data and maintaining business continuity.",
    skills: ["Networking", "Security Tools", "Ethical Hacking", "Risk Assessment", "Firewalls", "Incident Response", "SIEM", "Penetration Testing"]
  },
  {
    title: "Full Stack Developer",
    description: "Full Stack Developers build both the frontend and backend of web applications. They design user interfaces, develop APIs, manage databases, and ensure seamless integration between client and server. This versatile role requires a broad understanding of web technologies and the ability to deliver complete solutions from scratch.",
    skills: ["JavaScript", "React", "Node.js", "HTML/CSS", "Databases (SQL/NoSQL)", "REST APIs", "Version Control (Git)", "Testing"]
  },
  {
    title: "DevOps Engineer",
    description: "DevOps Engineers automate and streamline software development and deployment processes. They build CI/CD pipelines, manage infrastructure, monitor systems, and ensure rapid delivery of reliable software. DevOps bridges the gap between development and operations, fostering a culture of collaboration and continuous improvement.",
    skills: ["CI/CD", "Scripting (Bash, Python)", "Cloud Platforms", "Docker", "Kubernetes", "Infrastructure as Code", "Monitoring Tools", "Automation"]
  },
  {
    title: "Product Manager (Tech)",
    description: "Product Managers in tech define product vision, gather requirements, prioritize features, and work with cross-functional teams to deliver impactful products. They balance user needs, business goals, and technical feasibility, using data and user feedback to iterate and improve. This role is ideal for those who enjoy strategy, leadership, and working at the intersection of business and technology.",
    skills: ["Communication", "Analytics", "Agile Methodologies", "User Research", "Roadmapping", "Stakeholder Management", "Problem Solving"]
  },
  {
    title: "UI/UX Designer",
    description: "UI/UX Designers create intuitive, visually appealing, and user-centered interfaces for web and mobile applications. They conduct user research, design wireframes and prototypes, and collaborate with developers to ensure a seamless user experience. Their work directly impacts user satisfaction and product adoption.",
    skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Interaction Design", "Usability Testing", "Design Systems"]
  },
  {
    title: "Business Analyst",
    description: "Business Analysts analyze business processes, gather requirements, and help deliver IT solutions that improve efficiency and drive value. They act as a bridge between stakeholders and technical teams, ensuring that solutions meet business needs and are delivered on time and within scope.",
    skills: ["Communication", "Documentation", "Process Modeling", "Data Analysis", "Requirements Gathering", "Problem Solving", "Stakeholder Management"]
  },
  {
    title: "Digital Marketing Specialist",
    description: "Digital Marketing Specialists plan and execute online marketing campaigns, manage SEO/SEM, and develop social media strategies to grow brand presence and drive engagement. They analyze campaign performance, create compelling content, and stay updated on digital trends. This role is perfect for creative thinkers with a passion for technology and analytics.",
    skills: ["Analytics", "Content Creation", "SEO/SEM", "Google Ads", "Social Media Marketing", "Email Marketing", "Copywriting", "Data Analysis"]
  },
  {
    title: "Blockchain Developer",
    description: "Blockchain Developers build decentralized applications (dApps) and smart contracts using blockchain technology. They work on protocols, cryptography, and consensus mechanisms to create secure, transparent, and efficient systems. This is a cutting-edge field with applications in finance, supply chain, and beyond.",
    skills: ["Solidity", "Ethereum", "Blockchain Fundamentals", "Cryptography", "Smart Contracts", "Web3.js", "Distributed Systems"]
  },
  {
    title: "Robotics Engineer",
    description: "Robotics Engineers design, build, and program robots for industries such as manufacturing, healthcare, and logistics. They integrate hardware and software, develop control systems, and work on automation solutions to improve productivity and safety.",
    skills: ["Embedded Systems", "C/C++", "Automation", "Sensors", "Control Systems", "Robotics Frameworks", "Mechanical Design"]
  },
  {
    title: "AR/VR Developer",
    description: "AR/VR Developers create immersive augmented and virtual reality experiences for gaming, education, healthcare, and more. They work with 3D modeling, animation, and real-time rendering to bring digital worlds to life.",
    skills: ["Unity", "Unreal Engine", "3D Modeling", "C#", "C++", "Animation", "XR SDKs"]
  },
  {
    title: "Quality Assurance (QA) Engineer",
    description: "QA Engineers test software to identify bugs, ensure product quality, and verify that applications meet requirements. They develop test plans, automate testing processes, and collaborate with developers to resolve issues. Quality assurance is vital for delivering reliable and user-friendly products.",
    skills: ["Manual Testing", "Automated Testing", "Selenium", "Bug Tracking", "Scripting", "Test Planning", "Quality Standards"]
  },
  {
    title: "Technical Content Writer",
    description: "Technical Content Writers create documentation, tutorials, and articles that explain complex technical topics in a clear and accessible way. They work closely with engineers and product teams to produce guides, blog posts, and help resources for users and developers.",
    skills: ["Writing", "Research", "Technical Knowledge", "SEO", "Documentation", "Editing", "Content Strategy"]
  }
];

export default function RolesPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSkill(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6 flex justify-center">
        <Link
          to="/"
          className="w-full max-w-xs px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium shadow hover:bg-blue-200 transition mb-2 text-center"
        >
          ← Back to Home
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Top Growing Roles for Freshers (2025)</h1>
      <div className="space-y-8">
        {roles.map((role, idx) => (
          <div key={idx} className="bg-card/80 p-6 rounded-xl border shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">{role.title}</h2>
            <p className="text-base text-muted-foreground mb-3">{role.description}</p>
            <div>
              <span className="font-semibold text-sm text-primary">Skills Required:</span>
              <div className="flex flex-wrap gap-y-3 gap-x-3 mt-2">
                {role.skills.map((skill, i) => (
                  <button
                    key={i}
                    className="rounded-full px-4 py-1 font-semibold bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 text-white shadow-sm hover:from-blue-500 hover:to-indigo-600 hover:scale-105 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => handleSkillClick(skill)}
                    type="button"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <SkillRoadmapModal skill={selectedSkill || ""} open={modalOpen} onClose={handleModalClose} />
    </div>
  );
}
