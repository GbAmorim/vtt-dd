import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const CriarPersonagemPage = () => {
    const {
        user,
        personagens,
        criarPersonagem,
        updatePersonagem,
        fetchPersonagens,
    } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const { id } = useParams();
    const isEdit = !!id;

    const [character, setCharacter] = useState({
        userId: user?.id || "",
        name: "",
        class: "",
        race: "",
        background: "",
        alignment: "",
        level: 1,
        experience: 0,
        attributes: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        },
        savingThrows: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
        },
        skills: {
            acrobatics: 0,
            animalHandling: 0,
            arcana: 0,
            athletics: 0,
            deception: 0,
            history: 0,
            insight: 0,
            intimidation: 0,
            investigation: 0,
            medicine: 0,
            nature: 0,
            perception: 0,
            performance: 0,
            persuasion: 0,
            religion: 0,
            sleightOfHand: 0,
            stealth: 0,
            survival: 0,
        },
        proficiencyBonus: 2,
        ac: 10,
        initiative: 0,
        speed: 30,
        maxHp: 10,
        currentHp: 10,
        tempHp: 0,
        hitDice: "1d8",
        passivePerception: 10,
        personality: {
            traits: "",
            ideals: "",
            bonds: "",
            flaws: "",
        },
        attacks: [],
        equipment: "",
        proficiencies: "",
        languages: "",
        featuresTraits: "",
        currency: 0,
    });

    useEffect(() => {
        if (isEdit && user && personagens.length > 0) {
            const personagemExistente = personagens.find((p) => p.id === id);
            if (personagemExistente) {
                setCharacter(personagemExistente.dados || personagemExistente);
            }
        }
    }, [id, user, personagens]);

    const calculateModifier = (score) => Math.floor((score - 10) / 2);

    const handleAttributeChange = (attr, value) => {
        const newValue = parseInt(value) || 10;
        setCharacter((prev) => ({
            ...prev,
            attributes: { ...prev.attributes, [attr]: newValue },
        }));
    };

    const handleChange = (field, value) => {
        setCharacter((prev) => ({ ...prev, [field]: value }));
    };

    const handlePersonalityChange = (field, value) => {
        setCharacter((prev) => ({
            ...prev,
            personality: { ...prev.personality, [field]: value },
        }));
    };

    const handleSkillChange = (skill, value) => {
        setCharacter((prev) => ({
            ...prev,
            skills: { ...prev.skills, [skill]: parseInt(value) || 0 },
        }));
    };

    const handleSavingThrowChange = (attr, value) => {
        setCharacter((prev) => ({
            ...prev,
            savingThrows: {
                ...prev.savingThrows,
                [attr]: parseInt(value) || 0,
            },
        }));
    };

    const validateCharacter = () => {
        if (!character.name?.trim()) {
            alert("Nome do personagem é obrigatório.");
            return false;
        }
        if (!character.class?.trim()) {
            alert("Classe é obrigatória.");
            return false;
        }
        if (!character.race?.trim()) {
            alert("Raça é obrigatória.");
            return false;
        }
        return true;
    };

    const saveCharacter = async () => {
        if (!validateCharacter()) return;
        setLoading(true);
        try {
            let res;
            if (isEdit) {
                // ALTERE
                res = await updatePersonagem(id, character);
            } else {
                res = await criarPersonagem({ ...character, userId: user.id }); // ajuste se necessário
            }
            if (res.error) {
                alert("Erro ao salvar: " + res.error.message);
            } else {
                alert(isEdit ? "✅ Atualizado!" : "✅ Criado!");
                await fetchPersonagens(user.id);
                navigate("/personagens");
            }
        } catch (error) {
            alert("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const tabButtons = [
        { id: "basic", label: "Básico" },
        { id: "attributes", label: "Atributos" },
        { id: "skills", label: "Perícias" },
        { id: "combat", label: "Combate" },
        { id: "equipment", label: "Equipamento" },
        { id: "personality", label: "Personalidade" },
        { id: "features", label: "Features" },
    ];

    return (
        <div
            className="flex flex-col gap-6 items-center justify-center min-h-screen bg-black relative overflow-hidden p-6 md:p-12"
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
            {/* Botão Voltar */}
            <div className="fixed top-6 left-6 z-50">
                <Link
                    to="/personagens"
                    className="w-20 h-20 bg-black/60 hover:bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300 text-gold drop-shadow-xl border-2 border-gold/50 shadow-2xl cursor-pointer"
                >
                    ←
                </Link>
            </div>

            {/* Container Principal */}
            <div className="w-full max-w-5xl flex flex-col gap-5">
                {/* Título */}
                <h1 className="text-5xl md:text-7xl font-black text-gold drop-shadow-2xl text-center mb-8">
                    CRIAR PERSONAGEM
                </h1>

                {/* Abas */}
                <div className="bg-black/60 backdrop-blur-md rounded-t-2xl border-4 border-gold/50 border-b-0 overflow-x-auto ">
                    <div className="flex flex-wrap md:flex-nowrap  ">
                        {tabButtons.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-3 md:px-4 py-3 text-sm md:text-base font-bold transition-all duration-300 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "bg-gold text-white border-b-4 border-gold "
                                        : "cursor-pointer bg-black/30 text-gold hover:bg-black/50"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conteúdo das Abas */}
                <div className="bg-black/60 backdrop-blur-md p-6 md:p-8 rounded-b-2xl border-4 border-t-0 border-gold/50 space-y-6 max-h-96 overflow-y-auto">
                    {/* TAB: BÁSICO */}
                    {activeTab === "basic" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gold border-b-2 border-gold/50 pb-2">
                                Informações Básicas
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Nome do Personagem
                                    </label>
                                    <input
                                        type="text"
                                        value={character.name}
                                        onChange={(e) =>
                                            handleChange("name", e.target.value)
                                        }
                                        placeholder="Ex: Aragorn"
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Classe
                                    </label>
                                    <input
                                        type="text"
                                        value={character.class}
                                        onChange={(e) =>
                                            handleChange(
                                                "class",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ex: Guerreiro"
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Raça
                                    </label>
                                    <input
                                        type="text"
                                        value={character.race}
                                        onChange={(e) =>
                                            handleChange("race", e.target.value)
                                        }
                                        placeholder="Ex: Humano"
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Background
                                    </label>
                                    <input
                                        type="text"
                                        value={character.background}
                                        onChange={(e) =>
                                            handleChange(
                                                "background",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ex: Nobre"
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Alinhamento
                                    </label>
                                    <input
                                        type="text"
                                        value={character.alignment}
                                        onChange={(e) =>
                                            handleChange(
                                                "alignment",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ex: Leal e Neutro"
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Nível
                                    </label>
                                    <input
                                        type="number"
                                        value={character.level}
                                        onChange={(e) =>
                                            handleChange(
                                                "level",
                                                parseInt(e.target.value) || 1,
                                            )
                                        }
                                        min="1"
                                        max="20"
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: ATRIBUTOS */}
                    {activeTab === "attributes" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gold border-b-2 border-gold/50 pb-2">
                                Atributos Principais
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(character.attributes).map(
                                    ([attr, score]) => {
                                        const mod = calculateModifier(score);
                                        const attrName =
                                            attr.charAt(0).toUpperCase() +
                                            attr.slice(1);
                                        return (
                                            <div
                                                key={attr}
                                                className="bg-black/50 border-2 border-gold/30 rounded-lg p-4 space-y-2"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <label className="text-gold font-bold">
                                                        {attrName}
                                                    </label>
                                                    <span className="text-yellow-400 text-sm">
                                                        Modificador:{" "}
                                                        {mod > 0 ? "+" : ""}
                                                        {mod}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        value={score}
                                                        onChange={(e) =>
                                                            handleAttributeChange(
                                                                attr,
                                                                e.target.value,
                                                            )
                                                        }
                                                        min="1"
                                                        max="20"
                                                        className="flex-1 p-2 bg-black/50 border-2 border-gold/50 rounded text-white text-center focus:border-gold focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>

                            {/* Bônus de Proficiência */}
                            <div className="mt-4 bg-gold/20 border-2 border-gold/50 rounded-lg p-4">
                                <label className="text-gold font-bold block mb-2">
                                    Bônus de Proficiência
                                </label>
                                <input
                                    type="number"
                                    value={character.proficiencyBonus}
                                    onChange={(e) =>
                                        handleChange(
                                            "proficiencyBonus",
                                            parseInt(e.target.value) || 2,
                                        )
                                    }
                                    min="1"
                                    max="6"
                                    className="w-full p-2 bg-black/50 border-2 border-gold/50 rounded text-white focus:border-gold focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB: PERÍCIAS */}
                    {activeTab === "skills" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gold border-b-2 border-gold/50 pb-2">
                                Perícias & Testes de Salvação
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.keys(character.skills).map((skill) => (
                                    <div
                                        key={skill}
                                        className="bg-black/50 border-2 border-gold/30 rounded-lg p-2 flex items-center gap-2"
                                    >
                                        <label className="text-silver text-sm capitalize flex-1">
                                            {skill.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        <input
                                            type="number"
                                            value={character.skills[skill]}
                                            onChange={(e) =>
                                                handleSkillChange(
                                                    skill,
                                                    e.target.value,
                                                )
                                            }
                                            className="w-16 p-2 bg-black/50 border-2 border-gold/50 rounded text-white text-center focus:border-gold focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Percepção Passiva */}
                            <div className="mt-4 bg-gold/20 border-2 border-gold/50 rounded-lg p-4">
                                <label className="text-gold font-bold block mb-2">
                                    Percepção Passiva (Sabedoria)
                                </label>
                                <input
                                    type="number"
                                    value={character.passivePerception}
                                    onChange={(e) =>
                                        handleChange(
                                            "passivePerception",
                                            parseInt(e.target.value) || 10,
                                        )
                                    }
                                    className="w-full p-2 bg-black/50 border-2 border-gold/50 rounded text-white focus:border-gold focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB: COMBATE */}
                    {activeTab === "combat" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gold border-b-2 border-gold/50 pb-2">
                                Combate
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Classe de Armadura (CA)
                                    </label>
                                    <input
                                        type="number"
                                        value={character.ac}
                                        onChange={(e) =>
                                            handleChange(
                                                "ac",
                                                parseInt(e.target.value) || 10,
                                            )
                                        }
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Iniciativa
                                    </label>
                                    <input
                                        type="number"
                                        value={character.initiative}
                                        onChange={(e) =>
                                            handleChange(
                                                "initiative",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Velocidade (pés)
                                    </label>
                                    <input
                                        type="number"
                                        value={character.speed}
                                        onChange={(e) =>
                                            handleChange(
                                                "speed",
                                                parseInt(e.target.value) || 30,
                                            )
                                        }
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        Dados de Vida
                                    </label>
                                    <input
                                        type="text"
                                        value={character.hitDice}
                                        onChange={(e) =>
                                            handleChange(
                                                "hitDice",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ex: 1d8"
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        HP Máximo
                                    </label>
                                    <input
                                        type="number"
                                        value={character.maxHp}
                                        onChange={(e) =>
                                            handleChange(
                                                "maxHp",
                                                parseInt(e.target.value) || 10,
                                            )
                                        }
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-silver text-sm block mb-2">
                                        HP Temporário
                                    </label>
                                    <input
                                        type="number"
                                        value={character.tempHp}
                                        onChange={(e) =>
                                            handleChange(
                                                "tempHp",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: EQUIPAMENTO */}
                    {activeTab === "equipment" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gold border-b-2 border-gold/50 pb-2">
                                Equipamento
                            </h2>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Moeda (ouro)
                                </label>
                                <input
                                    type="number"
                                    value={character.currency}
                                    onChange={(e) =>
                                        handleChange(
                                            "currency",
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white focus:border-gold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Equipamentos
                                </label>
                                <textarea
                                    value={character.equipment}
                                    onChange={(e) =>
                                        handleChange(
                                            "equipment",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Lista de equipamentos (um por linha)"
                                    rows="4"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Proficiências
                                </label>
                                <textarea
                                    value={character.proficiencies}
                                    onChange={(e) =>
                                        handleChange(
                                            "proficiencies",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Proficiências com armas, armaduras, etc"
                                    rows="3"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Idiomas
                                </label>
                                <textarea
                                    value={character.languages}
                                    onChange={(e) =>
                                        handleChange(
                                            "languages",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Idiomas que o personagem fala"
                                    rows="2"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB: PERSONALIDADE */}
                    {activeTab === "personality" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gold border-b-2 border-gold/50 pb-2">
                                Personalidade & Características
                            </h2>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Traços de Personalidade
                                </label>
                                <textarea
                                    value={character.personality.traits}
                                    onChange={(e) =>
                                        handlePersonalityChange(
                                            "traits",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Descreva os traços de personalidade do seu personagem"
                                    rows="2"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Ideais
                                </label>
                                <textarea
                                    value={character.personality.ideals}
                                    onChange={(e) =>
                                        handlePersonalityChange(
                                            "ideals",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Quais são os ideais do seu personagem?"
                                    rows="2"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Laços
                                </label>
                                <textarea
                                    value={character.personality.bonds}
                                    onChange={(e) =>
                                        handlePersonalityChange(
                                            "bonds",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="A quem ou a o quê seu personagem está ligado?"
                                    rows="2"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Falhas
                                </label>
                                <textarea
                                    value={character.personality.flaws}
                                    onChange={(e) =>
                                        handlePersonalityChange(
                                            "flaws",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Quais são as falhas do seu personagem?"
                                    rows="2"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB: FEATURES */}
                    {activeTab === "features" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gold border-b-2 border-gold/50 pb-2">
                                Características & Traços Especiais
                            </h2>
                            <div>
                                <label className="text-silver text-sm block mb-2">
                                    Features & Traits
                                </label>
                                <textarea
                                    value={character.featuresTraits}
                                    onChange={(e) =>
                                        handleChange(
                                            "featuresTraits",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Descreva as características especiais, magias, poderes especiais, etc"
                                    rows="6"
                                    className="w-full p-3 bg-black/50 border-2 border-gold/50 rounded-lg text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={saveCharacter}
                        disabled={loading}
                        className="flex-1 bg-gold text-black py-4 rounded-xl font-bold text-lg bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                    >
                        {loading ? "Salvando..." : "Salvar Personagem"}
                    </button>
                    <button
                        onClick={() => navigate("/personagens")}
                        className="flex-1 bg-red-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CriarPersonagemPage;
