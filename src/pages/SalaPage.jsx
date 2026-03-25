import React from "react";
import { useParams, Link } from "react-router-dom";

const SalaPage = () => {
    const { id } = useParams();

    return (
        <div
            className="flex flex-col gap-6 items-center justify-center min-h-screen relative overflow-hidden space-y-16 p-8 md:p-16"
            style={{
                background: `
        linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
        url('/fundo.jfif')
    `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="fixed top-6 left-6 z-50">
                <Link
                    to="/"
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-silver drop-shadow-xl border-2 border-silver/50 shadow-2xl"
                >
                    ←
                </Link>
            </div>
            <h1 className="text-6xl font-black text-gold">SALA {id}</h1>
            <p className="text-2xl text-silver">
                Mesa de jogo aqui (mapa, tokens, chat...)
            </p>
            {/* Próximo: Konva.js para canvas */}
        </div>
    );
};

export default SalaPage;
