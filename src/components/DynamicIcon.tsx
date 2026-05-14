import * as LucideIcons from "lucide-react";

export default function DynamicIcon({
  name,
  size,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Shield;
  return <IconComponent size={size} className={className} style={style} />;
}
