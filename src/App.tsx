import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { time } from "console";

import playImg from "./assets/play.png";
import resetImg from "./assets/reset.png";
import focoBtnClicked from "./assets/foco-clicked.png";
import focoBtn from "./assets/foco.png";
import pausaBtnClicked from "./assets/pausa-clicked.png";
import pausaBtn from "./assets/pausa.png";
import idleGif from "./assets/idle.gif";
import focusGif from "./assets/focus.gif";
import breakGif from "./assets/break.gif";
import closeBtn from "./assets/close.png";

function App() {
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [breakButtonImage, setBreakButtonImage] = useState(pausaBtn);
  const [focusButtonImage, setFocusButtonImage] = useState(focoBtn);
  const [gifImage, setGifImage] = useState(idleGif);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [image, setImage] = useState(playImg);

  const cheerMessages = [
    "Você consegue!",
    "Continue focado!",
    "Não desista agora!",
    "Falta pouco!",
    "Tá mandando bem!",
  ];

  const breakMessages = [
    "Hora de descansar!",
    "Relaxa um pouco!",
    "Respira fundo!",
    "Aproveita a pausa!",
    "Você merece esse descanso!",
  ];

  // Encourage message updater
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if (isRunning) {
      const messages = isBreak ? breakMessages : cheerMessages;
      setEncouragement(messages[0]); // set first message initally
      let index = 1;

      messageInterval = setInterval(() => {
        setEncouragement(messages[index]);
        index = (index + 1) % messages.length;
      }, 10000); // every 10 seconds
    } else {
      setEncouragement("");
    }

    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // set initial switch mode to false
  useEffect(() => {
    switchMode(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");

    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakButtonImage(breakMode ? pausaBtnClicked : pausaBtn);
    setFocusButtonImage(breakMode ? focoBtn : focoBtnClicked);
    setTimeLeft(breakMode ? 10 * 60 : 50 * 60);
    setGifImage(idleGif);
  };

  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
      setGifImage(isBreak ? breakGif : focusGif);
      setImage(resetImg);
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ? 10 * 60 : 50 * 60);
      setGifImage(idleGif);
      setImage(playImg);
    }
  };

  const containerClass = `app-container ${isRunning ? "background-green" : ""}`;

  return (
    <div className={containerClass} style={{ position: "relative" }}>
      <div>
        <button className="close-button">
          <img src={closeBtn} alt="Fechar" />
        </button>
      </div>

      <div className="home-container">
        <div className="home-content">
          <div className="home-controls">
            <button className="image-button" onClick={() => switchMode(false)}>
              <img src={focusButtonImage} alt="Foco" />
            </button>
            <button className="image-button" onClick={() => switchMode(true)}>
              <img src={breakButtonImage} alt="Pausa" />
            </button>
          </div>

          <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
            {encouragement}
          </p>

          <h1 className="home-timer">{formatTime(timeLeft)}</h1>
          <img
            src={gifImage}
            alt="Status do crônometro"
            className="gif-image"
          />

          <button className="home-button" onClick={handleClick}>
            <img src={image} alt="Ícone de botão" className="image-button" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
