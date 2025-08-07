import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { time } from 'console';

import playImg from "./assets/play.png";
import resetImg from "./assets/reset.png";
import focusBtnClicked from "./assets/foco-clicked.png";
import focoBtn from "./assets/foco.png";
import pausaBtnClicked from "./assets/pausa-clicked.png";
import pausaBtn from "./assets/pausa.png";
import closeBtn from "./assets/close.png";


function App() {
  const [timeLeft, setTimeLeft] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");

  const cheerMessages = [
    "Você consegue!",
    "Continue focado!",
    "Não desista agora!",
    "Falta pouco!",
    "Tá mandando bem!"
  ];

  const breakMessages = [
    "Hora de descansar!",
    "Relaxa um pouco!",
    "Respira fundo!",
    "Aproveita a pausa!",
    "Você merece esse descanso!"
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
        setTimeLeft(prev => prev - 1)
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');

    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setTimeLeft(isBreak ? 10 * 60 : 50 * 60);
  };

  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ? 10 * 60 : 50 * 60);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div>
        <button className="closeButton">Fechar</button>
      </div>

      <div className="home-container">
        <div className="home-content">
          <div className="home-controls">
            <button className="image-button" onClick={() => switchMode(false)}>Foco</button>
            <button className="image-button" onClick={() => switchMode(true)}>Pausa</button>
          </div>
        </div>

        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>{encouragement}</p>

        <h1 className="home-timer">{formatTime(timeLeft)}</h1>

        <button className="home-button" onClick={handleClick}>Iniciar</button>
      </div>
    </div>
  );
}

export default App;
