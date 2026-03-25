import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({ nickname: "", foto: "" });
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        setProfile(data || { nickname: "", foto: "" });
    };

    const fetchCampanhas = async (userId) => {
        const { data } = await supabase
            .from("campanhas")
            .select("*")
            .eq("user_id", userId);
        setCampanhas(data || []);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
                fetchCampanhas(session.user.id);
            }
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
                await fetchCampanhas(session.user.id);
            } else {
                setProfile({ nickname: "", foto: "" });
                setCampanhas([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, nickname) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { nickname } },
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signOut = async () => supabase.auth.signOut();

    const updateProfile = async (nickname, fotoBase64) => {
        if (!user) return { error: "Usuário não logado" };
        const { error } = await supabase
            .from("profiles")
            .update({ nickname, foto: fotoBase64 })
            .eq("id", user.id);
        if (!error) setProfile({ nickname, foto: fotoBase64 });
        return { error };
    };

    const criarCampanha = async (nome, salaId, senha = "") => {
        if (!user) return { error: "Faça login" };
        const senhaHash = senha ? btoa(senha) : null;
        const { data, error } = await supabase
            .from("campanhas")
            .insert({
                user_id: user.id,
                nome,
                sala_id: salaId,
                senha_hash: senhaHash,
                privada: !!senha,
            })
            .select()
            .single();
        if (!error) setCampanhas([data, ...campanhas]);
        return { data, error };
    };

    // Na função updateCampanha, adicione console.log para debug:
    const updateCampanha = async (id, nome, senha) => {
        if (!user) return { error: "Faça login" };

        const senhaHash = senha ? btoa(senha) : null;
        const { data, error } = await supabase
            .from("campanhas")
            .update({ nome, senha_hash: senhaHash, ultimo_update: new Date() })
            .eq("id", id)
            .eq("user_id", user.id); // Adicione esta linha para garantir que é o dono

        if (error) {
            console.error("Erro ao atualizar:", error);
            return { error };
        }

        // Atualiza o estado local
        setCampanhas(
            campanhas.map((c) =>
                c.id === id ? { ...c, nome, senha_hash: senhaHash } : c,
            ),
        );

        return { error: null };
    };

    // Na função deleteCampanha, adicione a mesma verificação:
    const deleteCampanha = async (id) => {
        if (!user) return { error: "Faça login" };

        // Busca o sala_id da campanha que será deletada
        const campanhaADeletar = campanhas.find((c) => c.id === id);
        if (!campanhaADeletar) return { error: "Campanha não encontrada" };

        // Deleta a campanha
        const { error: errorCampanha } = await supabase
            .from("campanhas")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (errorCampanha) {
            console.error("Erro ao deletar campanha:", errorCampanha);
            return { error: errorCampanha };
        }

        // Remove a sala das salas_visitadas de TODOS os jogadores
        await supabase
            .from("salas_visitadas")
            .delete()
            .eq("sala_id", campanhaADeletar.sala_id);

        // Atualiza estado local
        setCampanhas(campanhas.filter((c) => c.id !== id));

        return { error: null };
    };

    const addSalaVisitada = async (salaId, nomeSala) => {
        if (!user) return { error: "Faça login" };

        // Verifica se já existe
        const { data: existing } = await supabase
            .from("salas_visitadas")
            .select("id")
            .eq("user_id", user.id)
            .eq("sala_id", salaId);

        if (existing && existing.length > 0) {
            // Atualiza a data se já existe
            await supabase
                .from("salas_visitadas")
                .update({ data_visitada: new Date() })
                .eq("id", existing[0].id);
        } else {
            // Insere novo registro
            await supabase.from("salas_visitadas").insert({
                user_id: user.id,
                sala_id: salaId,
                nome_sala: nomeSala,
            });
        }
    };

    const getSalasVisitadas = async () => {
        if (!user) return { data: [], error: "Faça login" };

        const { data, error } = await supabase
            .from("salas_visitadas")
            .select("*")
            .eq("user_id", user.id)
            .order("data_visitada", { ascending: false })
            .limit(5);

        return { data: data || [], error };
    };

    const value = {
        user,
        profile,
        campanhas,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        criarCampanha,
        updateCampanha,
        deleteCampanha,
        fetchCampanhas,
        addSalaVisitada,
        getSalasVisitadas,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
