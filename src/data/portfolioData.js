export const portfolioData = {
  profile: {
    name: 'MUHAMMAD MAROOF',
    title: 'Digital Architect',
    role: 'Full Stack Developer at Byte Force',
    availability: 'Available for projects',
    location: 'Remote / Global',
    email: 'maroof@byteforce.dev',
    socials: {
      github: 'https://github.com/MuhammadMaroof',
      linkedin: 'https://linkedin.com/in/muhammadmaroof',
      twitter: '#',
      instagram: '#'
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
      image: '/projects/ezi.png',
      featured: false,
      year: '2025'
    }
  ],
  skills: [
    { name: 'JavaScript', category: 'Frontend', level: 'Expert', color: '#F7DF1E', slug: 'js' },
    { name: 'Python', category: 'AI & Data', level: 'Data/AI', color: '#3776AB', slug: 'py' },
    { name: 'Vue.js', category: 'Frontend', level: 'Advanced', color: '#4FC08D', slug: 'vue' },
    { name: 'React', category: 'Frontend', level: 'Advanced', color: '#61DAFB', slug: 'react' },
    { name: 'Ionic Framework', category: 'Mobile', level: 'Expert', color: '#3880FF', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Ionic_Logo.svg' },
    { name: 'Tailwind CSS', category: 'Frontend', level: 'Expert', color: '#06B6D4', slug: 'tailwind' },
    { name: 'Flutter', category: 'Mobile', level: 'Expert', color: '#02569B', slug: 'flutter' },
    { name: 'Node.js', category: 'Backend', level: 'Advanced', color: '#339933', slug: 'nodejs' },
    { name: 'MongoDB', category: 'Backend', level: 'Advanced', color: '#00684A', slug: 'mongodb' },
    { name: 'Supabase', category: 'Backend', level: 'Advanced', color: '#3ECF8E', slug: 'supabase' },
    { name: 'Firebase', category: 'Backend', level: 'Advanced', color: '#FFCA28', slug: 'firebase' },
    { name: 'Capacitor', category: 'Mobile', level: 'Advanced', color: '#119EFF', slug: 'capacitor' },
    { name: 'GSAP', category: 'Frontend', level: 'Advanced', color: '#88CE02', slug: 'gsap' },
    { name: 'Agentic AI', category: 'AI & Data', level: 'Specialist', color: '#FF5722', faIcon: 'fa-solid fa-robot' },
    { name: 'n8n Automation', category: 'AI & Data', level: 'Advanced', color: '#ea4b71', iconUrl: '/n8n.svg' },
    { name: 'Generative AI', category: 'AI & Data', level: 'Advanced', color: '#6A1B9A', faIcon: 'fa-solid fa-wand-magic-sparkles' },
    { name: 'Docker', category: 'Backend', level: 'Advanced', color: '#2496ED', slug: 'docker' },
    { name: 'RAG Agents', category: 'AI & Data', level: 'Specialist', color: '#4CAF50', faIcon: 'fa-solid fa-network-wired' },
    { name: 'PyTorch', category: 'AI & Data', level: 'Advanced', color: '#EE4C2C', slug: 'pytorch' }
  ],

  experience: [
    {
      company: 'Byte Force',
      role: 'Lead Full Stack Developer',
      period: '2026 - Present',
      description: 'Architecting scalable web applications and orchestrating complex mobile lifecycles with GenAI integration.',
      tags: ['React.js', 'Node.js', 'Supabase', 'Tailwind'],
      status: 'Present'
    },
    {
      company: 'Sairay.pk',
      role: 'Backend Developer',
      period: '2024 - 2025',
      description: 'Developed scalable REST APIs with Flask, achieving significant efficiency improvements.',
      tags: ['Flask', 'Python', 'REST API']
    }
  ]
};
