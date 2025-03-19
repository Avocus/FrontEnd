export function ServicosClienteMobile() {
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
                            <h2 className="text-2xl font-bold">Entrar com um processo</h2>
                            <p className="text-lg text-center mt-4">Dê entrada em um processo de maneira facilitada</p>
                        </div>
                        <div className="flex flex-col items-center w-full mt-4">
                            <button className="bg-tertiary hover:bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded">Ver mais</button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full bg-primary rounded-lg p-4 shadow-md mt-4">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-2xl font-bold">Assessoria</h2>
                            <p className="text-lg text-center mt-4">Encontre um advogado perfeito para você ter uma assessoria</p>
                        </div>
                        <div className="flex flex-col items-center w-full mt-4">
                            <button className="bg-tertiary hover:bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded">Ver mais</button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-full bg-primary rounded-lg p-4 shadow-md mt-4">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-2xl font-bold">Consulta particular</h2>
                            <p className="text-lg text-center mt-4">Caso nosso chat não foi o suficiente, faça uma consulta particular com o advogado ideal</p>
                        </div>
                        <div className="flex flex-col items-center w-full mt-4">
                            <button className="bg-tertiary hover:bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded">Ver mais</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
