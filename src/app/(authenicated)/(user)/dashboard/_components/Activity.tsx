

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  Icon: React.ElementType;
  iconWrapClass: string;
  iconClass: string;
  titleClass?: string;
};

export default function Activity({ item }: { item: ActivityItem }) {
  const { title, time, Icon, iconWrapClass, iconClass, titleClass } = item;

  return (
    <div className="flex items-start gap-4">
      <div
        className={`h-10 w-10 rounded-full grid place-items-center ${iconWrapClass}`}
      >
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>

      <div className="space-y-1">
        <p className={`font-medium ${titleClass ?? "text-primary"}`}>
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
