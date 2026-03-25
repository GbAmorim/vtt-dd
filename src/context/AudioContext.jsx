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
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(80);

    useEffect(() => {
        // Cria elemento de áudio
        if (!audioRef.current) {
            const audio = new Audio("/audio.mpeg");
            audio.loop = true;
            audio.volume = volume / 100;
            audioRef.current = audio;
        }

        // Reproduz ou pausa baseado no estado
        if (isPlaying) {
            audioRef.current
                .play()
                .catch((err) => console.log("Autoplay bloqueado:", err));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        // Atualiza volume
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const toggleAudio = () => setIsPlaying(!isPlaying);

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
