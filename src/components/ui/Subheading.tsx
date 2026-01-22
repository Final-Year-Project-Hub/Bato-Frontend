import { cn } from "@/lib/utils";

type SubheadingProps = {
  content: string;
  className?: string;
};

export default function Subheading({ content, className }: SubheadingProps) {
  return (
    <div
      className={cn(
        "rounded-full text-secondary py-2 px-4 text-sm bg-grey w-fit",
        className
      )}
    >
      <p>{content}</p>
    </div>
  );
}
