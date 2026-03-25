import React from "react";
import { Link } from "react-router-dom";

const PersonagensPage = () => {
    return (
        <div
            className="flex flex-col gap-6 items-center justify-center min-h-screen bg-black p-12 space-y-12"
            style={{
                background: `
                    linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
                    url('/fundo.jfif')
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* VOLTAR */}
            <div className="fixed top-6 left-6">
                <Link
                    to="/jogador"
                    className="w-20 h-20 bg-black/60 rounded-2xl flex items-center justify-center text-3xl text-gold border-2 border-gold/50"
                >
                    ←
                </Link>
            </div>

            <h1 className="text-6xl font-black text-gold">PERSONAGENS</h1>

            <div className="flex flex-col md:flex-row gap-12">
                {/* CRIAR */}
                <Link
                    to="/criar-personagem"
                    className="bg-blue-900/70 hover:bg-blue-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all text-2xl flex items-center justify-center"
                >
                    Criar Personagem
                </Link>

                {/* VISUALIZAR */}
                <Link
                    to="/visualizar-personagens"
                    className="bg-blue-900/70 hover:bg-blue-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all text-2xl flex items-center justify-center"
                >
                    Visualizar
                </Link>
            </div>
        </div>
    );
};

export default PersonagensPage;
