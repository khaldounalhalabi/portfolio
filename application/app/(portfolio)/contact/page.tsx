import { Mail, MapPin, Phone } from "lucide-react";

import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import SiteSettingService from "@/services/SiteSettingService";
import {
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandLinkedin,
  IconBrandStackoverflow,
  IconBrandTelegram,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

export default async function ContactPage() {
  const siteSettings = await SiteSettingService.make().getByKeys([
    SiteSettingKeyEnum.EMAIL,
    SiteSettingKeyEnum.LINKED_IN,
    SiteSettingKeyEnum.GITHUB,
    SiteSettingKeyEnum.PHONE,
    SiteSettingKeyEnum.LOCATION,
    SiteSettingKeyEnum.STACKOVERFLOW,
    SiteSettingKeyEnum.GITLAB,
    SiteSettingKeyEnum.WHATSAPP,
    SiteSettingKeyEnum.TELEGRAM,
    SiteSettingKeyEnum.PRE_FILLED_MESSAGE,
  ]);
  const find = <K extends SiteSettingKeyEnum>(key: K) =>
    siteSettings.find(
      (s): s is Extract<(typeof siteSettings)[number], { key: K }> =>
        s.key === key,
    ) ?? null;

  const email = find(SiteSettingKeyEnum.EMAIL);
  const phone = find(SiteSettingKeyEnum.PHONE);
  const location = find(SiteSettingKeyEnum.LOCATION);

  const linkedin = find(SiteSettingKeyEnum.LINKED_IN);
  const github = find(SiteSettingKeyEnum.GITHUB);
  const gitlab = find(SiteSettingKeyEnum.GITLAB);
  const stackoverflow = find(SiteSettingKeyEnum.STACKOVERFLOW);
  const whatsapp = find(SiteSettingKeyEnum.WHATSAPP);
  const telegram = find(SiteSettingKeyEnum.TELEGRAM);

  const subject = encodeURIComponent("New Project Inquiry");
  const message = encodeURIComponent(
    find(SiteSettingKeyEnum.PRE_FILLED_MESSAGE)?.value ?? "Hello",
  );

  return (
    <main className="pt-20 pb-24">
      <section className="container-shell">
        <p className="text-xs tracking-[0.3em] text-secondary uppercase">
          Connection Node
        </p>
        <h1 className="mt-5 bg-linear-to-r from-primary to-primary-container bg-clip-text font-heading text-5xl font-bold text-transparent md:text-7xl">
          Get in Touch
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant">
          Whether you have a technical challenge, a project proposal, or just
          want to discuss the future of full-stack architecture, my digital door
          is open.
        </p>
      </section>

      <section className="container-shell mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/6 bg-surface-container-low p-8">
          <p className="text-xs tracking-[0.3em] text-secondary uppercase">
            Contact Details
          </p>
          <div className="mt-8 space-y-6">
            <a
              href={`mailto:${email?.value}?subject=${subject}&body=${message}`}
              className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5"
              target={"_blank"}
            >
              <div className="rounded-xl bg-surface-container p-3 text-primary-container">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] text-on-surface-variant uppercase">
                  Email
                </p>
                <p className="mt-2 text-primary">{email?.value}</p>
              </div>
            </a>
            <a
              href={`tel:${phone?.value.replace(/\s+/g, "")}`}
              className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5"
            >
              <div className="rounded-xl bg-surface-container p-3 text-primary-container">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] text-on-surface-variant uppercase">
                  Phone
                </p>
                <p className="mt-2 text-primary">{phone?.value}</p>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5">
              <div className="rounded-xl bg-surface-container p-3 text-primary-container">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] text-on-surface-variant uppercase">
                  Location
                </p>
                <p className="mt-2 text-primary">{location?.value}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-white/6 bg-surface-container-low p-8">
            <p className="text-xs tracking-[0.3em] text-secondary uppercase">
              Social Nodes
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={linkedin?.value}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-surface-container-high px-5 py-4 text-on-surface-variant hover:text-primary"
              >
                <IconBrandLinkedin />
                <span className="font-medium">Linkedin</span>
              </a>

              <a
                href={`${whatsapp?.value}?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-surface-container-high px-5 py-4 text-on-surface-variant hover:text-primary"
              >
                <IconBrandWhatsapp />
                <span className="font-medium">Whatsapp</span>
              </a>

              <a
                href={`${telegram?.value}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-surface-container-high px-5 py-4 text-on-surface-variant hover:text-primary"
              >
                <IconBrandTelegram />
                <span className="font-medium">Telegram</span>
              </a>

              <a
                href={github?.value}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-surface-container-high px-5 py-4 text-on-surface-variant hover:text-primary"
              >
                <IconBrandGithub />
                <span className="font-medium">Github</span>
              </a>

              <a
                href={gitlab?.value}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-surface-container-high px-5 py-4 text-on-surface-variant hover:text-primary"
              >
                <IconBrandGitlab />
                <span className="font-medium">Gitlab</span>
              </a>

              <a
                href={stackoverflow?.value}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-surface-container-high px-5 py-4 text-on-surface-variant hover:text-primary"
              >
                <IconBrandStackoverflow />
                <span className="font-medium">Stackoverflow</span>
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-primary-container/15 bg-linear-to-br from-primary-container/10 to-secondary/5 p-8">
            <p className="text-xs tracking-[0.3em] text-secondary uppercase">
              Availability
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold text-primary">
              Available for new opportunities
            </h2>
          </div>
        </aside>
      </section>
    </main>
  );
}
