import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const MestrePage = () => {
    const { campanhas, deleteCampanha, updateCampanha } = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState("");
    const [newSenha, setNewSenha] = useState("");
    const [showCampanhas, setShowCampanhas] = useState(false);

    const handleSaveEdit = async (id) => {
        if (!newName.trim()) {
            alert("Nome não pode estar vazio.");
            return;
        }
        const res = await updateCampanha(id, newName, newSenha);
        if (res.error) {
            alert(`Erro ao salvar: ${res.error.message}`);
        } else {
            setEditingId(null);
            setNewName("");
            setNewSenha("");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Excluir campanha? Esta ação não pode ser desfeita.")) {
            const res = await deleteCampanha(id);
            if (res.error) {
                alert(`Erro ao excluir: ${res.error.message}`);
            }
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
                    to="/"
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    ←
                </Link>
            </div>

            <h1 className="text-7xl font-black text-gold drop-shadow-2xl">
                PAINEL DO MESTRE
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Link
                    to="/criar-sala"
                    className="bg-red-900/70 hover:bg-red-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer"
                >
                    Criar Sala
                </Link>

                <button
                    onClick={() => setShowCampanhas(!showCampanhas)}
                    className="bg-red-900/70 hover:bg-red-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer"
                >
                    Minhas Campanhas
                </button>
            </div>

            {showCampanhas && (
                <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md p-8 rounded-2xl border-4 border-gold/50 space-y-4 max-h-96 overflow-y-auto ">
                    <h3 className="text-2xl font-bold text-gold">
                        Minhas Campanhas ({campanhas.length})
                    </h3>

                    {campanhas.length === 0 ? (
                        <p className="text-silver text-center">
                            Nenhuma campanha salva. Crie uma!
                        </p>
                    ) : (
                        campanhas.map((c) => (
                            <div
                                key={c.id}
                                className="bg-black/50 p-4 rounded-xl space-y-2 "
                            >
                                {editingId === c.id ? (
                                    <div className="space-y-2 flex flex-col gap-4">
                                        <input
                                            value={newName}
                                            onChange={(e) =>
                                                setNewName(e.target.value)
                                            }
                                            className="w-full p-2 bg-black/50 border-2 border-gold/50 rounded-lg text-white"
                                            placeholder="Nome da campanha"
                                        />
                                        <input
                                            type="password"
                                            value={newSenha}
                                            onChange={(e) =>
                                                setNewSenha(e.target.value)
                                            }
                                            className="w-full p-2 bg-black/50 border-2 border-gold/50 rounded-lg text-white"
                                            placeholder="Senha (deixe em branco para remover)"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleSaveEdit(c.id)
                                                }
                                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 cursor-pointer"
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 cursor-pointer"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center gap-3">
                                        <div>
                                            <span className="font-bold text-gold">
                                                {c.nome}
                                            </span>
                                            <span className="text-silver ml-4">
                                                ({c.sala_id})
                                            </span>
                                            {c.privada && (
                                                <span className="text-red-400 ml-4">
                                                    🔒 Privada
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/sala/${c.sala_id}`}
                                                className="bg-gold text-black px-4 py-2 rounded-lg font-bold bg-yellow-400 hover:bg-yellow-600 transition cursor-pointer"
                                            >
                                                Carregar
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setEditingId(c.id);
                                                    setNewName(c.nome);
                                                    setNewSenha("");
                                                }}
                                                className="bg-gold text-black px-4 py-2 rounded-lg font-bold bg-blue-600 hover:bg-blue-800 transition cursor-pointer"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(c.id)
                                                }
                                                className="bg-gold text-black px-4 py-2 rounded-lg font-bold bg-red-600 hover:bg-red-800 transition cursor-pointer"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MestrePage;
