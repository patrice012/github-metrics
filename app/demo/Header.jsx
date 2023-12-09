"use client";

import { useEffect, useRef, useState } from "react";
import { Chat, HeroContent } from "./Hero";
import { useContext } from "react";
import { HeaderSliderContext } from "@/context/headerSliderContext";
import style from "./_header.scss";

const Header = () => {
    const { sliderData } = useContext(HeaderSliderContext);
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const speed = 80;
    const prevIndex = useRef();

    function typeWriter() {
        if (index < sliderData.length) {
            const text = sliderData[index].text;
            let i = 0;
            prevIndex.current = index;

            const typeCharacter = () => {
                if (i < text.length) {
                    setText(text.substring(0, i + 1));
                    i++;
                    setTimeout(typeCharacter, speed);
                }
            };
            typeCharacter();
        }
    }

    useEffect(() => {
        typeWriter();
    }, [index]);

    const displayText = (index) => {
        if (prevIndex.current && prevIndex.current != index) setText("");
        setIndex(index);
    };

    return (
        <>
            <header className="landing-page--header">
                <section>
                    <div className="hero container">
                        <div className="hero-contents ">
                            <HeroContent headerText={text} />
                            <Chat setHeaderText={displayText} />
                        </div>
                    </div>
                </section>
            </header>
        </>
    );
};

export { Header };
