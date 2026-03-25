import React from "react";
import { useAudio } from "../context/AudioContext.jsx";
import { useResolution } from "../context/ResolutionContext.jsx";

const ModalConfig = ({ isOpen, onClose }) => {
    const { isPlaying, volume, setVolume, toggleAudio } = useAudio();
    const { resolution, changeResolution } = useResolution();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
            <div className="w-full max-w-5xl bg-[#0b0b0b] border-2 border-yellow-700/40 rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.1)] p-8 flex flex-col gap-8">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-yellow-700/30 pb-4">
                    <h2 className="text-3xl font-semibold text-yellow-500 tracking-wide">
                        Configurações
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-yellow-500 transition text-xl cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Áudio */}
                    <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="text-lg text-yellow-500 font-medium">
                            Áudio
                        </h3>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={isPlaying}
                                onChange={toggleAudio}
                                className="w-5 h-5 accent-yellow-500 cursor-pointer"
                            />
                            <span className="text-gray-300">
                                {isPlaying
                                    ? "Música ativada"
                                    : "Música desativada"}
                            </span>
                        </label>

                        <div>
                            <label className="text-sm text-gray-400">
                                Volume: {volume}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) =>
                                    setVolume(Number(e.target.value))
                                }
                                className="w-full cursor-pointer mt-2 accent-yellow-500"
                            />
                        </div>
                    </div>

                    {/* Resolução */}
                    <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="text-lg text-yellow-500 font-medium">
                            Resolução
                        </h3>

                        <select
                            value={resolution}
                            onChange={(e) => changeResolution(e.target.value)}
                            className="w-full p-3 bg-[#0b0b0b] border border-yellow-700/40 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500 transition cursor-pointer"
                        >
                            <option>720p (Rápido)</option>
                            <option>1080p (Padrão)</option>
                            <option>1440p (Alta)</option>
                            <option>4K (Máxima)</option>
                            <option>Tela Cheia</option>
                        </select>
                    </div>
                </div>

                {/* Hotkeys */}
                <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-6">
                    <h3 className="text-lg text-yellow-500 font-medium">
                        Comandos Rápidos
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            { key: "F1", label: "Ajuda" },
                            { key: "Esc", label: "Menu" },
                            { key: "Space", label: "D20" },
                            { key: "Ctrl+M", label: "Mapa" },
                            { key: "Ctrl+C", label: "Chat" },
                            { key: "Ctrl+I", label: "Iniciativa" },
                        ].map((item) => (
                            <div
                                key={item.key}
                                className="bg-[#0b0b0b] border border-yellow-700/20 rounded-lg p-4 text-center"
                            >
                                <div className="text-gray-300 text-sm">
                                    {item.key}
                                </div>
                                <div className="text-yellow-500 text-xs mt-1">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-yellow-700/30 pt-4">
                    <button
                        onClick={onClose}
                        className="w-full bg-yellow-600 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition cursor-pointer"
                    >
                        Salvar e Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfig;
