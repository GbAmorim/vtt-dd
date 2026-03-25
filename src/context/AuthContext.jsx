import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({ nickname: "", foto: "" });
    const [campanhas, setCampanhas] = useState([]);
    const [personagens, setPersonagens] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= FETCH =================
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

    const fetchPersonagens = async (userId) => {
        const { data } = await supabase
            .from("personagens")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        setPersonagens(data || []);
    };

    // ================= AUTH =================
    useEffect(() => {
        const initAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
                await fetchCampanhas(session.user.id);
                await fetchPersonagens(session.user.id);
            }

            setLoading(false);
        };

        initAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_, session) => {
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
                await fetchCampanhas(session.user.id);
                await fetchPersonagens(session.user.id);
            } else {
                setProfile({ nickname: "", foto: "" });
                setCampanhas([]);
                setPersonagens([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // ================= AUTH ACTIONS =================
    const signUp = (email, password, nickname) =>
        supabase.auth.signUp({
            email,
            password,
            options: { data: { nickname } },
        });

    const signIn = (email, password) =>
        supabase.auth.signInWithPassword({ email, password });

    const signOut = () => supabase.auth.signOut();

    // ================= PERSONAGENS =================
    const criarPersonagem = async (characterData) => {
        const { data, error } = await supabase
            .from("personagens")
            .insert({
                user_id: user.id,
                nome: characterData.name,
                dados: characterData,
            })
            .select();

        if (!error) {
            setPersonagens((prev) => [data[0], ...prev]);
        }

        return { data: data?.[0], error };
    };

    // ================= CAMPANHAS =================
    const criarCampanha = async (campanhaData) => {
        const { data, error } = await supabase
            .from("campanhas")
            .insert({
                user_id: user.id,
                nome: campanhaData.nome,
                sala_id: campanhaData.sala_id,
                senha_hash: campanhaData.senha
                    ? btoa(campanhaData.senha)
                    : null,
                privada: !!campanhaData.senha,
            })
            .select();

        if (!error && data) {
            setCampanhas((prev) => [data[0], ...prev]);
        }

        return { data: data?.[0], error };
    };

    const updatePersonagem = async (id, dados) => {
        const { error } = await supabase
            .from("personagens")
            .update({
                nome: dados.name,
                dados,
            })
            .eq("id", id);
        if (!error) await fetchPersonagens(user.id);
        return { error };
    };

    const updateCampanha = async (id, novoNome, novaSenha) => {
        const updateData = {
            nome: novoNome,
            senha_hash: novaSenha ? btoa(novaSenha) : null,
            privada: !!novaSenha,
        };

        const { data, error } = await supabase
            .from("campanhas")
            .update(updateData)
            .eq("id", id)
            .select();

        if (!error && data) {
            setCampanhas((prev) =>
                prev.map((c) => (c.id === id ? data[0] : c)),
            );
        }

        return { data, error };
    };

    const deleteCampanha = async (id) => {
        const { error } = await supabase
            .from("campanhas")
            .delete()
            .eq("id", id);

        if (!error) {
            setCampanhas((prev) => prev.filter((c) => c.id !== id));
        }

        return { error };
    };

    // ================= SALAS =================
    const addSalaVisitada = async (sala_id, nome) => {
        if (!user) return;

        await supabase
            .from("salas_visitadas")
            .delete()
            .eq("user_id", user.id)
            .eq("sala_id", sala_id);

        await supabase.from("salas_visitadas").insert({
            user_id: user.id,
            sala_id,
            nome_sala: nome,
        });
    };

    const getSalasVisitadas = async () => {
        const { data } = await supabase
            .from("salas_visitadas")
            .select("*")
            .eq("user_id", user.id)
            .order("data_visitada", { ascending: false })
            .limit(5);

        return { data: data || [] };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                campanhas,
                personagens,
                loading,
                signUp,
                signIn,
                signOut,
                fetchCampanhas,
                fetchPersonagens,
                criarPersonagem,
                criarCampanha,
                updateCampanha,
                deleteCampanha,
                addSalaVisitada,
                updatePersonagem,
                getSalasVisitadas,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
