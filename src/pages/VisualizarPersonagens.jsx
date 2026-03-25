import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const VisualizarPersonagensPage = () => {
    const { personagens, fetchPersonagens, user } = useAuth();

    useEffect(() => {
        if (user) fetchPersonagens(user.id);
    }, [user]);

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
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    ←
                </Link>
            </div>

            <h1 className="text-5xl font-bold text-gold mb-10">
                SEUS PERSONAGENS
            </h1>

            {personagens.length === 0 ? (
                <p>Nenhum personagem criado.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {personagens.map((p) => (
                        <Link
                            key={p.id}
                            to={`/personagem/${p.id}`}
                            className="bg-black/60 border-2 border-gold/50 p-6 rounded-xl hover:scale-105 transition"
                        >
                            <h2 className="text-2xl text-gold font-bold">
                                {p.nome}
                            </h2>
                            <p>
                                {p.dados?.race} - {p.dados?.class}
                            </p>
                            <p>Nível {p.dados?.level}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VisualizarPersonagensPage;
