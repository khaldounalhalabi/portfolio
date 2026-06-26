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
  return (
    <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
      <a
        href={github?.value ?? "/"}
        target="_blank"
        rel="noreferrer"
        className="flex gap-1 hover:text-primary-container"
      >
        <IconBrandGithub className={"size-5"} />
      </a>

      <a
        href={linkedin?.value ?? "/"}
        target="_blank"
        rel="noreferrer"
        className="flex gap-1 hover:text-primary-container"
      >
        <IconBrandLinkedin className={"size-5"} />
      </a>

      <a
        href={stackoverflow?.value ?? "/"}
        target="_blank"
        rel="noreferrer"
        className="flex gap-1 hover:text-primary-container"
      >
        <IconBrandStackoverflow className={"size-5"} />
      </a>
    </div>
  );
};

export default FooterContactLinks;
