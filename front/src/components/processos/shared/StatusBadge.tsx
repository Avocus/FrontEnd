import { Badge } from "@/components/ui/badge";
import { getStatusBadgeVariant } from "@/utils/processoUtils";

interface StatusBadgeProps {
  status: string;
  isAdvogado?: boolean;
}

export function StatusBadge({ status, isAdvogado = false }: StatusBadgeProps) {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {status}
    </Badge>
  );
}