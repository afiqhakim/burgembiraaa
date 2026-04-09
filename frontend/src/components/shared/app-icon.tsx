import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AppIconProps = {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
};

export default function AppIcon({ icon: Icon, className, strokeWidth = 1.9 }: AppIconProps) {
  return <Icon aria-hidden className={cn("size-5", className)} strokeWidth={strokeWidth} />;
}
