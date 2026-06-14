interface CardProps {
  titulo: string;
  valor: string | number;
  cor: "laranja" | "roxo" | "vermelho";
  icone: string;
}

export default function Card({ titulo, valor, cor, icone }: CardProps) {
  const coresBgIcone = {
    laranja: "bg-laranja",
    roxo: "bg-roxo",
    vermelho: "bg-red-100 dark:bg-red-900",
  };

  const coresTexto = {
    laranja: "text-gray-800 dark:text-white",
    roxo: "text-gray-800 dark:text-white",
    vermelho: "text-red-500",
  };

  const corIcone = {
    laranja: "text-white",
    roxo: "text-white",
    vermelho: "text-red-500",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl card-numero">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{titulo}</p>
          <p className={`text-3xl font-bold mt-2 ${coresTexto[cor]}`}>{valor}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${coresBgIcone[cor]}`}>
          <i className={`fas ${icone} ${corIcone[cor]} text-xl`}></i>
        </div>
      </div>
    </div>
  );
}