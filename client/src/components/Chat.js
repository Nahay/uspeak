import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router";
import {Link} from "react-router-dom"

import arrow from "../assets/arrow.svg";
import close from "../assets/close.svg";
import moon from '../assets/moon.svg'
import light from '../assets/light.svg'
import round from '../assets/round.svg'

let socket;

const Chat = () => {

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState(1);
  const [theme, setTheme] = useState("light");

  const location = useLocation();
  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
        if (error) alert(error);
    });
  }, [location.search]);

  useEffect(() => {

    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      document.documentElement.setAttribute('data-theme', localTheme);
      setTheme(localTheme);
    }   

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({number}) => setNumber(number));

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message });
      setMessage("");
    } else alert("empty input");
  };

  const switchTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }

  return (
    <div className="chat">
      <div className="chat__container">
        <div className="chat__top">
          <h1>
            Room {room}
            <img src={round} alt="round" width="7"/>
            <span>{number}</span>
          </h1>
          <img
            src={theme === "light" ? light : moon}
            alt="theme"
            width={theme === "light" ? "15" : "20"}
            onClick={() => switchTheme("light" === theme ? "dark" : "light")}
          />
          <Link to="/">
            <img
              src={close}
              alt="close"
              width="15"
              height="15"
              onClick={() => socket.disconnect()}
            />
          </Link>
        </div>

        <div className="chat__messages">
          {messages.map((val, i) => {
              return (
              <div key={i} className={val.user === name && "messages__author"}>
                  <p>{val.text}</p>
                  <p>{val.user}</p>
              </div>
              );
          })}
        </div>

        <div className="chat__form">
            <input
                type="text"
                value={message}
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
            <button onClick={handleSubmit}>
              <img src={arrow} alt="arrow" width="20" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;