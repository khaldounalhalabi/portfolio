import { Mail, MapPin, Phone } from "lucide-react";

import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import { getPortfolioData } from "@/lib/portfolio/queries";

export default async function ContactPage() {
  const { contactInfo, contactLinks } = await getPortfolioData();

  return (
    <main className="pb-24 pt-20">
      <section className="container-shell">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">
          Connection Node
        </p>
        <h1 className="mt-5 bg-linear-to-r from-primary to-primary-container bg-clip-text font-heading text-5xl font-bold text-transparent md:text-7xl">
          Get in Touch
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant">
          {contactInfo.intro}
        </p>
      </section>

      <section className="container-shell mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/6 bg-surface-container-low p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">
            Contact Details
          </p>
          <div className="mt-8 space-y-6">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5"
            >
              <div className="rounded-xl bg-surface-container p-3 text-primary-container">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                  Email
                </p>
                <p className="mt-2 text-primary">{contactInfo.email}</p>
              </div>
            </a>
            <a
              href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
              className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5"
            >
              <div className="rounded-xl bg-surface-container p-3 text-primary-container">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                  Phone
                </p>
                <p className="mt-2 text-primary">{contactInfo.phone}</p>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5">
              <div className="rounded-xl bg-surface-container p-3 text-primary-container">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                  Location
                </p>
                <p className="mt-2 text-primary">{contactInfo.location}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/6 bg-surface-container-low p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">
              Social Nodes
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {contactLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-surface-container-high px-5 py-4 text-on-surface-variant hover:text-primary"
                >
                  <PortfolioIcon name={link.icon} className="h-5 w-5 text-primary-container" />
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-primary-container/15 bg-linear-to-br from-primary-container/10 to-secondary/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">
              Availability
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold text-primary">
              {contactInfo.availability}
            </h2>
            <p className="mt-4 text-sm leading-7 text-on-surface-variant">
              The admin dashboard controls everything in this block, including
              resume label and contact links, so the public contact page stays in
              sync with your CMS data.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
