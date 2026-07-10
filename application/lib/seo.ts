import { Metadata } from "next";

export const siteConfig = {
  name: "Khaldoun Alhalabi",
  shortName: "Khaldoun",
  title: "Khaldoun Alhalabi | Full-Stack Architect & Engineering Leader",
  defaultDescription:
    "Portfolio of Khaldoun Alhalabi, a full-stack architect and engineering leader building scalable Laravel backends, modern React systems, and AI-flavored tooling.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://khaldoun.site",
  locale: "en_US",
  twitterHandle: "@khaldounalhalabi",
  author: {
    name: "Khaldoun Alhalabi",
    email: "khaldoun.dev@gmail.com",
    jobTitle: "Full-Stack Architect & Engineering Leader",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://khaldoun.site",
  },
  keywords: [
    "Khaldoun Alhalabi",
    "Full-Stack Architect",
    "Software Engineer",
    "Engineering Leader",
    "Laravel Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Supabase",
    "AI Integration",
    "System Architecture",
    "Portfolio",
  ],
  openGraph: {
    type: "website",
    siteName: "Khaldoun Alhalabi",
  },
} as const;

export function createMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string | string[];
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  alternates?: Metadata["alternates"];
} = {}): Metadata {
  const {
    title,
    description = siteConfig.defaultDescription,
    path = "/",
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    tags,
    noindex = false,
    nofollow = false,
    alternates,
  } = options;

  const pageTitle = title
    ? `${title} | ${siteConfig.shortName}`
    : siteConfig.title;
  const canonicalUrl = `${siteConfig.url.replace(/\/$/, "")}${path}`;
  const ogImage = image ?? `${siteConfig.url}/opengraph-image`;

  return {
    title: pageTitle,
    description,
    keywords: siteConfig.keywords as unknown as string[],
    authors: authors ? [{ name: siteConfig.author.name, url: siteConfig.author.url }] : undefined,
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      ...alternates,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.openGraph.siteName,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: siteConfig.twitterHandle,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateJsonLd(script: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(script),
  };
}

export function personJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    jobTitle: siteConfig.author.jobTitle,
    sameAs: [
      "https://www.linkedin.com/in/khaldounalhalabi",
      "https://github.com/khaldounalhalabi",
      "https://gitlab.com/khaldounalhalabi",
      "https://stackoverflow.com/users/16442922/khaldoun-alhalabi",
    ].filter(Boolean),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function profilePageJsonLd(
  path: string,
  headline?: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteConfig.url}${path}`,
    name: headline ?? siteConfig.title,
    mainEntity: {
      "@id": `${siteConfig.url}/#person`,
    },
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
  };
}

export function projectJsonLd(project: {
  title: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  imageUrl?: string | null;
  projectUrl?: string | null;
  role?: string | null;
  year?: string | null;
  category?: string | null;
  tags?: string[];
  techStack?: { name: string; description?: string }[];
  features?: string[];
  updatedAt?: string;
  createdAt?: string;
}): Record<string, unknown> {
  const url = `${siteConfig.url}/projects/${project.slug}`;
  const image = project.imageUrl ?? `${siteConfig.url}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    url,
    description: project.description,
    ...(project.longDescription && {
      abstract: stripHtml(project.longDescription).slice(0, 500),
    }),
    image: {
      "@type": "ImageObject",
      url: image,
    },
    applicationCategory: project.category ?? "WebApplication",
    operatingSystem: "Any",
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    ...(project.role && { accountablePerson: { "@type": "Person", name: project.role } }),
    ...(project.year && { datePublished: `${project.year}-01-01` }),
    ...(project.createdAt && { dateCreated: project.createdAt }),
    ...(project.updatedAt && { dateModified: project.updatedAt }),
    ...(project.projectUrl && { installUrl: project.projectUrl }),
    ...(project.tags?.length && { keywords: project.tags.join(", ") }),
    ...(project.techStack?.length && {
      softwareRequirements: project.techStack.map((t) => t.name).join(", "),
    }),
    ...(project.features?.length && {
      featureList: project.features,
    }),
  };
}

export function projectsCollectionJsonLd(
  projects: { title: string; slug: string; description: string; imageUrl?: string | null }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Selected Works | Khaldoun Alhalabi",
    url: `${siteConfig.url}/projects`,
    description:
      "A curated set of systems, products, and experiments spanning Laravel-heavy backends, modern React stacks, and AI-flavored tooling.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/projects/${project.slug}`,
        name: project.title,
        description: project.description,
        image: project.imageUrl ?? `${siteConfig.url}/opengraph-image`,
      })),
    },
  };
}

export function experienceJsonLd(
  experiences: {
    id: string;
    companyName: string;
    position: string;
    jobDescription: string;
    from: string;
    to?: string | null;
    location: string;
    companyWebsite?: string | null;
  }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteConfig.url}/experience`,
    name: "Experience | Khaldoun Alhalabi",
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
      jobTitle: siteConfig.author.jobTitle,
      worksFor: experiences.map((experience) => ({
        "@type": "EmployeeRole",
        roleName: experience.position,
        worksFor: {
          "@type": "Organization",
          name: experience.companyName,
          url: experience.companyWebsite ?? undefined,
        },
        startDate: experience.from,
        ...(experience.to && { endDate: experience.to }),
        location: experience.location,
      })),
    },
  };
}

export function contactPageJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${siteConfig.url}/contact`,
    name: "Get in Touch | Khaldoun Alhalabi",
    mainEntity: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
      jobTitle: siteConfig.author.jobTitle,
      email: siteConfig.author.email,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
