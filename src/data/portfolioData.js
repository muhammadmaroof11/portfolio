export const portfolioData = {
  profile: {
    name: 'MUHAMMAD MAROOF',
    title: 'Full Stack Developer',
    role: 'Full Stack Developer & Automations Specialist',
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
    ai: "I build smart automated systems and AI agents that handle repetitive tasks, saving your team hours of manual work every week.",
    web: "I build fast, reliable websites and web software that load instantly, handle heavy user traffic, and help grow your business.",
    mobile: "I build smooth, user-friendly mobile apps for both iPhone and Android, helping you reach customers on the go.",
    default: "Full Stack Developer at Byte Force. Helping businesses build fast, reliable websites, apps, and automated workflows that scale."
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
    { title: 'Web & Software Engineering', desc: 'Building fast, secure web platforms and tools tailored to your business needs.', icon: 'Globe' },
    { title: 'Mobile App Development', desc: 'Creating high-performance apps for iOS and Android from a single codebase.', icon: 'Smartphone' },
    { title: 'Business Automation & AI', desc: 'Setting up smart workflows and AI tools to automate manual tasks and save team time.', icon: 'Cpu' },
    { title: 'Interactive Experiences', desc: 'Developing engaging 2D/3D visual experiences and interactive web features.', icon: 'Zap' }
  ],

  offeredServices: [
    { title: 'Custom Web Development', desc: 'Get a fast, secure website or web app designed to turn visitors into paying customers.', icon: 'Globe', image: '/services/web_dev.webp' },
    { title: 'App Development', desc: 'Launch custom apps for iOS, Android, and web that work smoothly on every device.', icon: 'Gamepad2', image: '/services/game_dev.webp' },
    { title: 'Code Audit & Speed Tuning', desc: 'I review your current software code to fix bugs, security issues, and speed up slow pages.', icon: 'Code', image: '/services/code_audit.webp' },
    { title: 'Server & Cost Optimization', desc: 'Optimizing your database and server setups to slash your monthly cloud hosting bills.', icon: 'Cpu', image: '/services/optimization.webp' },
    { title: 'Task Automation & AI Tools', desc: 'Automate repetitive data entry, invoicing, customer outreach, and manual workflows.', icon: 'Smartphone', image: '/services/automation.webp' }
  ],

  faqs: [
    {
      q: "What services do you provide?",
      a: "I help businesses build custom websites and web applications, launch mobile apps, speed up slow software to prevent customer loss, reduce server hosting bills, and set up automated workflows to eliminate manual work.",
      category: "general",
      featured: true
    },
    {
      q: "How do you help businesses save money on hosting?",
      a: "I audit your current servers and databases to find where resources are wasted. By cleaning up slow database queries, setting up efficient caching, and restructuring server usage, I regularly cut hosting bills by 30% or more.",
      category: "cost",
      featured: true
    },
    {
      q: "How does AI and workflow automation benefit my business?",
      a: "Instead of having your team spend hours copying data, writing manual reports, or handling basic support queries, I build automated pipelines and secure AI assistants that do the work for you instantly and error-free.",
      category: "automation",
      featured: true
    },
    {
      q: "Can you fix and improve my existing slow software?",
      a: "Yes. If your current website or software is slow, crashing, or buggy, I can audit the code, find the bottlenecks causing the slowdowns, and optimize it to load instantly.",
      category: "performance"
    },
    {
      q: "Do you build cross-platform mobile apps?",
      a: "Yes, I develop high-quality mobile apps using Capacitor and Flutter. This allows launching on both iOS (Apple) and Android devices from a single codebase, saving you development time and budget.",
      category: "mobile"
    },
    {
      q: "Is my business data safe with custom AI integrations?",
      a: "Yes. All AI integrations are built securely, using private server keys and closed APIs that ensure your sensitive business data is never shared publicly or used to train public models.",
      category: "security"
    },
    {
      q: "Do you work with small businesses, startups, or enterprises?",
      a: "I work with all of them. I help startups launch fast prototype MVPs, small businesses automate manual office work, and larger companies optimize database load and server speed.",
      category: "clients"
    },
    {
      q: "How do we get started on a project?",
      a: "Simply send me a message through the contact page or email. We will schedule a quick call to talk about your goals, scope the requirements, and set up a plan to deliver results for your business.",
      category: "availability",
      featured: true
    },
    {
      q: "What is your typical turnaround time for a project?",
      a: "Turnaround times vary based on scope. A simple custom website can take 2 to 3 weeks, while a more complex web application or mobile app usually takes 6 to 12 weeks. I provide a detailed, milestone-based timeline before starting.",
      category: "timeline"
    },
    {
      q: "Do you offer post-launch support and maintenance?",
      a: "Yes. I provide 30 days of free support to resolve any unexpected issues. After that, I offer flexible maintenance plans to keep your software secure, updated, and running smoothly.",
      category: "support"
    },
    {
      q: "Can you work with my existing in-house technical team?",
      a: "Absolutely. I can step in as a contract developer or consultant to collaborate with your team, align on coding standards, write clean documentation, and accelerate feature deliveries.",
      category: "collaboration"
    },
    {
      q: "How do you handle project pricing?",
      a: "I offer both fixed-price project contracts and monthly retainer models, depending on the scope and requirements. All pricing is upfront and transparent, with no hidden fees.",
      category: "pricing"
    },
    {
      q: "Can you help migrate our outdated systems to the cloud?",
      a: "Yes. I have extensive experience migrating legacy on-premise applications and outdated databases to secure cloud environments like AWS, Google Cloud, or Vercel, ensuring zero downtime during the transition.",
      category: "cloud"
    },
    {
      q: "Will I own the source code of the project?",
      a: "Yes, 100%. Once the project is completed and the final payment is cleared, full ownership and intellectual property rights of the source code are transferred to you.",
      category: "ownership"
    }
  ]
};
