import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusIcon, getStatusLabel } from "@/utils/processoUtils";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  isAdvogado?: boolean;
}

export function StatusBadge({ status, isAdvogado = false }: StatusBadgeProps) {
  return (
    <Badge className={cn("flex items-center gap-1", getStatusColor(status))}>
      {getStatusIcon(status)}
      {getStatusLabel(status, isAdvogado)}
    </Badge>
  );
}