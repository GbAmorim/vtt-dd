import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabase";

const JogadorPage = () => {
    const { campanhas, addSalaVisitada, getSalasVisitadas } = useAuth();
    const [salasVisitadas, setSalasVisitadas] = useState([]);
    const [showEntrarSala, setShowEntrarSala] = useState(false);
    const [codigoSala, setCodigoSala] = useState("");
    const [nomeSala, setNomeSala] = useState("");
    const [senhaSala, setSenhaSala] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        carregarSalasVisitadas();
    }, []);

    const carregarSalasVisitadas = async () => {
        const { data } = await getSalasVisitadas();
        setSalasVisitadas(data);
    };

    const handleEntrarSala = async () => {
        setError("");

        if (!codigoSala.trim()) {
            setError("Preencha o código da sala.");
            return;
        }

        const { data: salaExiste, error } = await supabase
            .from("campanhas")
            .select("*")
            .eq("sala_id", codigoSala)
            .single();

        if (error || !salaExiste) {
            setError("Sala não encontrada.");
            return;
        }

        if (salaExiste.privada && salaExiste.senha_hash) {
            if (btoa(senhaSala) !== salaExiste.senha_hash) {
                setError("Senha incorreta.");
                return;
            }
        }

        await addSalaVisitada(codigoSala, nomeSala || salaExiste.nome);

        navigate(`/sala/${codigoSala}`);
    };

    const handleEntrarSalaVisitada = async (salaId, nomeSalaVisitada) => {
        // Verifica se a sala ainda existe e se precisa de senha
        const salaAtual = campanhas.find((c) => c.sala_id === salaId);

        if (salaAtual && salaAtual.privada && salaAtual.senha_hash) {
            // Precisa de senha
            const senha = prompt("Digite a senha da sala:");
            if (!senha) return;

            if (btoa(senha) !== salaAtual.senha_hash) {
                alert("Senha incorreta.");
                return;
            }
        }

        await addSalaVisitada(salaId, nomeSalaVisitada);
        navigate(`/sala/${salaId}`);
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
                    to="/"
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    ←
                </Link>
            </div>

            <h1 className="text-7xl font-black text-gold drop-shadow-2xl">
                PAINEL DO JOGADOR
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Link
                    to="/personagens"
                    className="bg-blue-900/70 hover:bg-blue-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer"
                >
                    Meus Personagens
                </Link>

                <button
                    onClick={() => setShowEntrarSala(!showEntrarSala)}
                    className="bg-blue-900/70 hover:bg-blue-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer"
                >
                    {showEntrarSala ? "Fechar" : "Entrar em Sala"}
                </button>
            </div>

            {showEntrarSala && (
                <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md p-8 rounded-2xl border-4 border-gold/50 space-y-6 flex flex-col gap-3">
                    <h3 className="text-2xl font-bold text-gold">
                        Entrar em Sala
                    </h3>

                    {/* Salas Visitadas */}
                    {salasVisitadas.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-lg text-yellow-500 font-semibold">
                                Últimas Salas Conectadas
                            </h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {salasVisitadas.map((sala) => (
                                    <div
                                        key={sala.id}
                                        className="bg-black/50 p-4 rounded-xl flex justify-between items-center hover:bg-black/70 transition"
                                    >
                                        <div>
                                            <span className="font-bold text-gold">
                                                {sala.nome_sala}
                                            </span>
                                            <span className="text-silver ml-4 text-sm">
                                                ({sala.sala_id})
                                            </span>
                                            <span className="text-gray-400 ml-4 text-xs">
                                                {new Date(
                                                    sala.data_visitada,
                                                ).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleEntrarSalaVisitada(
                                                    sala.sala_id,
                                                    sala.nome_sala,
                                                )
                                            }
                                            className="bg-gold text-black px-6 py-2 rounded-lg font-bold bg-yellow-400 hover:bg-yellow-600 transition cursor-pointer"
                                        >
                                            Conectar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <hr className="border-gold/30" />

                    {/* Entrar em Nova Sala */}
                    <div className="space-y-4 flex flex-col gap-3">
                        <h4 className="text-lg text-yellow-500 font-semibold">
                            Conectar a Nova Sala
                        </h4>

                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                                Nome da Sala
                            </label>
                            <input
                                value={nomeSala}
                                onChange={(e) => setNomeSala(e.target.value)}
                                className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-xl text-white focus:border-gold focus:outline-none"
                                placeholder="Nome da sala (opcional)"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                                Código da Sala
                            </label>
                            <input
                                value={codigoSala}
                                onChange={(e) => setCodigoSala(e.target.value)}
                                className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-xl text-white focus:border-gold focus:outline-none"
                                placeholder="Digite o código UUID da sala"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                                Senha (se necessário)
                            </label>
                            <input
                                type="password"
                                value={senhaSala}
                                onChange={(e) => setSenhaSala(e.target.value)}
                                className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-xl text-white focus:border-gold focus:outline-none"
                                placeholder="Digite a senha se a sala for privada"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleEntrarSala}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition cursor-pointer"
                        >
                            Conectar à Sala
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JogadorPage;
