
export type Lang = "tr" | "en";
export type MessageSchema = {
  nav: {
    home: string;
    training: string;
    programs: string;
    charter: string;
    registry: string;
    verify: string;
    contact: string;
    admin: string;
    adminLogin: string;
    reserve: string;
    menu: string;
  };

  footer: {
    description: string;
    navigationTitle: string;
    certificationTitle: string;
    contactTitle: string;
    rights: string;
  };

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryButton: string;
  heroSecondaryButton: string;
  heroTags: string[];

  stats: {
    label: string;
    value: string;
  }[];

  verificationAdvantageTitle: string;
  verificationAdvantageDescription: string;

  trustBar: {
    title: string;
    description: string;
  }[];

  featuresSectionBadge: string;
  featuresSectionTitle: string;
  featuresSectionDescription: string;

  features: {
    title: string;
    description: string;
    href: string;
  }[];

  learnLabel: string;
  learnMore: string;

  programsSectionBadge: string;
  programsSectionTitle: string;
  programsSectionDescription: string;
  viewAllPrograms: string;
  programCardBadge: string;
  viewDetails: string;

  programs: {
    title: string;
    description: string;
    href: string;
  }[];

  verifySectionBadge: string;
  verifySectionTitle: string;
  verifySectionDescription: string;
  verifyButton: string;
  registryButton: string;

  whyItMattersTitle: string;
  whyItMattersItems: {
    title: string;
    description: string;
  }[];


    ctaTitle: string;
  ctaDescription: string;

  

  homeWhy: {
    badge: string;
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
    }[];
  };

  trainingModules: {
    badge: string;
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
      href: string;
    }[];
  };

  instructorAuthority: {
    badge: string;
    title: string;
    description: string;
    items: string[];
  };

  certificateCta: {
    title: string;
    description: string;
    button: string;
  };

  alumniSection: {
    title: string;
    items: string[];
  };

  charterIntro: {
    badge: string;
    title: string;
    description: string;
  };

  homeFinalCta: {
    badge: string;
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };

};
