"use client";

import { useSiteSettings } from "@/components/providers/site-settings-provider";
import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandStackoverflow,
} from "@tabler/icons-react";

const FooterContactLinks = () => {
  const { get } = useSiteSettings();
  const github = get(SiteSettingKeyEnum.GITHUB);
  const linkedin = get(SiteSettingKeyEnum.LINKED_IN);
  const stackoverflow = get(SiteSettingKeyEnum.STACKOVERFLOW);

  const links = [
    { href: github?.value, icon: IconBrandGithub, label: "GitHub" },
    { href: linkedin?.value, icon: IconBrandLinkedin, label: "LinkedIn" },
    {
      href: stackoverflow?.value,
      icon: IconBrandStackoverflow,
      label: "Stack Overflow",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant">
      {links.map(
        (link) =>
          link.href && (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/8 text-on-surface-variant transition-all duration-300 hover:border-primary-container/30 hover:text-primary-container"
              aria-label={link.label}
            >
              <link.icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
            </a>
          ),
      )}
    </div>
  );
};

export default FooterContactLinks;
