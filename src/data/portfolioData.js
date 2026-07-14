export const portfolioData = {
  profile: {
    name: 'MUHAMMAD MAROOF',
    title: 'Digital Architect',
    role: 'Full Stack Developer at Byte Force',
    availability: 'Available for projects',
    location: 'Lahore, Pakistan (Remote)',
    email: 'mmaroof341@gmail.com',
    phone: '+923051526463',
    socials: {
      github: 'https://github.com/MuhammadMaroof',
      linkedin: 'https://www.linkedin.com/in/mmaroof11/',
      whatsapp: 'https://wa.me/923051526463',
      instagram: 'https://www.instagram.com/anonymous.mars.here/'
    }
  },
  education: [
    {
      degree: 'BS Computer Science',
      institution: 'University of Education, Lahore',
      period: '2023 - 2027',
      tags: ['Software Engineering', 'Algorithms', 'AI']
    },
    {
      degree: 'Intermediate (ICS Physics)',
      institution: 'Government Islamia College Civil Lines, Lahore',
      period: '2021 - 2023',
      tags: ['Physics', 'Mathematics', 'CS Foundations']
    }
  ],
  projects: [
    {
      id: 'foodlink',
      title: 'FOODLINK',
      description: 'Gourmet logistics platform with a multi-portal mobile and web ecosystem powered by Capacitor & Vue 3. Features a real-time reactive Supabase database, high-throughput routing algorithms, geo-tracking coordination, and a low-latency cache layer for rapid delivery syncing.',
      tech: ['Vue 3', 'Supabase', 'Capacitor', 'Tailwind'],
      challenges: ['Scale User Growth', 'Launch Mobile Products'],
      blueprint: {
        ai: 'Supabase real-time triggers and automated dispatch routing based on geo-locations.',
        scalability: 'Low-latency caching rules and indexed database schemas to sustain peak traffic.',
        ux: 'Unified cross-platform interfaces packaged via Capacitor, maintaining high-fps map tracking.'
      },
      image: '/projects/foodlink.png',
      link: 'https://foodlinkglobal.netlify.app/',
      featured: true,
      year: '2026'
    },
    {
      id: 'bytely-calling-agent',
      title: 'BYTELY CALLING AGENT',
      description: 'AI voice conversational calling agent featuring low-latency response processing, real-time pipeline monitoring, and high-frequency webhook integrations. Integrates agent orchestration, call logs analytics, and telemetry visualization into a streamlined Vue/Pinia dashboard.',
      tech: ['Vue.js', 'Pinia', 'JavaScript', 'Tailwind CSS'],
      challenges: ['Automate Operations', 'Deploy Agentic AI'],
      blueprint: {
        ai: 'Asynchronous streaming response handler for voice agents and multi-prompt contextual routers.',
        scalability: 'High-frequency webhook queues built to handle concurrent connection webhooks.',
        ux: 'Real-time telemetry dashboards showing call-state graphs via Pinia store synchronization.'
      },
      image: '/projects/calling-agent.webp',
      link: '#',
      hoverText: 'Active Demo',
      featured: true,
      year: '2026'
    },
    {
      id: 'bytelyai',
      title: 'BYTELYAI',
      description: 'Enterprise-grade SaaS artificial intelligence platform focused on secure code generation, LLM orchestrations, and context-aware code analysis. Developed with high-fidelity GSAP scroll timelines, Framer Motion layouts, and responsive state synchronization via Zustand.',
      tech: ['React', 'Vite', 'GSAP', 'Framer Motion', 'Zustand', 'Axios'],
      challenges: ['Scale User Growth', 'Deploy Agentic AI'],
      blueprint: {
        ai: 'LangChain context parsing pipelines and secure sandboxed code execution endpoints.',
        scalability: 'Zustand state synchronization layer coordinating multi-agent feedback streams.',
        ux: 'High-fidelity cinematic transitions using custom GSAP timelines and responsive CSS grid architectures.'
      },
      image: '/projects/bytely.png',
      link: 'https://bytely.ai/',
      featured: true,
      year: '2026'
    },
    {
      id: 'crypto-analyzer',
      title: 'CryptoAnalyzer',
      description: 'DeFi financial dashboard integrating real-time CoinGecko API data feeds with Python data processing pipelines. Renders responsive statistical tracking, asset performance metrics, and advanced charting inspired by clean Matplotlib designs for trading desks.',
      tech: ['MERN Stack', 'Python', 'CoinGecko API', 'Matplotlib'],
      challenges: ['Automate Operations', 'Scale User Growth'],
      blueprint: {
        ai: 'Python statistical modeling routines parsing live trading patterns and market metrics.',
        scalability: 'Express API query throttle handlers ensuring data synchronization and rate-limit safety.',
        ux: 'Highly responsive trading widgets rendering real-time asset performance diagrams.'
      },
      image: '/projects/crypto.png',
      link: 'https://crypto-analyze-proj.netlify.app/',
      featured: true,
      year: '2025'
    },
    {
      id: 'mentairo',
      title: 'MENTAIRO',
      description: 'Secure health platform incorporating Agora SDK for high-fidelity, low-latency video consultations. Features end-to-end encrypted chat channels, real-time socket connections, robust Firebase auth, and custom state synchronization for secure client-physician sessions.',
      tech: ['Flutter', 'Firebase', 'Agora SDK'],
      challenges: ['Launch Mobile Products', 'Scale User Growth'],
      blueprint: {
        ai: 'Rule-based scheduling agents and secure document upload/verification processes.',
        scalability: 'Agora low-latency video gateways integrated with secure Firestore security rules.',
        ux: 'Polished client/physician messaging app built natively with Flutter widgets.'
      },
      image: '/projects/mentairo.jpeg',
      link: '#',
      hoverText: 'Coming Soon',
      featured: true,
      year: '2025'
    },
    {
      id: 'ezi-services',
      title: 'EZI SERVICES',
      description: 'High-performance blog system and content engine. Developed with Node.js and Express backend controllers, built-in server-side caching, and structured schema markup to optimize lighthouse metrics and achieve maximum search engine presence.',
      tech: ['Vue.js', 'Node.js', 'Express', 'SEO'],
      challenges: ['Scale User Growth'],
      blueprint: {
        ai: 'Auto-generated semantic schema markups helping search engines index complex topic clusters.',
        scalability: 'Node.js/Express server-side response caching to minimize CPU load and page response times.',
        ux: 'Optimized static-like rendering achieving perfect Lighthouse performance scores.'
      },
      image: '/projects/ezi.png',
      featured: false,
      year: '2025'
    }
  ],
  skills: [
    // Languages
    { name: 'JavaScript', category: 'Languages', level: 'Expert', color: '#F7DF1E', slug: 'js' },
    { name: 'Python', category: 'Languages', level: 'Data/AI', color: '#3776AB', slug: 'py' },
    { name: 'PHP', category: 'Languages', level: 'Advanced', color: '#777BB4', slug: 'php' },
    { name: 'C', category: 'Languages', level: 'Advanced', color: '#A8B9CC', slug: 'c' },
    { name: 'C++', category: 'Languages', level: 'Advanced', color: '#00599C', slug: 'cpp' },
    
    // Frameworks
    { name: 'Vue.js', category: 'Frameworks', level: 'Advanced', color: '#4FC08D', slug: 'vue' },
    { name: 'React', category: 'Frameworks', level: 'Advanced', color: '#61DAFB', slug: 'react' },
    
    // AI & Automation
    { name: 'Agentic AI', category: 'AI & Automation', level: 'Specialist', color: '#FF5722', faIcon: 'fa-solid fa-robot' },
    { name: 'n8n Automation', category: 'AI & Automation', level: 'Advanced', color: '#ea4b71', iconUrl: '/n8n.svg' },
    { name: 'Generative AI', category: 'AI & Automation', level: 'Advanced', color: '#6A1B9A', faIcon: 'fa-solid fa-wand-magic-sparkles' },
    { name: 'RAG Agents', category: 'AI & Automation', level: 'Specialist', color: '#4CAF50', faIcon: 'fa-solid fa-network-wired' },
    { name: 'PyTorch', category: 'AI & Automation', level: 'Advanced', color: '#EE4C2C', slug: 'pytorch' },
    { name: 'Scikit-Learn', category: 'AI & Automation', level: 'Advanced', color: '#F7931E', slug: 'scikitlearn' },
    { name: 'Fine-Tuning', category: 'AI & Automation', level: 'Specialist', color: '#9C27B0', faIcon: 'fa-solid fa-sliders' },

    // Backend & Cloud
    { name: 'Node.js', category: 'Backend & Cloud', level: 'Advanced', color: '#339933', slug: 'nodejs' },
    { name: 'MongoDB', category: 'Backend & Cloud', level: 'Advanced', color: '#00684A', slug: 'mongodb' },
    { name: 'Supabase', category: 'Backend & Cloud', level: 'Advanced', color: '#3ECF8E', slug: 'supabase' },
    { name: 'Firebase', category: 'Backend & Cloud', level: 'Advanced', color: '#FFCA28', slug: 'firebase' },
    { name: 'Docker', category: 'Backend & Cloud', level: 'Advanced', color: '#2496ED', slug: 'docker' },
    { name: 'Flask', category: 'Backend & Cloud', level: 'Advanced', color: '#000000', slug: 'flask' },
    { name: 'GCP', category: 'Backend & Cloud', level: 'Advanced', color: '#4285F4', slug: 'googlecloud' },
    { name: 'Postman', category: 'Backend & Cloud', level: 'Advanced', color: '#FF6C37', slug: 'postman' },
    { name: 'Kubernetes', category: 'Backend & Cloud', level: 'Advanced', color: '#326CE5', slug: 'kubernetes' },
    { name: 'SQL', category: 'Backend & Cloud', level: 'Expert', color: '#4479A1', slug: 'mysql' },

    // Styling & Motion
    { name: 'Tailwind CSS', category: 'Styling & Motion', level: 'Expert', color: '#06B6D4', slug: 'tailwind' },
    { name: 'GSAP', category: 'Styling & Motion', level: 'Advanced', color: '#88CE02', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/greensock.svg' },
    { name: 'Blender', category: 'Styling & Motion', level: 'Advanced', color: '#E87D0D', slug: 'blender' },
    { name: 'Framer Motion', category: 'Styling & Motion', level: 'Expert', color: '#00C5FF', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/framer.svg' },
    { name: 'CSS', category: 'Styling & Motion', level: 'Expert', color: '#1572B6', slug: 'css' },

    // Mobile Dev
    { name: 'Ionic Framework', category: 'Mobile Dev', level: 'Expert', color: '#3880FF', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Ionic_Logo.svg' },
    { name: 'Flutter', category: 'Mobile Dev', level: 'Expert', color: '#02569B', slug: 'flutter' },
    { name: 'Capacitor', category: 'Mobile Dev', level: 'Advanced', color: '#119EFF', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/capacitor.svg' },
    { name: 'Electron', category: 'Mobile Dev', level: 'Advanced', color: '#47848F', slug: 'electron' }
  ],

  experience: [
    {
      company: 'Byte Force IT Solutions',
      location: 'Lahore, Pakistan',
      role: 'Full Stack Developer',
      period: 'Feb 2026 – Present',
      description: 'Design, develop, test, and maintain scalable software applications and automated pipelines.',
      bullets: [
        'Design, develop, test, and maintain scalable software applications, integrating RESTful APIs and backend services using modern technologies.',
        'Engineer and deploy autonomous workflow pipelines utilizing n8n to connect APIs with outside services, managing containerized systems.',
        'Participate in code reviews, sprint planning, and Agile ceremonies, writing clean, reliable code and investigating system bugs.'
      ],
      tags: ['React.js', 'Node.js', 'Supabase', 'n8n', 'Python', 'Flask', 'SQL', 'GCP', 'Postman', 'Docker', 'Kubernetes', 'Electron', 'Tailwind', 'JavaScript', 'PHP', 'C++'],
      status: 'Present'
    },
    {
      company: 'Sairay.pk',
      location: 'Remote',
      role: 'Full Stack Developer (Freelance)',
      period: 'Nov 2025 – Feb 2026',
      description: 'Architected Flask REST APIs and optimized React frontend discovery workflows.',
      bullets: [
        'Architected a robust, scalable REST API utilizing Python (Flask) to handle dynamic enterprise product inventories.',
        'Accelerated frontend product discovery workflows by 40% through optimized React.js state-filtering algorithms.'
      ],
      tags: ['Flask', 'Python', 'React.js', 'REST API', 'Algorithms']
    }
  ],

  adventureNarratives: {
    ai: "Orchestrating intelligent agents, custom LLM configurations, and automated n8n pipeline workflows to build future-proof AI systems.",
    web: "Designing robust, high-throughput backend controllers and responsive client interfaces that scale seamlessly under heavy workloads.",
    mobile: "Developing premium cross-platform mobile apps with Capacitor and Flutter that deliver smooth, native performance.",
    default: "Full Stack Developer at Byte Force. Bridging the gap between creative vision and technical precision with Scalable Architectures."
  },

  testimonials: [
    {
      metric: '30% Server Cost Reduction',
      quote: 'Maroof audited our Node.js systems, refactored our caching layer, and optimized our database queries, reducing our hosting bill overnight.',
      author: 'Alex Carter',
      role: 'CTO, Bytely.ai'
    },
    {
      metric: '0 to 10k Users in 3 Months',
      quote: 'Thanks to the Capacitor-based mobile layout and Supabase real-time Dispatch core Maroof architected, our delivery app launched smoothly and scaled without hiccups.',
      author: 'Sara Chen',
      role: 'Founder, FoodLink'
    }
  ],

  services: [
    { title: 'Full Stack Engineering', desc: 'Architecting robust web ecosystems using Vue.js, Node.js, and modern databases.', icon: 'Globe' },
    { title: 'Mobile First Development', desc: 'High-performance cross-platform apps with Flutter and Ionic Capacitor.', icon: 'Smartphone' },
    { title: 'AI & Data Integration', desc: 'Orchestrating agentic AI workflows and real-time data streaming solutions.', icon: 'Cpu' },
    { title: 'Game Development', desc: 'Immersive multiplayer experiences built with Unity and high-fidelity rendering.', icon: 'Zap' }
  ],

  offeredServices: [
    { title: 'Custom Website Development', desc: 'Crafting bespoke, lightning-fast web applications optimized for speed, SEO, and flawless responsiveness.', icon: 'Globe', image: '/services/web_dev.webp' },
    { title: 'Game Development', desc: 'Developing immersive, real-time interactive 2D/3D browser and native games using high-performance graphic engines.', icon: 'Gamepad2', image: '/services/game_dev.webp' },
    { title: 'Code Audit & Review', desc: 'Deep codebase security profiling, architectural health assessments, and streamlining logic to eliminate technical debt.', icon: 'Code', image: '/services/code_audit.webp' },
    { title: 'Optimization & Enhancements', desc: 'Fine-tuning memory allocation, script execution speeds, asset packaging, and database queries for peak efficiency.', icon: 'Cpu', image: '/services/optimization.webp' },
    { title: 'Business Automation', desc: 'Designing custom agentic AI pipelines, data extraction routines, and headless process integrations to supercharge productivity.', icon: 'Smartphone', image: '/services/automation.webp' }
  ],

  faqs: [
    {
      q: "What technologies are in your core tech stack?",
      a: "My architectural core is built on Vue 3 (Composition API, Pinia) and React for user interfaces, styled via utility grids or vanilla CSS tokens. On the server, I design backend microservices using Node.js and Python, handle persistence with Supabase/PostgreSQL/MongoDB, package runtimes in Docker, and orchestrate automated AI workflows with n8n.",
      category: "technology",
      featured: true
    },
    {
      q: "What does a 'Digital Architect' actually do?",
      a: "Unlike a standard developer who solely writes user-facing client code, a Digital Architect bridges frontend interaction design, backend service reliability, and database indexing. I design system blueprints, profile and remove server/rendering bottlenecks, structure secure auth schemas, and guarantee high system availability under heavy loads.",
      category: "methodology",
      featured: true
    },
    {
      q: "How do you approach Agentic AI integration?",
      a: "We move past simple prompt engineering to build production-grade autonomous workflow engines. This includes setting up secure vector databases (RAG) using pgvector or Pinecone, orchestrating multi-agent decision systems in Python or n8n, deploying real-time voice agents, and automating corporate manual operations to save hours of human labor.",
      category: "artificial intelligence",
      featured: true
    },
    {
      q: "Can you audit or refactor an existing legacy codebase?",
      a: "Yes. I perform thorough architectural audits: identifying database lock throttling, profiling memory leaks, auditing dependencies for vulnerabilities, and refactoring monolithic layouts into componentized structures. Every audit includes a prioritized technical debt ledger.",
      category: "audit"
    },
    {
      q: "Do you build cross-platform mobile apps?",
      a: "Yes, I develop premium mobile experiences using Capacitor and Flutter. This allows compiling to native iOS and Android binaries from a unified codebase, saving substantial startup resources while keeping rendering and hardware plugin integration native-grade.",
      category: "mobile"
    },
    {
      q: "How do you ensure data security and compliance?",
      a: "Security is an architectural pillar, not an afterthought. I design schemas following Row-Level Security (RLS) policies on Supabase, configure proper CORS parameters, enforce HTTPS and token-based state authorization, and audit third-party dependency vulnerabilities regularly.",
      category: "security"
    },
    {
      q: "Do you work with startups or enterprise clients?",
      a: "Both. I help startups design 0-to-1 MVP architectures that scale cleanly without massive cloud overhead, and I consult for enterprises to optimize database throttling, speed up slow user interfaces, and automate operations.",
      category: "clients"
    },
    {
      q: "What is your contract availability and booking process?",
      a: "I am currently based at Byte Force, but maintain capacity for selective startup consultation, systems audits, and architecture design workshops. Project slots are strictly limited to ensure engineering quality. Use the 'Initiate Protocol' CTA or direct signals (email/voice) to request availability.",
      category: "availability",
      featured: true
    }
  ]
};
