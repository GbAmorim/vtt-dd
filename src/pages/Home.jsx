import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // Para profile/updateProfile
import ModalConfig from "../components/ModalConfig.jsx";
import ModalPerfil from "../components/ModalPerfil.jsx"; // Crie este arquivo abaixo

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false); // Estado para ModalPerfil
    const { profile, updateProfile } = useAuth(); // Dados do perfil

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
            {/* Logo */}
            <img
                src="/d20.svg"
                alt="VTT D&D Logo"
                className="w-50 h-50 object-contain drop-shadow-2xl animate-pulse"
            />

            {/* Título */}
            <h1 className="text-5xl md:text-7xl font-black tracking-widest text-gold drop-shadow-2xl">
                VTT D&D
            </h1>

            {/* Botões */}
            <div className="flex flex-col md:flex-row gap-12">
                {/* Mestre */}
                <Link
                    to="/mestre"
                    className="bg-red-900/70 hover:bg-red-800 text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer"
                >
                    Sou Mestre
                </Link>

                {/* Jogador */}
                <Link
                    to="/jogador"
                    className="bg-blue-900/70 hover:bg-blue-800  text-silver font-bold w-70 h-25 rounded-2xl border-4 border-silver/50 shadow-2xl hover:scale-110 transition-all duration-500 text-2xl md:text-3xl flex items-center justify-center text-center cursor-pointer"
                >
                    Sou Jogador
                </Link>
            </div>

            {/* Engrenagem */}
            <div className="fixed top-6 right-6 z-50 flex gap-6">
                <button
                    onClick={() => setShowProfile(true)}
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    👤
                </button>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:rotate-180 transition-all duration-500 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    ⚙️
                </button>
            </div>

            {/* Modais continuam fora */}
            <ModalConfig
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            <ModalPerfil
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                profile={profile || { nickname: "", foto: "" }}
                updateProfile={updateProfile}
            />
        </div>
    );
};

export default Home;
