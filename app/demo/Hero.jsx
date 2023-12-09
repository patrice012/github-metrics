"use client";

import { useEffect, useState } from "react";
import { useContext } from "react";
import { HeaderSliderContext } from "@/context/headerSliderContext";
import Link from "next/link";

import { Search } from "./search";

const Chat = ({ setHeaderText }) => {
    const clsOrder = ["first", "second", "third", "fourth"];
    const [display, setDisplay] = useState([true, false, false, false]);
    const [imgOrder, setImgOrder] = useState(clsOrder);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { sliderData, interval: intervalTime } =
        useContext(HeaderSliderContext);

    const updateDisplay = (index) => {
        const newDisplay = new Array(display.length).fill(false);
        newDisplay[index] = true;
        const newOrder = new Array(imgOrder.length).fill(undefined);
        for (let i = 0; i < imgOrder.length; i++) {
            newOrder[index] = clsOrder[i];
            index++;
            if (index == imgOrder.length) index = 0;
        }
        setImgOrder(newOrder);
        setDisplay(newDisplay);
    };

    const handleSlideClick = (index) => {
        setCurrentIndex(index);
        updateDisplay(index);
        setHeaderText(index);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            // Auto slide to the next one
            const nextIndex = (currentIndex + 1) % display.length;
            setCurrentIndex(nextIndex);
            updateDisplay(nextIndex);
            setHeaderText(nextIndex);
        }, intervalTime);

        return () => {
            clearInterval(interval);
        };
    }, [currentIndex, display]);

    return (
        <div className="demo">
            <div className="stack">
                {sliderData?.map((slide, index) => {
                    return (
                        <div
                            key={index}
                            className={"card" + " " + imgOrder[index]}
                        >
                            <div className="chat">
                                <div className={slide?.imgClsName}>
                                    <img src={slide?.imgUrl} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* <div className="chat--btns">
                <div className="chat--btns__container">
                    {sliderData?.map((btn, index) => (
                        <div
                            key={index}
                            className={
                                "chat--btn " +
                                btn.btnClsName +
                                " " +
                                (display[index] ? "active" : "")
                            }
                            onClick={() => handleSlideClick(index)}
                        >
                            <span className="box border-gradient">
                                <img src={btn.btnUrl} />
                                {display[index] && <i className="sparkle"></i>}
                            </span>
                            {display[index] && (
                                <span className="btn--text">{btn.btnText}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

const HeroContent = ({ headerText }) => {
    return (
        <>
            <h1 className="hero-heading">
                <span className="colorful-style">
                    Reflect on your year with GitHub.
                </span>
                <span id="slider-text">{headerText}</span>
            </h1>
            <div className="hero-contents-information">
                <p className="">
                    deep into the
                    <span className="colorful-style"> GitHub API</span>, to
                    bring you insightful metrics and{" "}
                    <span className="colorful-style"> visualizations</span>
                </p>
                <div className="hero-btn__container">
                    <div className="btn--primary">
                        <Link
                            href="https://github.com/patrice012/github-metrics"
                            className="btn"
                        >
                            Code source
                        </Link>
                    </div>
                    <Search/>
                </div>
            </div>
        </>
    );
};

export { HeroContent, Chat };
