import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CasoAdvogado } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";

interface CasoRowProps {
  caso: CasoAdvogado;
  getStatusBadgeVariant: (status: StatusProcesso) => "default" | "secondary" | "outline" | "destructive";
  getStatusLabel: (status: StatusProcesso) => string;
}

export function CasoRow({ caso, getStatusBadgeVariant, getStatusLabel }: CasoRowProps) {
  return (
    <TableRow key={caso.id}>
      <TableCell>{caso.titulo}</TableCell>
      <TableCell>{caso.clienteNome}</TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(caso.status)}>
          {getStatusLabel(caso.status)}
        </Badge>
      </TableCell>
      <TableCell>{new Date(caso.dataSolicitacao).toLocaleDateString('pt-BR')}</TableCell>
      <TableCell>
        <Button asChild variant="outline">
          <Link href={`/casos/${caso.id}`}>Ver Detalhes</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}