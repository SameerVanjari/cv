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
  location: "Amravati, MH, INDIA",
  locationLink: "https://maps.app.goo.gl/BYccc4PGCp9R2mNcA",
  about:
    "Software Developer building products that help businesses and draw people's interest",
  summary:
    "As a Software developer, I have successfully created products for clients from scratch. I helped teams complete several client projects too.  I've spent around 1.5 years as a Freelance dev, working for local businesses, then 2 years honing my skills at agencies like CXR.Agency. I've contributed to several projects in various industries. Currently, I work mostly with TypeScript, NextJS, React, Node.js. I also love to learn and try new tech (currently looking into GO).",
  avatarUrl: "https://avatars.githubusercontent.com/u/71498176?v=4",
  // personalWebsiteUrl: "https://jarocki.me",
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
        url: "https://www.linkedin.com/in/sameer-vanjari/",
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
      degree: "Bachelor's Degree in Mechanical Engineering",
      start: "2017",
      end: "2021",
    },
  ],
  work: [
    {
      company: "CXR.Agency",
      link: "https://cxr.agency",
      badges: ["Remote"],
      title: "Software Developer",
      logo: CXRLogo,
      start: "Apr 2023",
      end: "Present",
      description:
        "Worked on projects for different clients from different industries like ecommerce, environment agencies, gaming industries etc.",
    },
    {
      company: "Cemtrex Labs",
      link: "https://cemtrexlabs.com",
      badges: ["On site"],
      title: "Trainee Software Developer",
      logo: CemtrexLogo,
      start: "Apr 2022",
      end: "Apr 2023",
      description:
        "Worked as frontend dev, creating admin dashboards for different projects, both internal and client. Contributed to creating landing pages for client sites.",
    },
    {
      company: "Freelancer",
      title: "Web Developer",
      start: "Jul 2020",
      end: "Apr 2022",
      description:
        "Worked as Freelance dev, creating landing pages for local businesses. Worked in mostly React and Bootstrap.",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React/Next.js",
    "Node.js/AdonisJS",
    "Tailwind",
    "Strapi",
    "Shopify API",
  ],
  projects: [
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
        href: "https://beta.dashborde.com//",
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
