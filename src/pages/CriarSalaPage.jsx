import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { v4 as uuidv4 } from "uuid";

const CriarSalaPage = () => {
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { criarCampanha } = useAuth();
    const navigate = useNavigate();

    const handleCriarSala = async () => {
        if (!nome.trim()) {
            alert("Digite o nome da sala");
            return;
        }

        const sala_id = Math.random().toString(36).substring(2, 8);

        const res = await criarCampanha({
            nome,
            sala_id,
            senha,
        });

        if (res.error) {
            alert("Erro ao criar sala");
        } else {
            navigate(`/sala/${sala_id}`);
        }
    };

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
                    to="/mestre"
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    ←
                </Link>
            </div>

            <h1 className="text-7xl font-black text-gold drop-shadow-2xl">
                CRIAR SALA
            </h1>

            <div className="bg-black/60 backdrop-blur-md p-12 rounded-2xl border-4 border-gold/50 w-full max-w-md space-y-6 flex flex-col gap-5">
                <div className="space-y-2">
                    <label className="text-silver text-lg">
                        Nome da Campanha
                    </label>
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full p-4 bg-black/50 border-2 border-gold/50 rounded-xl text-white focus:border-gold focus:outline-none"
                        placeholder="Ex: A Queda de Neverwinter"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-silver text-lg">
                        Senha (Opcional)
                    </label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full p-4 bg-black/50 border-2 border-gold/50 rounded-xl text-white focus:border-gold focus:outline-none"
                        placeholder="Deixe em branco para público"
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                    onClick={handleCriarSala}
                    disabled={loading || !nome.trim()}
                    className="w-full bg-gold text-black py-4 rounded-xl font-bold  hover:scale-110 transition-all duration-500 bg-yellow-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Criando..." : "Criar Sala"}
                </button>
            </div>
        </div>
    );
};

export default CriarSalaPage;
