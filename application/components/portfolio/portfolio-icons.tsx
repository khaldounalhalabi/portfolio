import type { ComponentType } from "react";

import {
  BadgeCheck,
  Database,
  FlaskConical,
  GitFork,
  Layers3,
  LinkIcon,
  MessageCircle,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  database: Database,
  "flask-conical": FlaskConical,
  github: GitFork,
  layers: Layers3,
  link: LinkIcon,
  linkedin: BadgeCheck,
  sparkles: Sparkles,
  terminal: Terminal,
  twitter: MessageCircle,
  wrench: Wrench,
};

export function PortfolioIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? LinkIcon;
  return <Icon className={className} />;
}
