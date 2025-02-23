import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@radix-ui/react-progress";
import { Table } from "lucide-react";

export function HomeWebAdvogado() {    
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">

            {/* Dashboard */}
            <div className="flex-1 p-8">
                {/* Resumo de Casos */}
                <section className="grid grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Casos Ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">12</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Prazos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">3</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Avaliação Média</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">4.8/5</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Novas Mensagens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">5</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Linha do Tempo e Métricas */}
                <section className="grid grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Prazos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Caso</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Progresso</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {timeline.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>
                                                <Progress value={item.progress} className="h-2" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Métricas de Desempenho</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p>Casos Ganhos: <span className="font-bold">8</span></p>
                                    <Progress value={80} className="h-2" />
                                </div>
                                <div>
                                    <p>Tempo Médio de Resolução: <span className="font-bold">30 dias</span></p>
                                    <Progress value={60} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Lista de Casos Recentes */}
                <section className="mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Casos Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Caso</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Última Atualização</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentCases.map((caseItem, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{caseItem.case}</TableCell>
                                            <TableCell>{caseItem.client}</TableCell>
                                            <TableCell>{caseItem.status}</TableCell>
                                            <TableCell>{caseItem.lastUpdate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

// Dados mockados
const timeline = [
    { title: "Caso XYZ", date: "10/11/2023", progress: 70 },
    { title: "Caso ABC", date: "15/11/2023", progress: 50 },
    { title: "Caso DEF", date: "20/11/2023", progress: 30 },
];

const recentCases = [
    { case: "Caso XYZ", client: "Cliente A", status: "Em andamento", lastUpdate: "05/11/2023" },
    { case: "Caso ABC", client: "Cliente B", status: "Concluído", lastUpdate: "01/11/2023" },
    { case: "Caso DEF", client: "Cliente C", status: "Aguardando", lastUpdate: "25/10/2023" },
];