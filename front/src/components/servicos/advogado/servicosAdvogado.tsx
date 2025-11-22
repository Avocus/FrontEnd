
export function ServicosAdvogado() {
    return (
        <div>
            <div className="flex flex-col items-center mt-8">
                <h1 className="text-4xl font-bold text-center">Serviços</h1>
                <p className="text-lg text-center mt-4">Veja os serviços que estão a disposição</p>
            </div>
            <div className="flex flex-col items-center mt-8">
                <div className="flex flex-col items-center w-11/12">
                    <div className="flex flex-col items-center w-full bg-primary rounded-lg p-4 shadow-md">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-2xl font-bold">Apoio de plataforma</h2>
                            <p className="text-lg text-center mt-4">Se estiver com dificuldades na plataforma clique aqui</p>
                        </div>
                        <div className="flex flex-col items-center w-full mt-4">
                            <button className="bg-tertiary hover:bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded">Ver mais</button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full bg-primary rounded-lg p-4 shadow-md mt-4">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-2xl font-bold">Receber casos</h2>
                            <p className="text-lg text-center mt-4">Para poder assumir um caso ou uma assesoria</p>
                        </div>
                        <div className="flex flex-col items-center w-full mt-4">
                            <button className="bg-tertiary hover:bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded">Ver mais</button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full bg-primary rounded-lg p-4 shadow-md mt-4">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-2xl font-bold">Gerar conteúdo</h2>
                            <p className="text-lg text-center mt-4">Deseja gera conteúdo para a plataforma e receber benefícios?</p>
                        </div>
                        <div className="flex flex-col items-center w-full mt-4">
                            <button className="bg-tertiary hover:bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded">Saiba mais</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}