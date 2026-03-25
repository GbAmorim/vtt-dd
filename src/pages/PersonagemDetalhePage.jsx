import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabase";

const PersonagemDetalhePage = () => {
    const { id } = useParams();
    const { personagens, fetchPersonagens, user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState("basic");

    const personagem = personagens.find((p) => p.id === id);

    if (!personagem) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gold text-2xl">
                Carregando ou não encontrado...
            </div>
        );
    }

    const dados = personagem.dados || {};

    const calculateModifier = (score) => Math.floor((score - 10) / 2);

    const deletar = async () => {
        const confirmar = window.confirm("Excluir personagem?");
        if (!confirmar) return;

        await supabase.from("personagens").delete().eq("id", id);
        await fetchPersonagens(user.id);
        navigate("/personagens");
    };

    const tabs = [
        { id: "basic", label: "Básico" },
        { id: "attributes", label: "Atributos" },
        { id: "savingThrows", label: "Salvações" },
        { id: "skills", label: "Perícias" },
        { id: "combat", label: "Combate" },
        { id: "personality", label: "Personalidade" },
        { id: "equipment", label: "Equipamento" },
        { id: "features", label: "Features" },
    ];

    return (
        <div
            className="flex flex-col gap-6 items-center justify-center min-h-screen bg-black p-6 md:p-12 space-y-8 relative overflow-hidden"
            style={{
                background: `
                    linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
                    url('/fundo.jfif')
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Botão Voltar fixo */}
            <div className="fixed top-6 left-6 z-50">
                <Link
                    to="/personagens"
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl"
                >
                    ←
                </Link>
            </div>

            <h1 className="text-5xl font-black text-gold drop-shadow-2xl text-center mt-6 mb-6">
                {dados.name}
            </h1>

            {/* AÇÕES - Botões sólidos */}
            <div className="flex gap-4 mb-6 w-full max-w-md justify-center">
                <Link
                    to={`/editar-personagem/${id}`}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 text-xl flex-1 text-center border-2 border-blue-400"
                >
                    Editar
                </Link>
                <button
                    onClick={deletar}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 text-xl flex-1 text-center border-2 border-red-400 cursor-pointer"
                >
                    Excluir
                </button>
            </div>

            {/* TABS */}
            <div className="bg-black/60 backdrop-blur-md rounded-t-2xl border-4 border-gold/50 border-b-0 overflow-x-auto w-full max-w-5xl">
                <div className="flex flex-wrap md:flex-nowrap">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 px-4 py-3 md:px-6 font-bold transition-all whitespace-nowrap text-sm md:text-base ${
                                tab === t.id
                                    ? "bg-gold text-white border-b-4 border-gold shadow-md"
                                    : "bg-black/30 text-gold hover:bg-black/50 cursor-pointer"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conteúdo das tabs */}
            <div className="bg-black/60 backdrop-blur-md p-6 md:p-8 rounded-b-2xl border-4 border-t-0 border-gold/50 w-full max-w-5xl max-h-96 overflow-y-auto space-y-4">
                {/* BASIC */}
                {tab === "basic" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-silver">
                        <p>
                            <span className="text-gold font-bold">Classe:</span>{" "}
                            {dados.class}
                        </p>
                        <p>
                            <span className="text-gold font-bold">Raça:</span>{" "}
                            {dados.race}
                        </p>
                        <p>
                            <span className="text-gold font-bold">Nível:</span>{" "}
                            {dados.level}
                        </p>
                        <p>
                            <span className="text-gold font-bold">
                                Background:
                            </span>{" "}
                            {dados.background}
                        </p>
                        <p>
                            <span className="text-gold font-bold">
                                Alinhamento:
                            </span>{" "}
                            {dados.alignment}
                        </p>
                        <p>
                            <span className="text-gold font-bold">
                                Proficiência:
                            </span>{" "}
                            +{dados.proficiencyBonus || 2}
                        </p>
                    </div>
                )}

                {/* ATRIBUTOS */}
                {tab === "attributes" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(dados.attributes || {}).map(
                            ([k, v]) => (
                                <div
                                    key={k}
                                    className="bg-black/50 p-4 rounded-lg border border-gold/30 text-center"
                                >
                                    <span className="text-gold font-bold block capitalize">
                                        {k}:
                                    </span>
                                    <span className="text-2xl font-black text-silver">
                                        {v}
                                    </span>
                                    <span className="text-yellow-400 text-sm block">
                                        ({calculateModifier(v) >= 0 ? "+" : ""}
                                        {calculateModifier(v)})
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                )}

                {/* SALVAÇÕES */}
                {tab === "savingThrows" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(dados.savingThrows || {}).map(
                            ([k, v]) => (
                                <div
                                    key={k}
                                    className="bg-black/50 p-4 rounded-lg border border-gold/30 text-center"
                                >
                                    <span className="text-gold font-bold capitalize block">
                                        {k}:
                                    </span>
                                    <span className="text-xl text-silver">
                                        {v >= 0 ? "+" : ""}
                                        {v}
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                )}

                {/* PERÍCIAS */}
                {tab === "skills" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-silver">
                            {Object.entries(dados.skills || {}).map(
                                ([k, v]) => (
                                    <p
                                        key={k}
                                        className="capitalize p-2 bg-black/30 rounded border-l-4 border-gold/50"
                                    >
                                        <span className="font-bold">{k}:</span>{" "}
                                        +{v}
                                    </p>
                                ),
                            )}
                        </div>
                        <div className="col-span-2 mt-4 p-4 bg-gold/20 rounded-lg border border-gold/50 text-silver">
                            <span className="text-gold font-bold">
                                Percepção Passiva:
                            </span>{" "}
                            {dados.passivePerception || 10}
                        </div>
                    </div>
                )}

                {/* COMBATE */}
                {tab === "combat" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-silver">
                        <p>
                            <span className="text-gold font-bold">CA:</span>{" "}
                            {dados.ac}
                        </p>
                        <p>
                            <span className="text-gold font-bold">HP:</span>{" "}
                            {dados.currentHp}/{dados.maxHp}
                        </p>
                        <p>
                            <span className="text-gold font-bold">
                                Iniciativa:
                            </span>{" "}
                            {dados.initiative}
                        </p>
                        <p>
                            <span className="text-gold font-bold">
                                Velocidade:
                            </span>{" "}
                            {dados.speed} pés
                        </p>
                        <p>
                            <span className="text-gold font-bold">
                                HP Temp:
                            </span>{" "}
                            {dados.tempHp || 0}
                        </p>
                        <p>
                            <span className="text-gold font-bold">
                                Dados de Vida:
                            </span>{" "}
                            {dados.hitDice || "1d8"}
                        </p>
                    </div>
                )}

                {/* PERSONALIDADE */}
                {tab === "personality" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(dados.personality || {}).map(
                            ([k, v]) => (
                                <div
                                    key={k}
                                    className="bg-black/50 p-4 rounded-lg border border-gold/30"
                                >
                                    <span className="text-gold font-bold capitalize block mb-2">
                                        {k}:
                                    </span>
                                    <p className="text-silver">{v || "—"}</p>
                                </div>
                            ),
                        )}
                    </div>
                )}

                {/* EQUIPAMENTO */}
                {tab === "equipment" && (
                    <div className="space-y-4 text-silver">
                        <p className="text-gold font-bold text-xl">
                            Moedas: {dados.currency || 0} ouro
                        </p>
                        <div className="bg-black/30 p-4 rounded-lg border border-gold/30">
                            <span className="text-gold font-bold block mb-2">
                                Equipamento:
                            </span>
                            <p>{dados.equipment || "—"}</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg border border-gold/30">
                            <span className="text-gold font-bold block mb-2">
                                Proficiências:
                            </span>
                            <p>{dados.proficiencies || "—"}</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg border border-gold/30">
                            <span className="text-gold font-bold block mb-2">
                                Idiomas:
                            </span>
                            <p>{dados.languages || "—"}</p>
                        </div>
                    </div>
                )}

                {/* FEATURES */}
                {tab === "features" && (
                    <div className="space-y-4">
                        <div className="bg-black/30 p-6 rounded-lg border border-gold/30">
                            <span className="text-gold font-bold text-xl block mb-4">
                                Features & Traços:
                            </span>
                            <p className="text-silver whitespace-pre-wrap">
                                {dados.featuresTraits || "—"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonagemDetalhePage;
