"use client";

import Link from "next/link";

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  Icon: React.ElementType;
  iconWrapClass: string;
  iconClass: string;
  titleClass?: string;
  href?: string;
};

export default function Activity({ item }: { item: ActivityItem }) {
  const { title, time, Icon, iconWrapClass, iconClass, titleClass, href } = item;

  const content = (
    <div className="flex items-center gap-4 group py-3">
      <div className={`h-10 w-10 rounded-full grid place-items-center shrink-0 ${iconWrapClass}`}>
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>
      <div className="space-y-0.5">
        <p className={`font-medium group-hover:underline leading-snug ${titleClass ?? "text-primary"}`}>
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}