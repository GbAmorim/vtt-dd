import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AudioProvider } from "./context/AudioContext.jsx";
import { ResolutionProvider } from "./context/ResolutionContext.jsx";

import Home from "./pages/Home.jsx";
import MestrePage from "./pages/MestrePage.jsx";
import JogadorPage from "./pages/JogadorPage.jsx";
import SalaPage from "./pages/SalaPage.jsx";
import CriarSalaPage from "./pages/CriarSalaPage.jsx";
import PersonagensPage from "./pages/PersonagensPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CriarPersonagemPage from "./pages/CriarPersonagemPage.jsx";
import PersonagemDetalhePage from "./pages/PersonagemDetalhePage.jsx";
import VisualizarPersonagensPage from "./pages/VisualizarPersonagens.jsx";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gold text-2xl">
                Carregando...
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/mestre"
                element={
                    <ProtectedRoute>
                        <MestrePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jogador"
                element={
                    <ProtectedRoute>
                        <JogadorPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/sala/:id"
                element={
                    <ProtectedRoute>
                        <SalaPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/criar-sala"
                element={
                    <ProtectedRoute>
                        <CriarSalaPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/personagens"
                element={
                    <ProtectedRoute>
                        <PersonagensPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/visualizar-personagens"
                element={
                    <ProtectedRoute>
                        <VisualizarPersonagensPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/criar-personagem"
                element={
                    <ProtectedRoute>
                        <CriarPersonagemPage />
                    </ProtectedRoute>
                }
            />

            {/* ✅ NOVO: edição */}
            <Route
                path="/editar-personagem/:id"
                element={
                    <ProtectedRoute>
                        <CriarPersonagemPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/personagem/:id"
                element={
                    <ProtectedRoute>
                        <PersonagemDetalhePage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    const [showBlackLogo, setShowBlackLogo] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowBlackLogo(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (showBlackLogo) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50 flex-col gap-3">
                <img src="/logowhite.svg" className="w-64 h-64 animate-pulse" />
                <p>Desenvolvido por Gabriel Amorim.</p>
            </div>
        );
    }

    return (
        <AudioProvider>
            <ResolutionProvider>
                <AuthProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </AuthProvider>
            </ResolutionProvider>
        </AudioProvider>
    );
}

export default App;
