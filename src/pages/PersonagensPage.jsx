import React, { useState } from "react";
import { Link } from "react-router-dom";

const PersonagensPage = () => {
    const [personagens, setPersonagens] = useState([]);

    return (
        <div
            className="flex flex-col gap-6 items-center justify-center min-h-screen bg-black relative overflow-hidden p-12 space-y-12"
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
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    ←
                </Link>
            </div>

            <h1 className="text-7xl font-black text-gold drop-shadow-2xl">
                MEUS PERSONAGENS
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <button className="bg-blue-900/70 hover:bg-blue-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer">
                    Criar Personagem
                </button>

                <button className="bg-blue-900/70 hover:bg-blue-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer">
                    Meus Personagens ({personagens.length})
                </button>
            </div>

            {personagens.length === 0 && (
                <div className="text-center text-silver text-xl mt-12">
                    Nenhum personagem criado ainda. Crie seu primeiro
                    personagem!
                </div>
            )}
        </div>
    );
};

export default PersonagensPage;
