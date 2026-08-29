import {
  AmbitLogo,
  BarepapersLogo,
  BimLogo,
  CDGOLogo,
  ClevertechLogo,
  ConsultlyLogo,
  EvercastLogo,
  Howdy,
  JarockiMeLogo,
  JojoMobileLogo,
  Minimal,
  MobileVikingsLogo,
  MonitoLogo,
  NSNLogo,
  ParabolLogo,
  TastyCloudLogo,
  YearProgressLogo,
  CXRLogo,
  CemtrexLogo,
  FractalLogo,
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const RESUME_DATA = {
  name: "Sameer Vanjari",
  initials: "SV",
  location: "Pune, India",
  locationLink: "https://www.google.com/maps/place/Pune,+Maharashtra,+India",
  about: "Senior Frontend Engineer building fast, modern and user-friendly websites",
  summary:
    "Senior Frontend Engineer with 4+ years of experience building fast, scalable web apps with React, Next.js and TypeScript. I focus on clean code, great user experience, and leading teams to ship AI-powered products. Open to remote roles worldwide and on-site roles with visa sponsorship.",
  avatarUrl: "/avatar.png",
  personalWebsiteUrl: "https://sameer-vanjari.vercel.app",
  contact: {
    email: "ssv6132@gmail.com",
    tel: "+917768955586",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/SameerVanjari",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sameer-vanjari",
        icon: LinkedInIcon,
      },
      {
        name: "X",
        url: "https://x.com/VanjariSameer",
        icon: XIcon,
      },
    ],
  },
  education: [
    {
      school: "Government College of Engineering, Jalgaon",
      degree: "Bachelor of Technology – Mechanical Engineering",
      start: "2017",
      end: "2021",
    },
  ],
  work: [
    {
      company: "Zitics Pvt Ltd",
      link: "https://zitics.com/",
      badges: ["On site", "Pune, India"],
      title: "Senior Frontend Developer",
      start: "Jul 2024",
      end: "Present",
      description:
        "Designed and delivered a scalable reusable component library adopted across the core platform, improving development speed and UI consistency. Led frontend architecture for AI-powered product features integrating React + TypeScript UIs with intelligent backend workflows. Optimised REST API integration and client-side data flow, improving page load performance and UX reliability. Built and launched the company marketing website end-to-end, improving lead generation and online visibility. Mentored 3+ junior developers and interns on component patterns and code reviews. Architected a micro frontend system using Module Federation enabling independent feature deployments.",
    },
    {
      company: "CXR.Agency",
      link: "https://cxr.agency",
      badges: ["Remote"],
      title: "Frontend Developer",
      logo: CXRLogo,
      start: "Apr 2023",
      end: "Jun 2024",
      description:
        "Delivered pixel-perfect, responsive UIs across eCommerce, gaming, and enterprise client projects built from Figma design systems. Built scalable frontend architecture with reusable React components, reducing cross-project duplication and accelerating delivery. Achieved Lighthouse performance scores of 90+ through optimisation of Core Web Vitals, code splitting and WCAG accessibility compliance. Participated in full Agile sprint cycles, code reviews, and CI/CD pipeline workflows ensuring consistent on-time delivery.",
    },
    {
      company: "Cemtrex Labs",
      link: "https://cemtrexlabs.com",
      badges: ["On site", "Amravati, India"],
      title: "Frontend Developer",
      logo: CemtrexLogo,
      start: "Apr 2022",
      end: "Mar 2023",
      description:
        "Built interactive React + Next.js dashboards and admin panels with server-side rendering (SSR) and Static Site Generation (SSG) for enterprise clients. Created responsive client landing pages using modern CSS and performance-first best practices. Gained foundational full-stack experience with Next.js App Router + AdonisJS, including API integration and data modelling.",
    },
  ],
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React.js",
    "Next.js",
    "Vue.js",
    "Node.js",
    "Python",
    "React Three Fiber",
    "Three.js",
    "WebGL",
    "GLSL",
    "Tailwind CSS",
    "Material UI",
    "Fluent UI",
    "Styled Components",
    "SASS",
    "Bootstrap",
    "Redux",
    "Redux Toolkit",
    "Zustand",
    "Context API",
    "Micro Frontends",
    "Module Federation",
    "SSR",
    "SSG",
    "ISR",
    "SPA",
    "Responsive Design",
    "REST APIs",
    "GraphQL",
    "Axios",
    "Jest",
    "React Testing Library",
    "Webpack",
    "Vite",
    "Babel",
    "Git",
    "GitHub",
    "Azure DevOps",
    "CI/CD",
    "Jira",
    "Agile — Scrum / Kanban",
  ],
  projects: [
    {
      title: "Zitics.com",
      techStack: [
        "WordPress",
        "Custom Theme",
        "SVG Animations",
        "PHP",
        "JavaScript",
      ],
      description:
        "Complete company website built in WordPress with modern SVG line animations for the hero, numerous micro-animations throughout, and custom-built theme forms for contact and career flows. Delivered as the end-to-end marketing site for Zitics Pvt Ltd.",
      link: {
        label: "zitics.com",
        href: "https://zitics.com/",
      },
    },
    {
      title: "HeroGen",
      techStack: ["NextJS", "OpenAI", "AI tool"],
      description:
        "An AI powered tool which generates Blog Hero images with the help of Dall-E-3. It takes the title and some content of the blog to create a summary for the blog and generate an image from it.",
      link: {
        label: "Hero Gen",
        href: "https://blog-image-generator-sable.vercel.app/",
      },
    },
    {
      title: "Fractal.ai",
      techStack: ["WordPress", "Custom Theme", "CSS"],
      description:
        "Created Landing pages and other pages of their marketing website.",
      logo: FractalLogo,
      link: {
        label: "fractal.ai",
        href: "https://fractal.ai/",
      },
    },
    {
      title: "Dashborde",
      techStack: ["Next.js", "Strapi", "Cloudinary"],
      description:
        "A client web app, containing a combination of 3 apps in one, a blog, an e-commerce platform, and a travel guide.",
      link: {
        label: "Dashborde",
        href: "https://dashborde.com/",
      },
    },
    {
      title: "CXR Agency Chatbot",
      techStack: ["AI Chatbot", "TypeScript", "Next.js", "OpenAi"],
      description:
        "A chatbot answering all the questions related to the site, built with OpenAI completions API",
    },
    {
      title: "Terralab",
      techStack: ["Next.js", "AdonisJS"],
      description:
        "A web app to keep track of waste emissions in building a product. It is a multi-organization platform.",
    },
    {
      title: "Eden: Discovery",
      techStack: ["Node.js", "Socket.IO", "Next.js"],
      description:
        "I was responsible responsible to write APIs for the game. I als wrote sockets to operate some crucial interactive features of the game. I also built the Dashboard for the game management.",
    },
    {
      title: "VAS Datascience",
      techStack: ["Internal Project", "Chart.js", "Next.js"],
      description:
        "An internal project dashboard to keep track of the annotations done by different models. Used all types of charts here.",
    },
  ],
} as const;
