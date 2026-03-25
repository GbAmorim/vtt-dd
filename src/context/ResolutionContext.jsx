import React, { createContext, useContext, useState, useEffect } from "react";

const ResolutionContext = createContext();

export const useResolution = () => useContext(ResolutionContext);

export const ResolutionProvider = ({ children }) => {
    const [resolution, setResolution] = useState("1080p");

    const changeResolution = (res) => {
        setResolution(res);

        const resolutions = {
            "720p": { width: 1280, height: 720 },
            "1080p": { width: 1920, height: 1080 },
            "1440p": { width: 2560, height: 1440 },
            "4K": { width: 3840, height: 2160 },
            "Tela Cheia": {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        };

        const selected = resolutions[res];

        if (res === "Tela Cheia") {
            // Ativa tela cheia
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        } else {
            // Sai de tela cheia se estiver
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }

            // Redimensiona janela (apenas em desktop/Electron)
            if (window.electron) {
                window.electron.setWindowSize(selected.width, selected.height);
            }
        }
    };

    const value = {
        resolution,
        changeResolution,
    };

    return (
        <ResolutionContext.Provider value={value}>
            {children}
        </ResolutionContext.Provider>
    );
};
