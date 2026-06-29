import { ResumeData } from "@/lib/resume/types";

interface ResumeProps {
  data: ResumeData;
}

const baseFontFamily =
  "Arial, Helvetica, Inter, Calibri, ui-sans-serif, system-ui, sans-serif";

function ContactLink({
  label,
  value,
  href,
}: {
  label: string;
  value?: string;
  href?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <span style={{ display: "block", marginBottom: "2px" }}>
      <strong style={{ fontWeight: 600 }}>{label}:</strong>{" "}
      {href ? (
        <a
          href={href}
          style={{
            color: "#111827",
            textDecoration: "none",
          }}
        >
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </span>
  );
}

export function Resume({ data }: ResumeProps) {
  const {
    name,
    title,
    summary,
    contact,
    experiences,
    projects,
    skillGroups,
  } = data;

  return (
    <main
      style={{
        fontFamily: baseFontFamily,
        fontSize: "11pt",
        lineHeight: 1.5,
        color: "#111827",
        maxWidth: "8.5in",
        margin: "0 auto",
        padding: "0.6in",
        backgroundColor: "#ffffff",
      }}
    >
      <header style={{ marginBottom: "18px" }}>
        <h1
          style={{
            fontSize: "24pt",
            fontWeight: 700,
            margin: "0 0 4px 0",
            color: "#111827",
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </h1>
        <p
          style={{
            fontSize: "13pt",
            fontWeight: 600,
            margin: 0,
            color: "#374151",
          }}
        >
          {title}
        </p>
      </header>

      <section style={{ marginBottom: "18px" }}>
        <h2
          style={{
            fontSize: "13pt",
            fontWeight: 700,
            margin: "0 0 8px 0",
            color: "#111827",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid #d1d5db",
            paddingBottom: "4px",
          }}
        >
          Contact
        </h2>
        <div style={{ color: "#374151" }}>
          <ContactLink label="Email" value={contact.email} href={`mailto:${contact.email}`} />
          <ContactLink label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />
          <ContactLink label="Location" value={contact.location} />
          <ContactLink label="LinkedIn" value={contact.linkedIn} href={contact.linkedIn} />
          <ContactLink label="GitHub" value={contact.github} href={contact.github} />
          <ContactLink label="GitLab" value={contact.gitlab} href={contact.gitlab} />
          <ContactLink label="Stack Overflow" value={contact.stackoverflow} href={contact.stackoverflow} />
          <ContactLink label="Telegram" value={contact.telegram} href={contact.telegram} />
          <ContactLink label="WhatsApp" value={contact.whatsapp} href={contact.whatsapp} />
        </div>
      </section>

      {summary && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: 700,
              margin: "0 0 8px 0",
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #d1d5db",
              paddingBottom: "4px",
            }}
          >
            Summary
          </h2>
          <p style={{ margin: 0, color: "#374151", whiteSpace: "pre-line" }}>
            {summary}
          </p>
        </section>
      )}

      {experiences.length > 0 && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: 700,
              margin: "0 0 10px 0",
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #d1d5db",
              paddingBottom: "4px",
            }}
          >
            Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {experiences.map((experience) => (
              <article key={experience.id}>
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
                  <h3
                    style={{
                      fontSize: "12pt",
                      fontWeight: 700,
                      margin: 0,
                      color: "#111827",
                    }}
                  >
                    {experience.position}
                  </h3>
                  <span style={{ fontSize: "10pt", color: "#6b7280" }}>
                    {experience.dateRange}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#374151" }}>
                    {experience.companyName}
                  </span>
                  <span style={{ fontSize: "10pt", color: "#6b7280" }}>
                    {experience.location}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "#374151",
                    whiteSpace: "pre-line",
                  }}
                >
                  {experience.jobDescription}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: 700,
              margin: "0 0 10px 0",
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #d1d5db",
              paddingBottom: "4px",
            }}
          >
            Projects
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  <h3
                    style={{
                      fontSize: "12pt",
                      fontWeight: 700,
                      margin: 0,
                      color: "#111827",
                    }}
                  >
                    {project.title}
                  </h3>
                  <span style={{ fontSize: "10pt", color: "#6b7280" }}>
                    {project.year ?? ""}
                  </span>
                </div>
                {(project.role || project.employer) && (
                  <p style={{ margin: "2px 0 4px 0", color: "#374151" }}>
                    {project.role}
                    {project.role && project.employer ? " at " : ""}
                    {project.employer}
                  </p>
                )}
                <p style={{ margin: "0 0 4px 0", color: "#374151" }}>
                  {project.description}
                </p>
                {project.techStack.length > 0 && (
                  <p style={{ margin: 0, color: "#4b5563", fontSize: "10pt" }}>
                    <strong style={{ fontWeight: 600 }}>Technologies:</strong>{" "}
                    {project.techStack.map((tech) => tech.name).join(", ")}
                  </p>
                )}
                {project.projectUrl && (
                  <p style={{ margin: "2px 0 0 0", fontSize: "10pt" }}>
                    <a
                      href={project.projectUrl}
                      style={{ color: "#111827", textDecoration: "none" }}
                    >
                      {project.projectUrl}
                    </a>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {skillGroups.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: 700,
              margin: "0 0 10px 0",
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #d1d5db",
              paddingBottom: "4px",
            }}
          >
            Skills
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {skillGroups.map((group) => (
              <li key={group.category} style={{ marginBottom: "8px" }}>
                <strong style={{ fontWeight: 600, color: "#111827" }}>
                  {group.category}:{" "}
                </strong>
                <span style={{ color: "#374151" }}>
                  {group.skills.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
