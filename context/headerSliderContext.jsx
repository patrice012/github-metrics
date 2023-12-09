"use client";

import { createContext } from "react";

const sliderData = [
    {
        text: "Commits",
        // btnClsName: "chatgpt",
        // btnUrl: "./assets/k-gpt.svg",
        // btnText: "Kalami x ChatGPT",
        // imgClsName: "k-chatgpt",
        imgUrl: "./commits.png",
        // betaImg: "./assets/in-beta.svg",
    },

    {
        text: "Contributions",
        // btnClsName: "linkdin",
        // btnUrl: "./assets/k-job-icon.svg",
        // btnText: "Kalami x LinkedIn",
        // imgClsName: "k-jobs",
        imgUrl: "./contributions.png",
    },
    {
        text: "Language",
        // btnClsName: "youtube",
        // btnUrl: "./assets/k-tube-icon.svg",
        // btnText: "Kalami x YouTube",
        // imgClsName: "k-tube",
        imgUrl: "./language.png",
    },
    {
        text: "Repository",
        // btnClsName: "github",
        // btnUrl: "./assets/github-icon.svg",
        // btnText: "Kalami x Github",
        // imgClsName: "k-github",
        imgUrl: "./repository.png",
    },
];

const HeaderSliderContext = createContext({});

const HeaderSliderProvider = ({ children }) => {
    const interval = 5000; // 5s
    return (
        <HeaderSliderContext.Provider value={{ sliderData, interval }}>
            {children}
        </HeaderSliderContext.Provider>
    );
};

export { HeaderSliderContext, HeaderSliderProvider };
