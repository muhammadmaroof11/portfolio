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
      id: 'bytelyai',
      title: 'BYTELYAI',
      description: 'AI-driven platform with enterprise-grade secure coding practices.',
      tech: ['Vue.js', 'Ionic', 'Tailwind'],
      image: '/projects/bytely.png',
      featured: true
    },
    {
      id: 'crypto-analyzer',
      title: 'CryptoAnalyzer',
      description: 'Real-time DeFi dashboard integrating CoinGecko API with Matplotlib-inspired asset tracking.',
      tech: ['MERN Stack', 'Python', 'CoinGecko API', 'Matplotlib'],
      image: '/projects/crypto.png',
      featured: true
    },
    {
      id: 'silent-turns',
      title: 'SILENT TURNS',
      description: 'Atmospheric 3D Horror multiplayer experience engineered with Unity Engine.',
      tech: ['Unity', 'C#', 'Multiplayer'],
      image: '/projects/silentturns.png',
      featured: true
    },
    {
      id: 'mentairo',
      title: 'MENTAIRO',
      description: 'Mental health platform with Agora SDK for secure real-time video consultations.',
      tech: ['Flutter', 'Firebase', 'Agora SDK'],
      image: '/projects/mentairo.png',
      featured: true
    },
    {
      id: 'ezi-services',
      title: 'EZI SERVICES',
      description: 'High-performance custom blog engine optimized for speed and SEO.',
      tech: ['Vue.js', 'Node.js', 'Express', 'SEO'],
      image: '/projects/ezi.png',
      featured: false
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
    { name: 'Agentic AI', category: 'AI & Data', level: 'Specialist', color: '#FF5722', faIcon: 'fa-solid fa-robot' },
    { name: 'n8n Automation', category: 'AI & Data', level: 'Advanced', color: '#ea4b71', iconUrl: '/src/assets/n8n.svg' },
    { name: 'Generative AI', category: 'AI & Data', level: 'Advanced', color: '#6A1B9A', faIcon: 'fa-solid fa-wand-magic-sparkles' }
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
