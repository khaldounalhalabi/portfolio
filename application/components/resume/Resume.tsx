import { ResumeData } from "@/lib/resume/types";

interface ResumeProps {
  data: ResumeData;
}

const baseFontFamily =
  "Arial, Helvetica, Inter, Calibri, ui-sans-serif, system-ui, sans-serif";
const teal = "#0d9488";
const textColor = "#111827";
const mutedColor = "#374151";
const lightMutedColor = "#4b5563";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "10pt",
        fontWeight: 700,
        margin: "0 0 5px 0",
        color: teal,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </h2>
  );
}

function parseMarkdownBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} style={{ fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function parseBulletPoints(text: string): string[] {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  const bullets: string[] = [];
  let current: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("•")) {
      if (current.length > 0) {
        bullets.push(current.join(" ").trim());
      }
      current = [line.slice(1).trim()];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) {
    bullets.push(current.join(" ").trim());
  }

  return bullets;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        margin: "2px 0 0 0",
        paddingLeft: "13px",
        color: mutedColor,
        fontSize: "9.5pt",
        lineHeight: 1.25,
      }}
    >
      {items.map((item, index) => (
        <li key={index} style={{ marginBottom: "0px" }}>
          {parseMarkdownBold(item)}
        </li>
      ))}
    </ul>
  );
}

