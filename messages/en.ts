import type { MessageSchema } from "./types";

export const en: MessageSchema & {
  registry: {
    title: string;
    description: string;
    placeholder: string;
    search: string;
    searching: string;
    notFound: string;
    inputError: string;
    searchError: string;
    fullName: string;
    certificateId: string;
    qualification: string;
    seaMiles: string;
    status: string;
    verify: string;
  };
  windEngine: {
    hero: {
      title: string;
      subtitle: string;
    };
    compass: {
      title: string;
      desc: string;
    };
    sea: {
      title: string;
      desc: string;
    };
    decision: {
      title: string;
      desc: string;
    };
    lessons: {
      title: string;
      items: string[];
    };
    scenario: {
      title: string;
      desc: string;
    };
    case: {
      see: string;
      meaning: string;
      mistake: string;
      response: string;
      insight: string;
    };
    quiz: {
      title: string;
      desc: string;
    };
    summary: {
      text: string;
    };
  };
} = {
  nav: {
    home: "Home",
    training: "Training",
    programs: "Programs",
    charter: "Charter",
    registry: "Registry",
    verify: "Verify",
    contact: "Contact",
    admin: "Admin",
    adminLogin: "Admin Login",
    reserve: "Reservation",
    menu: "Menu",
  },

  footer: {
    description:
      "Professional sailing training, certification, and registry verification platform.",
    navigationTitle: "Navigation",
    certificationTitle: "Certification",
    contactTitle: "Contact",
    rights: "All rights reserved",
  },

  heroBadge: "Albatros Sailing · Official Training Platform",
  heroTitle:
    "Premium Sailing Training for Those Seeking Real Competence and Trust.",
  heroDescription:
    "Train on real routes, improve your practical seamanship skills, earn a verifiable certificate, and move forward at sea with confidence, discipline, and authority.",
  heroPrimaryButton: "Start Training",
  heroSecondaryButton: "Explore Programs",
  heroTags: [
    "Offshore Training",
    "Professional Development",
    "Secure Verification System",
  ],

  stats: [
    {
      label: "Real Sea Training",
      value: "Practical training on real offshore routes in open sea conditions.",
    },
    {
      label: "Verifiable Certificate",
      value: "Secure certificate verification infrastructure backed by registry records.",
    },
    {
      label: "Card Front / Back",
      value: "Physical license appearance combined with digital verification.",
    },
    {
      label: "Professional Path",
      value: "Structured development from entry level to advanced capability.",
    },
  ],

  verificationAdvantageTitle: "Verification Advantage",
  verificationAdvantageDescription:
    "At the core of a real training system are proof, structure, and trust. Albatros Sailing combines practical training with a premium certificate and verification experience.",

  trustBar: [
    {
      title: "Built for Development",
      description:
        "Structured progression from first command decisions to advanced offshore confidence.",
    },
    {
      title: "Built for Trust",
      description:
        "Institutional trust through registry-backed documents and instant verification logic.",
    },
    {
      title: "For Serious Participants",
      description:
        "Not an ordinary course experience, but a premium maritime development path.",
    },
  ],

  featuresSectionBadge: "Core Platform Strengths",
  featuresSectionTitle:
    "A powerful sailing platform that trains, certifies, and verifies.",
  featuresSectionDescription:
    "This structure is designed to deliver real training, produce certificates, and create a stronger sense of institutional trust.",

  features: [
    {
      title: "Professional Sailing Training",
      description:
        "Structured training programs from entry level to confident command in offshore conditions.",
      href: "/training",
    },
    {
      title: "Official Registry System",
      description:
        "Search and review official certificate records through the Albatros Sailing verification infrastructure.",
      href: "/registry",
    },
    {
      title: "Certificate Verification",
      description:
        "Check active certificates instantly through the secure verification portal.",
      href: "/verify",
    },
  ],

  learnLabel: "Explore",
  learnMore: "Learn More",

  programsSectionBadge: "Training Programs",
  programsSectionTitle: "Choose the route that fits your goal.",
  programsSectionDescription:
    "Each program is designed to move you toward more confidence, greater command, and stronger reputation at sea.",
  viewAllPrograms: "View All Programs",
  programCardBadge: "Program",
  viewDetails: "View Details",

  programs: [
    {
      title: "Basic Sailing",
      description:
        "A strong introduction to sailing, safety, boat handling, and fundamental seamanship.",
      href: "/programs/basic-sailing",
    },
    {
      title: "Coastal Skipper",
      description:
        "Navigation, command skills, marina maneuvers, and coastal passage planning.",
      href: "/programs/coastal-skipper",
    },
    {
      title: "Offshore Yacht Course",
      description:
        "Advanced training focused on weather systems, night passage, offshore routines, and endurance.",
      href: "/programs/offshore-yacht-course",
    },
    {
      title: "Yachtmaster Track",
      description:
        "A premium, certificate-oriented development path for candidates aiming for command and authority.",
      href: "/programs/yachtmaster",
    },
  ],

  verifySectionBadge: "Official Certificate Verification",
  verifySectionTitle: "Trust becomes stronger when it can be verified instantly.",
  verifySectionDescription:
    "Search the official record, check certificate validity, and strengthen institutional trust with a professional digital verification flow.",
  verifyButton: "Verify Certificate",
  registryButton: "Open Registry",

  whyItMattersTitle: "Why It Matters",
  whyItMattersItems: [
    {
      title: "Institutional Trust",
      description:
        "A visible verification system increases the perception of quality and seriousness across the entire training structure.",
    },
    {
      title: "Student Confidence",
      description:
        "A real registry and certificate logic strengthens the participant’s commitment to their achievement.",
    },
    {
      title: "Premium Positioning",
      description:
        "Verification is not only a function; it is a strong brand signal that separates you from ordinary course pages.",
    },
  ],

  ctaTitle: "Ready for your sailing experience?",
  ctaDescription:
    "Train with Albatros Sailing or explore premium charter opportunities.",

  homeWhy: {
    badge: "WHY ALBATROS",
    title:
      "People are not looking for just a course, but a trusted maritime brand.",
    description:
      "Albatros Sailing combines training, real sea practice, route experience and verifiable certification in one premium system.",
    items: [
      {
        title: "Real Sea Practice",
        description: "Not theory, but real routing and crew discipline.",
      },
      {
        title: "Premium Experience",
        description: "High-end experience from training to presentation.",
      },
      {
        title: "International Vision",
        description: "Offshore mindset and global routes.",
      },
      {
        title: "Verifiable System",
        description: "QR + online verification infrastructure.",
      },
    ],
  },

  trainingModules: {
    badge: "TRAINING PATH",
    title: "We approach maritime training as a complete system, not isolated modules.",
    description:
      "The goal is not only to teach sailing, but to build decision-making, safety awareness, route management, and professional seamanship reflexes.",
    items: [
      {
        title: "Sextant & Navigation",
        description:
          "A skipper mindset that understands both modern navigation tools and classical navigation logic.",
        href: "/guide/sextant-nedir",
      },
      {
        title: "COLREG",
        description:
          "Collision regulations, traffic logic, and disciplined decision-making at sea.",
        href: "/guide/colreg",
      },
      {
        title: "AIS / VTS",
        description:
          "A module focused on awareness in dense traffic, TSS, and professional maritime environments.",
        href: "/guide/ais-ve-vts-nedir",
      },
      {
        title: "Route Planning",
        description:
          "Real route-building logic through weather, timing, alternatives, and safety decisions.",
        href: "/guide/rota-planlama",
      },
    ],
  },

  instructorAuthority: {
    badge: "INSTRUCTOR AUTHORITY",
    title: "Authority in training, confidence at sea.",
    description:
      "We do not only transfer knowledge. We train captains who can decide, lead teams, and act with real seamanship instincts.",
    items: [
      "Offshore training",
      "Real navigation",
      "Crew management",
      "Professional discipline",
    ],
  },

  certificateCta: {
    title: "Verify your certificate.",
    description:
      "Albatros certificates can be verified online. This makes trust visible and strengthens the brand institutionally.",
    button: "Verify",
  },

  alumniSection: {
    title: "Albatros alumni",
    items: [
      "“It changed my life.”",
      "“Real captaincy starts here.”",
      "“More than a course, it is an experience.”",
    ],
  },

  charterIntro: {
    badge: "CHARTER EXPERIENCE",
    title: "Charter is a premium experience layer that supports our main identity.",
    description:
      "The Albatros Sailing charter side represents the selected route and sea-experience layer of the brand alongside training.",
  },

  homeFinalCta: {
    badge: "NEXT STEP",
    title: "Let’s plan the right training path for you.",
    description:
      "From entry level to offshore discipline, we can define the right program structure for your goal together.",
    primary: "Explore Programs",
    secondary: "Contact Us",
  },

  windEngine: {
    hero: {
      title: "Wind Reading Is Not Knowledge, It Is Discipline",
      subtitle:
        "Wind direction, force and sea response are not just data—they define decision-making. This module teaches not how to read wind, but how to manage it.",
    },

    compass: {
      title: "Wind Direction: Not Reading, But Positioning",
      desc:
        "Wind direction defines load distribution and approach geometry. A 16-point compass provides precise spatial awareness.",
    },

    sea: {
      title: "Sea State: The True Expression of Wind",
      desc:
        "The sea surface reflects the real impact of wind. Wave patterns and foam often provide more reliable interpretation than raw data.",
    },

    decision: {
      title: "Decision Point: Training or Operation?",
      desc:
        "The same wind carries different meaning depending on context. Experience is the ability to define that boundary.",
    },

    lessons: {
      title: "Core Principles",
      items: [
        "A windsock shows direction, not decisions.",
        "Beaufort describes, but interpretation is required.",
        "Sea state validates wind behavior.",
        "True seamanship comes from reading all inputs together.",
      ],
    },

    scenario: {
      title: "Applied Scenario Analysis",
      desc:
        "Knowledge alone is not enough. Value lies in making the right decision at the right moment.",
    },

    case: {
      see: "What You See",
      meaning: "Operational Meaning",
      mistake: "Common Mistake",
      response: "Best Response",
      insight: "Instructor Insight",
    },

    quiz: {
      title: "Not Testing Knowledge, But Questioning Decisions",
      desc:
        "The goal is not to find the right answer, but to build the right thinking process.",
    },

    summary: {
      text:
        "Wind is not memorized. It is read, interpreted, and turned into decisions. The Albatros approach builds decision-making, not information.",
    },
  },

  registry: {
    title: "Global Certificate Registry System",
    description:
      "Enter the certificate ID to search and verify the Albatros Sailing digital certificate record.",
    placeholder: "Example: AS-OFF-2026-1735",
    search: "Search Certificate",
    searching: "Searching...",
    notFound: "No record found for this certificate ID.",
    inputError: "Please enter a Certificate ID.",
    searchError: "An error occurred during search.",
    fullName: "Full Name",
    certificateId: "Certificate ID",
    qualification: "Qualification",
    seaMiles: "Sea Miles",
    status: "Status",
    verify: "Open Full Verification Page",
  },
};