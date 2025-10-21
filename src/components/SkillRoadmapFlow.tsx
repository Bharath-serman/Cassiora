import React from "react";
import ReactFlow, { Background, Controls, MiniMap, MarkerType } from "react-flow-renderer";

interface SkillRoadmapFlowProps {
  skill: string;
}

const skillRoadmaps: Record<string, { nodes: string[]; edges: [number, number][] }> = {
  "Python": {
    nodes: [
      "Start",
      "Learn Python Basics",
      "Practice Problem Solving",
      "Object-Oriented Programming",
      "Popular Libraries (NumPy, Pandas)",
      "Build Projects",
      "Advanced Concepts",
      "Contribute to Open Source",
      "Mastery"
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]
    ]
  },
  "JavaScript": {
    nodes: [
      "Start",
      "Learn JS Fundamentals",
      "DOM Manipulation",
      "ES6+ Features",
      "Async Programming",
      "Framework (React/Vue)",
      "Build Projects",
      "Mastery"
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]
    ]
  },
  "SQL": {
    nodes: [
      "Start",
      "Learn SQL Basics",
      "Filtering & Sorting",
      "Joins & Aggregates",
      "Indexes & Keys",
      "Write Complex Queries",
      "Work with Real DB",
      "Build Data Projects",
      "Mastery"
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]
    ]
  },
  "TensorFlow": {
    nodes: [
      "Start",
      "Understand ML Concepts",
      "Install TensorFlow",
      "Build Simple Models",
      "Explore Datasets",
      "Experiment with Layers",
      "Tune Hyperparameters",
      "Deploy Models",
      "Mastery"
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]
    ]
  },
  "PyTorch": {
    nodes: [
      "Start",
      "Understand ML Concepts",
      "Install PyTorch",
      "Build Neural Networks",
      "Experiment with Data",
      "Tune Models",
      "Deploy Models",
      "Mastery"
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]
    ]
  },
  // Data Analysis
  "Data Analysis": {
    nodes: ["Start", "Learn Data Basics", "Explore Datasets", "Statistical Analysis", "Data Visualization", "Build Projects", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]
  },
  // Statistics
  "Statistics": {
    nodes: ["Start", "Descriptive Stats", "Probability", "Inferential Stats", "Hypothesis Testing", "Regression", "Advanced Topics", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Machine Learning Algorithms
  "Machine Learning Algorithms": {
    nodes: ["Start", "Supervised Learning", "Unsupervised Learning", "Model Selection", "Feature Engineering", "Model Evaluation", "Tuning", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Model Deployment
  "Model Deployment": {
    nodes: ["Start", "Model Packaging", "API Development", "Containerization", "Cloud Deployment", "Monitoring", "Scaling", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Data Preprocessing
  "Data Preprocessing": {
    nodes: ["Start", "Data Cleaning", "Missing Values", "Encoding", "Scaling", "Feature Selection", "Pipeline Creation", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // R
  "R": {
    nodes: ["Start", "R Basics", "Data Structures", "Data Manipulation", "Visualization", "Statistical Modeling", "Project Work", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Data Visualization
  "Data Visualization": {
    nodes: ["Start", "Charts & Graphs", "Dashboards", "Storytelling", "Advanced Visuals", "Interactivity", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]
  },
  // Excel
  "Excel": {
    nodes: ["Start", "Formulas", "Functions", "Data Analysis", "Pivot Tables", "Charts", "Automation (Macros)", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Power BI
  "Power BI": {
    nodes: ["Start", "Data Import", "Data Modeling", "DAX", "Visualizations", "Dashboards", "Sharing & Collaboration", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Tableau
  "Tableau": {
    nodes: ["Start", "Data Connection", "Basic Visuals", "Calculated Fields", "Dashboards", "Interactivity", "Publishing", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // DevOps
  "DevOps": {
    nodes: ["Start", "Version Control", "CI/CD", "Infrastructure as Code", "Monitoring", "Automation", "Cloud Integration", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // CI/CD
  "CI/CD": {
    nodes: ["Start", "Source Control", "Build Automation", "Testing", "Deployment Automation", "Monitoring", "Rollback", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Docker
  "Docker": {
    nodes: ["Start", "Install Docker", "Images & Containers", "Networking", "Volumes", "Docker Compose", "Deploy Apps", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Kubernetes
  "Kubernetes": {
    nodes: ["Start", "K8s Basics", "Pods & Services", "Deployments", "ConfigMaps & Secrets", "Scaling", "Networking", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Infrastructure as Code
  "Infrastructure as Code": {
    nodes: ["Start", "IaC Tools", "Write Configs", "Provision Resources", "Test Infrastructure", "Automate Changes", "Monitor", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Scripting
  "Scripting": {
    nodes: ["Start", "Choose Language", "Basic Scripts", "File Ops", "Automation Tasks", "Scheduling", "Debugging", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Networking
  "Networking": {
    nodes: ["Start", "Network Layers", "Protocols", "Routing & Switching", "Security", "Troubleshooting", "Monitoring", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Security Tools
  "Security Tools": {
    nodes: ["Start", "Install Tools", "Vulnerability Scanning", "Penetration Testing", "Monitoring", "Incident Response", "Reporting", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Ethical Hacking
  "Ethical Hacking": {
    nodes: ["Start", "Reconnaissance", "Scanning", "Gaining Access", "Maintaining Access", "Clearing Tracks", "Reporting", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Risk Assessment
  "Risk Assessment": {
    nodes: ["Start", "Identify Assets", "Threat Analysis", "Vulnerability Assessment", "Risk Evaluation", "Mitigation", "Reporting", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Firewalls
  "Firewalls": {
    nodes: ["Start", "Types of Firewalls", "Configuration", "Rules & Policies", "Monitoring", "Troubleshooting", "Updates", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Incident Response
  "Incident Response": {
    nodes: ["Start", "Preparation", "Detection", "Containment", "Eradication", "Recovery", "Lessons Learned", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // SIEM
  "SIEM": {
    nodes: ["Start", "Install SIEM", "Log Collection", "Correlation Rules", "Alerting", "Incident Response", "Reporting", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Penetration Testing
  "Penetration Testing": {
    nodes: ["Start", "Planning", "Reconnaissance", "Exploitation", "Post-Exploitation", "Reporting", "Remediation", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // HTML/CSS
  "HTML/CSS": {
    nodes: ["Start", "HTML Basics", "CSS Basics", "Layout & Positioning", "Responsive Design", "Animations", "Frameworks", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Databases (SQL/NoSQL)
  "Databases (SQL/NoSQL)": {
    nodes: ["Start", "DB Concepts", "SQL Basics", "NoSQL Concepts", "CRUD Operations", "Indexing", "Optimization", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // REST APIs
  "REST APIs": {
    nodes: ["Start", "API Basics", "HTTP Methods", "Endpoints", "Authentication", "Testing", "Documentation", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Version Control (Git)
  "Version Control (Git)": {
    nodes: ["Start", "Git Basics", "Branching", "Merging", "Remote Repos", "Collaboration", "Conflict Resolution", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Testing
  "Testing": {
    nodes: ["Start", "Unit Testing", "Integration Testing", "E2E Testing", "Test Automation", "Reporting", "CI Integration", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Bash
  "Bash": {
    nodes: ["Start", "Shell Basics", "Scripting", "File Ops", "Process Control", "Automation", "Debugging", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Cloud Platforms
  "Cloud Platforms": {
    nodes: ["Start", "Cloud Basics", "Service Models", "Deployment", "Scaling", "Monitoring", "Security", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Monitoring Tools
  "Monitoring Tools": {
    nodes: ["Start", "Install Tools", "Configure Monitoring", "Set Alerts", "Analyze Metrics", "Troubleshoot", "Reporting", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Agile Methodologies
  "Agile Methodologies": {
    nodes: ["Start", "Agile Basics", "Scrum/Kanban", "Planning", "Execution", "Review", "Retrospective", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // User Research
  "User Research": {
    nodes: ["Start", "Define Users", "Conduct Research", "Analyze Data", "Synthesize Insights", "Persona Creation", "Apply Findings", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Roadmapping
  "Roadmapping": {
    nodes: ["Start", "Gather Requirements", "Prioritize", "Timeline Planning", "Stakeholder Buy-in", "Execution", "Review", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Stakeholder Management
  "Stakeholder Management": {
    nodes: ["Start", "Identify Stakeholders", "Engagement Plan", "Communication", "Feedback", "Conflict Resolution", "Alignment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Problem Solving
  "Problem Solving": {
    nodes: ["Start", "Define Problem", "Root Cause Analysis", "Ideation", "Solution Design", "Implementation", "Testing", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Figma
  "Figma": {
    nodes: ["Start", "Figma Basics", "Wireframing", "Prototyping", "Components", "Design Systems", "Collaboration", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Adobe XD
  "Adobe XD": {
    nodes: ["Start", "XD Basics", "Wireframing", "Prototyping", "Components", "Design Systems", "Collaboration", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Wireframing
  "Wireframing": {
    nodes: ["Start", "Sketch Ideas", "Low-Fidelity", "Feedback", "Refinement", "High-Fidelity", "Handoff", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Prototyping
  "Prototyping": {
    nodes: ["Start", "Choose Tool", "Create Prototype", "User Testing", "Iterate", "Finalize", "Handoff", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Interaction Design
  "Interaction Design": {
    nodes: ["Start", "Define Interactions", "Design States", "Transitions", "Feedback", "Testing", "Refinement", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Usability Testing
  "Usability Testing": {
    nodes: ["Start", "Test Planning", "Recruit Users", "Conduct Tests", "Analyze Results", "Report Findings", "Iterate", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Design Systems
  "Design Systems": {
    nodes: ["Start", "Component Library", "Design Tokens", "Documentation", "Adoption", "Feedback", "Maintenance", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Documentation
  "Documentation": {
    nodes: ["Start", "Outline", "Drafting", "Review", "Editing", "Publishing", "Feedback", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Process Modeling
  "Process Modeling": {
    nodes: ["Start", "Identify Processes", "Map Steps", "Analyze", "Optimize", "Document", "Review", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Requirements Gathering
  "Requirements Gathering": {
    nodes: ["Start", "Stakeholder Interviews", "Workshops", "Surveys", "Analysis", "Documentation", "Validation", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Analytics
  "Analytics": {
    nodes: ["Start", "Define KPIs", "Data Collection", "Analysis", "Visualization", "Reporting", "Optimization", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Content Creation
  "Content Creation": {
    nodes: ["Start", "Topic Research", "Outline", "Drafting", "Editing", "Publishing", "Promotion", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // SEO/SEM
  "SEO/SEM": {
    nodes: ["Start", "Keyword Research", "On-Page SEO", "Off-Page SEO", "SEM Campaigns", "Analytics", "Optimization", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Google Ads
  "Google Ads": {
    nodes: ["Start", "Account Setup", "Campaign Creation", "Ad Groups", "Targeting", "Budgeting", "Optimization", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Social Media Marketing
  "Social Media Marketing": {
    nodes: ["Start", "Platform Selection", "Content Calendar", "Campaigns", "Engagement", "Analytics", "Optimization", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Email Marketing
  "Email Marketing": {
    nodes: ["Start", "List Building", "Campaign Creation", "Personalization", "A/B Testing", "Analytics", "Optimization", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Copywriting
  "Copywriting": {
    nodes: ["Start", "Audience Research", "Drafting", "Editing", "A/B Testing", "Publishing", "Analysis", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Web3.js
  "Web3.js": {
    nodes: ["Start", "Install Web3.js", "Connect to Blockchain", "Smart Contract Interaction", "Event Handling", "Testing", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Distributed Systems
  "Distributed Systems": {
    nodes: ["Start", "System Design", "Communication", "Consistency Models", "Fault Tolerance", "Scaling", "Testing", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Embedded Systems
  "Embedded Systems": {
    nodes: ["Start", "Microcontrollers", "Programming", "Sensors", "Actuators", "Integration", "Testing", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // C/C++
  "C/C++": {
    nodes: ["Start", "C/C++ Basics", "Data Structures", "Memory Management", "OOP", "Embedded Programming", "Project Work", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // C++
  "C++": {
    nodes: ["Start", "Syntax & Basics", "OOP Concepts", "Memory Management", "STL (Standard Template Library)", "Advanced Topics", "Project Work", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Automation
  "Automation": {
    nodes: ["Start", "Identify Tasks", "Write Scripts", "Schedule Automation", "Monitor Results", "Optimize", "Scale Up", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Sensors
  "Sensors": {
    nodes: ["Start", "Sensor Types", "Integration", "Calibration", "Data Acquisition", "Signal Processing", "Testing", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Control Systems
  "Control Systems": {
    nodes: ["Start", "Concepts", "Modeling", "Simulation", "Implementation", "Tuning", "Testing", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Robotics Frameworks
  "Robotics Frameworks": {
    nodes: ["Start", "Choose Framework", "Setup Env", "Program Robot", "Test", "Deploy", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]
  },
  // Mechanical Design
  "Mechanical Design": {
    nodes: ["Start", "CAD Basics", "Material Selection", "Structural Analysis", "Prototyping", "Testing", "Optimization", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Unity
  "Unity": {
    nodes: ["Start", "Install Unity", "Learn Editor", "C# Scripting", "Build Scenes", "Physics & Animation", "Publish Game", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Unreal Engine
  "Unreal Engine": {
    nodes: ["Start", "Install UE", "Blueprints", "C++ Scripting", "Level Design", "Lighting & FX", "Publish Game", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // 3D Modeling
  "3D Modeling": {
    nodes: ["Start", "Choose Tool", "Basic Shapes", "Texturing", "Rigging", "Animation", "Rendering", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // PLC Programming
  "PLC Programming": {
    nodes: ["Start", "PLC Basics", "Programming Languages", "I/O Configuration", "Logic Design", "Simulation", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // IoT
  "IoT": {
    nodes: ["Start", "IoT Concepts", "Device Setup", "Connectivity", "Data Collection", "Cloud Integration", "Security", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Signal Processing
  "Signal Processing": {
    nodes: ["Start", "Signals & Systems", "Transforms", "Filtering", "Feature Extraction", "Analysis", "Implementation", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Computer Vision
  "Computer Vision": {
    nodes: ["Start", "Image Processing", "Feature Detection", "Object Recognition", "Deep Learning", "Deployment", "Projects", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Natural Language Processing
  "Natural Language Processing": {
    nodes: ["Start", "Text Preprocessing", "Tokenization", "Feature Extraction", "Modeling", "Evaluation", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // AR/VR
  "AR/VR": {
    nodes: ["Start", "AR/VR Concepts", "Tool Selection", "Environment Setup", "3D Modeling", "Interaction Design", "Testing", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Game Design
  "Game Design": {
    nodes: ["Start", "Concept Development", "Prototyping", "Mechanics Design", "Level Design", "Playtesting", "Balancing", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Animation
  "Animation": {
    nodes: ["Start", "Principles", "Storyboarding", "Modeling", "Rigging", "Animating", "Rendering", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Sound Design
  "Sound Design": {
    nodes: ["Start", "Sound Theory", "Recording", "Editing", "Effects", "Mixing", "Mastering", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Audio Engineering
  "Audio Engineering": {
    nodes: ["Start", "Acoustics", "Microphones", "Signal Flow", "Mixing", "Processing", "Mastering", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Blockchain
  "Blockchain": {
    nodes: ["Start", "Blockchain Basics", "Cryptography", "Consensus", "Smart Contracts", "Development", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Cyber-Physical Systems
  "Cyber-Physical Systems": {
    nodes: ["Start", "CPS Concepts", "Sensors & Actuators", "Networking", "Control Systems", "Integration", "Security", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Quantum Computing
  "Quantum Computing": {
    nodes: ["Start", "Quantum Theory", "Qubits", "Quantum Gates", "Algorithms", "Simulation", "Programming", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Edge Computing
  "Edge Computing": {
    nodes: ["Start", "Edge Concepts", "Device Setup", "Networking", "Data Processing", "Security", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // DevRel
  "DevRel": {
    nodes: ["Start", "Community Building", "Content Creation", "Advocacy", "Feedback Loops", "Event Management", "Metrics", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Prompt Engineering
  "Prompt Engineering": {
    nodes: ["Start", "Prompt Basics", "Model Selection", "Prompt Tuning", "Evaluation", "Iteration", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Responsible AI
  "Responsible AI": {
    nodes: ["Start", "Ethics", "Bias Detection", "Fairness", "Transparency", "Accountability", "Governance", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Explainable AI
  "Explainable AI": {
    nodes: ["Start", "XAI Concepts", "Model Interpretation", "Visualization", "Feature Importance", "User Trust", "Evaluation", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // MLOps
  "MLOps": {
    nodes: ["Start", "CI/CD for ML", "Model Versioning", "Monitoring", "Automation", "Collaboration", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // DataOps
  "DataOps": {
    nodes: ["Start", "Pipeline Design", "Automation", "Monitoring", "Quality Control", "Collaboration", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Manual Testing
  "Manual Testing": {
    nodes: ["Start", "Test Planning", "Test Case Design", "Execution", "Bug Reporting", "Regression Testing", "Documentation", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Automated Testing
  "Automated Testing": {
    nodes: ["Start", "Select Tools", "Write Scripts", "Integrate CI", "Run Automation", "Analyze Results", "Maintenance", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Selenium
  "Selenium": {
    nodes: ["Start", "Install Selenium", "WebDriver Basics", "Write Test Scripts", "Run Tests", "Debugging", "Integrate CI", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Bug Tracking
  "Bug Tracking": {
    nodes: ["Start", "Choose Tool", "Report Bugs", "Prioritize", "Assign & Track", "Verify Fixes", "Close Bugs", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Test Planning
  "Test Planning": {
    nodes: ["Start", "Define Scope", "Identify Resources", "Create Test Plan", "Review & Approve", "Execution", "Track Progress", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Quality Standards
  "Quality Standards": {
    nodes: ["Start", "Understand Standards", "Define Criteria", "Implement Processes", "Monitor Compliance", "Audit", "Continuous Improvement", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Writing
  "Writing": {
    nodes: ["Start", "Research", "Outline", "Draft", "Edit", "Proofread", "Publish", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Research
  "Research": {
    nodes: ["Start", "Define Topic", "Gather Sources", "Analyze Data", "Synthesize Findings", "Document", "Review", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Technical Knowledge
  "Technical Knowledge": {
    nodes: ["Start", "Learn Basics", "Understand Concepts", "Hands-on Practice", "Project Work", "Advanced Topics", "Certification", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Editing
  "Editing": {
    nodes: ["Start", "Initial Review", "Content Editing", "Copy Editing", "Fact Checking", "Formatting", "Final Review", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Content Strategy
  "Content Strategy": {
    nodes: ["Start", "Research Audience", "Set Goals", "Plan Topics", "Create Calendar", "Distribute Content", "Measure Impact", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Solidity
  "Solidity": {
    nodes: ["Start", "Install Tools", "Learn Syntax", "Write Smart Contracts", "Test Contracts", "Deploy", "Audit & Optimize", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Ethereum
  "Ethereum": {
    nodes: ["Start", "Blockchain Basics", "Ethereum Concepts", "Wallets & Accounts", "Smart Contracts", "DApps", "Deployment", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Blockchain Fundamentals
  "Blockchain Fundamentals": {
    nodes: ["Start", "Distributed Ledger", "Consensus", "Cryptography", "Smart Contracts", "Use Cases", "Security", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Cryptography
  "Cryptography": {
    nodes: ["Start", "Encryption Basics", "Hashing", "Public Key Infrastructure", "Protocols", "Applications", "Attacks & Defense", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Smart Contracts
  "Smart Contracts": {
    nodes: ["Start", "Learn Language", "Write Contract", "Test", "Security Audit", "Deploy", "Interact", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // C#
  "C#": {
    nodes: ["Start", "Syntax & Basics", "OOP Concepts", ".NET Framework", "Project Work", "Debugging", "Advanced Topics", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // XR SDKs
  "XR SDKs": {
    nodes: ["Start", "Choose SDK", "Setup Project", "Develop Features", "Test on Devices", "Optimize Performance", "Publish", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // SEO
  "SEO": {
    nodes: ["Start", "Keyword Research", "On-Page SEO", "Off-Page SEO", "Technical SEO", "Content Optimization", "Analytics & Reporting", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Communication
  "Communication": {
    nodes: ["Start", "Active Listening", "Verbal Communication", "Written Communication", "Non-verbal Cues", "Feedback & Clarification", "Presentation Skills", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Scripting (Bash)
  "Scripting (Bash)": {
    nodes: ["Start", "Shell Basics", "Variables & Operators", "Control Structures", "File Operations", "Process Management", "Automation Scripts", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Scripting (Python)
  "Scripting (Python)": {
    nodes: ["Start", "Python Basics", "Variables & Data Types", "Control Flow", "File I/O", "Libraries & Modules", "Automation Scripts", "Mastery"],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
  },
  // Node.js
  "Node.js": {
    nodes: [
      "Start",
      "Node.js Basics",
      "NPM & Modules",
      "Async Programming",
      "Express.js",
      "Database Integration",
      "APIs & REST",
      "Authentication",
      "Testing & Debugging",
      "Deployment",
      "Mastery"
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]]
  },
  // React
  "React": {
    nodes: [
      "Start",
      "JSX & Components",
      "Props & State",
      "Event Handling",
      "Component Lifecycle",
      "Hooks",
      "Routing",
      "State Management",
      "Testing",
      "Performance Optimization",
      "Deployment",
      "Mastery"
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11]]
  },
  // AWS
  "AWS": {
    nodes: [
      "Start",
      "Cloud Basics",
      "AWS Core Services",
      "IAM & Security",
      "Storage (S3, EBS)",
      "Compute (EC2, Lambda)",
      "Networking (VPC, Route 53)",
      "Databases (RDS, DynamoDB)",
      "Monitoring & Logging",
      "Deployment & Automation",
      "Cost Management",
      "Exam Preparation",
      "Mastery"
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]]
  },
  // Azure
  "Azure": {
    nodes: [
      "Start",
      "Cloud Basics",
      "Azure Core Services",
      "Identity & Access (AD)",
      "Storage (Blob, Disk)",
      "Compute (VM, Functions)",
      "Networking (VNet, DNS)",
      "Databases (SQL, Cosmos DB)",
      "Monitoring & Management",
      "Deployment & Automation",
      "Cost Management",
      "Exam Preparation",
      "Mastery"
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]]
  },
  // Google Cloud
  "Google Cloud": {
    nodes: [
      "Start",
      "Cloud Basics",
      "GCP Core Services",
      "IAM & Security",
      "Storage (GCS, Persistent Disk)",
      "Compute (GCE, Cloud Functions)",
      "Networking (VPC, Cloud DNS)",
      "Databases (Cloud SQL, Firestore)",
      "Monitoring & Logging",
      "Deployment & Automation",
      "Cost Management",
      "Exam Preparation",
      "Mastery"
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]]
  },
  // Machine Learning
  "Machine Learning": {
    nodes: [
      "Start",
      "Math & Stats Fundamentals",
      "Python/R Programming",
      "Data Preprocessing",
      "Exploratory Data Analysis",
      "Supervised Learning",
      "Unsupervised Learning",
      "Model Evaluation & Metrics",
      "Feature Engineering",
      "Model Tuning",
      "Deep Learning Basics",
      "Deployment",
      "Projects & Practice",
      "Mastery"
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13]]
  },
  // Add more unique skills here following the same pattern
};

export default function SkillRoadmapFlow({ skill }: SkillRoadmapFlowProps) {
  const roadmap = skillRoadmaps[skill];
  if (!roadmap) {
    return <div className="text-center text-muted-foreground">No roadmap available for {skill} yet.</div>;
  }

  // Generate nodes and edges for React Flow
  const nodes = roadmap.nodes.map((label, idx) => ({
    id: String(idx),
    data: { label },
    position: { x: 0, y: idx * 120 },
    style: {
      width: 320,
      height: 60,
      borderRadius: 16,
      background: "linear-gradient(135deg, #c3dafe 60%, #a3bffa 100%)",
      color: "#1a365d",
      fontWeight: 700,
      fontSize: 18,
      boxShadow: "0 2px 12px #90cdf4aa"
    }
  }));
  const edges = roadmap.edges.map(([from, to], idx) => ({
    id: `e${from}-${to}`,
    source: String(from),
    target: String(to),
    animated: true,
    style: { stroke: "#3182ce", strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#3182ce',
    }
  }));

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnDrag
        zoomOnScroll
        minZoom={0.5}
        maxZoom={2}
        style={{ background: "#f0f4fa", borderRadius: 20 }}
      >
        <Background color="#bee3f8" gap={32} />
        <MiniMap nodeColor="#3182ce" nodeStrokeWidth={3} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