function getLinkDisplayLabel(url: string): string {
  const lower = url.toLowerCase();

  if (lower.includes("github.com")) {
    return "Github repository link";
  }

  if (lower.includes("gitlab.com")) {
    return "GitLab repository link";
  }

  return "Application Link";
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

function buildContactItems(
  data: ResumeData,
): Array<{ label?: string; value: string; href?: string }> {
  const { contact } = data;
  const items: Array<{ label?: string; value: string; href?: string }> = [];

  if (contact.location) {
    items.push({ value: contact.location });
  }

  if (contact.phone) {
    items.push({ value: contact.phone.replace(/\s+/g, ""), href: `tel:${contact.phone}` });
  }

  if (contact.email) {
    items.push({ value: contact.email, href: `mailto:${contact.email}` });
  }

  if (contact.linkedIn) {
    items.push({ value: stripProtocol(contact.linkedIn), href: contact.linkedIn });
  }

  if (contact.github) {
    items.push({ value: contact.github, href: contact.github });
  }

  if (contact.gitlab) {
    items.push({ value: contact.gitlab, href: contact.gitlab });
  }

  if (contact.stackoverflow) {
    items.push({
      value: stripProtocol(contact.stackoverflow),
      href: contact.stackoverflow,
    });
  }

  if (contact.telegram) {
    items.push({ value: stripProtocol(contact.telegram), href: contact.telegram });
  }

  if (contact.whatsapp) {
    items.push({ value: stripProtocol(contact.whatsapp), href: contact.whatsapp });
  }

  return items;
}

export function Resume({ data }: ResumeProps) {
  const {
    name,
    title,
    summary,
    experiences,
    projects,
    skillGroups,
    languages,
    education,
  } = data;

  const contactItems = buildContactItems(data);

  return (
    <main
      style={{
        fontFamily: baseFontFamily,
        fontSize: "9.5pt",
        lineHeight: 1.35,
        color: textColor,
        width: "100%",
        maxWidth: "8.27in",
        margin: "0 auto",
        padding: "0.32in 0.4in",
        backgroundColor: "#ffffff",
      }}
    >
      <header style={{ marginBottom: "8px", breakInside: "avoid" }}>
        <h1
          style={{
            fontSize: "20pt",
            fontWeight: 700,
            margin: "0 0 2px 0",
            color: textColor,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
          }}
        >
          {name}
        </h1>

        {contactItems.length > 0 && (
          <p
            style={{
              margin: "0 0 4px 0",
              color: mutedColor,
              fontSize: "8.5pt",
              lineHeight: 1.3,
            }}
          >
            {contactItems.map((item, index) => {
              const separator = index < contactItems.length - 1 ? "  •  " : "";
              const content = item.href ? (
                <a
                  href={item.href}
                  style={{ color: mutedColor, textDecoration: "none" }}
                >
                  {item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              );

              return (
                <span key={index}>
                  {content}
                  {separator}
                </span>
              );
            })}
          </p>
        )}

        {title && (
          <p
            style={{
              fontSize: "10pt",
              fontWeight: 700,
              margin: 0,
              color: textColor,
              lineHeight: 1.25,
            }}
          >
            {title}
          </p>
        )}
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.18in",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {summary && (
            <section style={{ marginBottom: "8px", breakInside: "avoid" }}>
              <p
                style={{
                  margin: 0,
                  color: mutedColor,
                  fontSize: "9.5pt",
                  lineHeight: 1.35,
                }}
              >
                {summary}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section style={{ marginBottom: "8px" }}>
              <SectionHeading>Work Experience</SectionHeading>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {experiences.map((experience) => (
                  <article
                    key={experience.id}
                    style={{ breakInside: "avoid" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: textColor, fontSize: "9.5pt" }}>
                        {experience.companyName}
                        {experience.location ? ` • ${experience.location}` : ""}
                      </span>
                      <span
                        style={{
                          fontSize: "9pt",
                          fontWeight: 600,
                          color: textColor,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {experience.dateRange}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "10pt",
                        fontWeight: 700,
                        margin: "0px 0 0 0",
                        color: textColor,
                      }}
                    >
                      {experience.position}
                    </h3>
                    <BulletList items={parseBulletPoints(experience.jobDescription)} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionHeading>Projects</SectionHeading>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {projects.map((project) => (
                  <article key={project.id}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: textColor, fontSize: "10pt" }}>
                        {project.title}
                      </span>
                      <span
                        style={{
                          fontSize: "9pt",
                          fontWeight: 600,
                          color: textColor,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.year ?? ""}
                      </span>
                    </div>
                    {project.employer && (
                      <p
                        style={{
                          margin: "0px 0 0 0",
                          color: mutedColor,
                          fontSize: "9.5pt",
                        }}
                      >
                        {project.employer}
                      </p>
                    )}
                    {project.projectUrl && (
                      <p
                        style={{
                          margin: "0px 0 0 0",
                          fontSize: "9pt",
                        }}
                      >
                        <a
                          href={project.projectUrl}
                          style={{
                            color: teal,
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {getLinkDisplayLabel(project.projectUrl)}
                        </a>
                      </p>
                    )}
                    <p
                      style={{
                        margin: "1px 0 0 0",
                        color: mutedColor,
                        fontSize: "9.5pt",
                        lineHeight: 1.3,
                      }}
                    >
                      {project.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside style={{ flex: "0 0 1.75in", minWidth: 0 }}>
          {skillGroups.length > 0 && (
            <section style={{ marginBottom: "10px", breakInside: "avoid" }}>
              <SectionHeading>Skills</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {skillGroups.map((group) => (
                  <div key={group.category}>
                    <span
                      style={{
                        fontWeight: 700,
                        color: textColor,
                        fontSize: "9.5pt",
                      }}
                    >
                      {group.category}:{" "}
                    </span>
                    <span style={{ color: mutedColor, fontSize: "9.5pt" }}>
                      {group.skills.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages && (
            <section style={{ marginBottom: "10px", breakInside: "avoid" }}>
              <SectionHeading>Languages</SectionHeading>
              <p
                style={{
                  margin: 0,
                  color: mutedColor,
                  fontSize: "9.5pt",
                }}
              >
                {languages}
              </p>
            </section>
          )}

          {education && (
            <section style={{ breakInside: "avoid" }}>
              <SectionHeading>Education</SectionHeading>
              <p
                style={{
                  margin: "0 0 2px 0",
                  fontWeight: 700,
                  color: textColor,
                  fontSize: "9.5pt",
                  lineHeight: 1.25,
                }}
              >
                {education.degree}
                {education.field ? `, ${education.field}` : ""}
              </p>
              <p
                style={{
                  margin: "0 0 2px 0",
                  color: mutedColor,
                  fontSize: "9.5pt",
                }}
              >
                {education.school}
              </p>
              <p
                style={{
                  margin: 0,
                  color: lightMutedColor,
                  fontSize: "9pt",
                }}
              >
                {education.dateRange}
              </p>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
