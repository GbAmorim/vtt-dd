import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from "react";

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false); // começa false por causa do autoplay
    const [volume, setVolume] = useState(80);

    // Criar o áudio uma vez
    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio("/audio.mpeg");
            audio.loop = true;
            audio.volume = volume / 100;
            audioRef.current = audio;
        }
    }, []);

    // 🔓 Liberar áudio no primeiro clique/toque
    useEffect(() => {
        const unlockAudio = () => {
            if (audioRef.current) {
                audioRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((err) => console.log("Erro ao liberar áudio:", err));
            }

            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
        };

        window.addEventListener("click", unlockAudio);
        window.addEventListener("touchstart", unlockAudio);

        return () => {
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
        };
    }, []);

    // Controlar play/pause manual
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Atualizar volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const toggleAudio = () => {
        setIsPlaying((prev) => !prev);
    };

    const value = {
        isPlaying,
        volume,
        setVolume,
        toggleAudio,
        audioRef,
    };

    return (
        <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
    );
};
