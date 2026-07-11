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
    <div className="flex flex-wrap gap-2">
      {links.map(
        (link) =>
          link.href && (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
              aria-label={link.label}
            >
              <link.icon className="size-5" />
            </a>
          ),
      )}
    </div>
  );
};

export default FooterContactLinks;
