import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signUp, signIn } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async () => {
        setError("");
        setLoading(true);
        const res = isSignUp
            ? await signUp(email, password, nickname)
            : await signIn(email, password);
        setLoading(false);
        if (res.error) setError(res.error.message);
        else navigate("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-6">
            <div className="w-full max-w-md bg-[#0b0b0b] border-2 border-yellow-700/40 rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.1)] p-8 flex flex-col gap-8">
                <h2 className="text-3xl font-semibold text-yellow-500 tracking-wide text-center">
                    {isSignUp ? "Criar Conta" : "Login"}
                </h2>
                {isSignUp && (
                    <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-4">
                        <label className="text-sm text-gray-400">
                            Nickname
                        </label>
                        <input
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full p-3 bg-[#0b0b0b] border border-yellow-700/40 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500 transition cursor-pointer"
                            placeholder="Seu nickname"
                        />
                    </div>
                )}
                <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-4">
                    <label className="text-sm text-gray-400">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-[#0b0b0b] border border-yellow-700/40 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500 transition cursor-pointer"
                        placeholder="seu@email.com"
                    />
                </div>
                <div className="bg-[#111] border border-yellow-700/30 rounded-xl p-6 flex flex-col gap-4">
                    <label className="text-sm text-gray-400">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-[#0b0b0b] border border-yellow-700/40 rounded-lg text-gray-300 focus:outline-none focus:border-yellow-500 transition cursor-pointer"
                        placeholder="Senha segura"
                    />
                </div>
                {error && (
                    <div className="bg-red-900/50 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                        {error}
                    </div>
                )}
                <button
                    onClick={handleAuth}
                    disabled={loading || !email || !password}
                    className="w-full bg-yellow-600 text-black py-4 rounded-xl font-semibold hover:bg-yellow-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                    {loading
                        ? "Carregando..."
                        : isSignUp
                          ? "Criar Conta"
                          : "Entrar"}
                </button>
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-yellow-500 py-3 underline hover:text-yellow-400 transition cursor-pointer"
                >
                    {isSignUp ? "Já tenho conta" : "Criar nova conta"}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
