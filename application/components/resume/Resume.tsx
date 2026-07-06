import { sanitizeRichText } from "@/lib/rich-text";
import { ResumeData } from "@/lib/resume/types";

interface ResumeProps {
  data: ResumeData;
}

const baseFontFamily =
  "Arial, Helvetica, Inter, Calibri, ui-sans-serif, system-ui, sans-serif";
const teal = "#0d9488";
const textColor = "#111827";
const mutedColor = "#374151";

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

function ResumeHtmlContent({ html }: { html: string }) {
  const sanitized = sanitizeRichText(html);

  return (
    <>
      <style>{`
        .resume-html-content {
          color: ${mutedColor};
          font-size: 9.5pt;
          line-height: 1.25;
        }
        .resume-html-content p {
          margin: 0 0 3px 0;
        }
        .resume-html-content p:last-child {
          margin-bottom: 0;
        }
        .resume-html-content ul,
        .resume-html-content ol {
          margin: 2px 0 0 0;
          padding-left: 13px;
        }
        .resume-html-content li {
          margin-bottom: 0;
        }
        .resume-html-content li > p {
          margin: 0;
        }
        .resume-html-content strong {
          font-weight: 700;
          color: ${textColor};
        }
        .resume-html-content a {
          color: ${teal};
          text-decoration: none;
        }
        .resume-html-content em {
          font-style: italic;
        }
        .resume-html-content h2,
        .resume-html-content h3,
        .resume-html-content h4 {
          font-size: 9.5pt;
          font-weight: 700;
          margin: 4px 0 2px 0;
          color: ${textColor};
        }
      `}</style>
      <div
        className="resume-html-content"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </>
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
                    <ResumeHtmlContent html={experience.jobDescription} />
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
              <ResumeHtmlContent html={education} />
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
