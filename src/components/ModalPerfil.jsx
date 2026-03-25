import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const ModalPerfil = ({ isOpen, onClose, profile, updateProfile }) => {
    const [nickname, setNickname] = useState("");
    const [fotoPreview, setFotoPreview] = useState("");
    const [fotoFile, setFotoFile] = useState(null);
    const { signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (profile) {
            setNickname(profile.nickname || "");
            setFotoPreview(profile.foto || "");
        }
    }, [profile]);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result);
                setFotoFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const salvar = async () => {
        await updateProfile(nickname, fotoPreview);
        onClose();
    };

    const handleLogout = async () => {
        if (confirm("Deseja sair da conta?")) {
            await signOut();
            navigate("/login");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 ">
            <div className="w-full max-w-5xl bg-[#0b0b0b] border-2 border-yellow-700/40 rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.1)] p-8 flex flex-col gap-8">
                <div className="flex justify-between items-center border-b border-yellow-700/30 pb-4">
                    <h2 className="text-3xl font-semibold text-yellow-500 tracking-wide">
                        Perfil
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-yellow-500 transition text-xl cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="text-lg text-yellow-500 font-medium">
                            Nickname
                        </h3>
                        <input
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full p-4 bg-[#0b0b0b] border border-yellow-700/40 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500 transition cursor-pointer text-xl"
                            placeholder="Seu nickname"
                            maxLength={20}
                        />
                    </div>

                    <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="text-lg text-yellow-500 font-medium">
                            Foto de Perfil
                        </h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            className="w-full p-3 bg-[#0b0b0b] border border-yellow-700/40 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500 transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-black hover:file:bg-yellow-500"
                        />
                        {fotoPreview && (
                            <div className="flex justify-center">
                                <img
                                    src={fotoPreview}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-700/50 shadow-xl"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-yellow-700/30 pt-4 space-y-2 flex flex-col gap-3">
                    <button
                        onClick={salvar}
                        className="w-full bg-yellow-600 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition cursor-pointer"
                        disabled={!nickname.trim()}
                    >
                        Salvar Alterações
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-500 transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalPerfil;
