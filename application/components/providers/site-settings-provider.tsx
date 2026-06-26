"use client";

import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import SiteSetting from "@/models/SiteSetting";
import { createContext, ReactNode, useContext } from "react";

type SiteSettingsContextType = {
  siteSettings: SiteSetting[];
  get: <K extends SiteSettingKeyEnum>(
    key: K,
  ) => Extract<SiteSetting, { key: K }> | null;
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  siteSettings: [],
  get: <K extends SiteSettingKeyEnum>(
    _key: K,
  ): Extract<SiteSetting, { key: K }> | null => null,
});

const SiteSettingsProvider = ({
  siteSettings,
  children,
}: {
  siteSettings: SiteSetting[];
  children?: ReactNode;
}) => {
  const get = <K extends SiteSettingKeyEnum>(
    key: K,
  ): Extract<SiteSetting, { key: K }> | null => {
    return (
      (siteSettings.find((s) => s.key === key) as
        | Extract<SiteSetting, { key: K }>
        | undefined) ?? null
    );
  };

  return (
    <SiteSettingsContext value={{ siteSettings, get }}>
      {children}
    </SiteSettingsContext>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

export default SiteSettingsProvider;
