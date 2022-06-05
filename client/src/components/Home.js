import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moon from '../assets/moon.svg'
import light from '../assets/light.svg'

const Home = () => {

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {

    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      document.documentElement.setAttribute('data-theme', localTheme);
      setTheme(localTheme);
    }    
  }, []);

  const switchTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }

  return (
      <div className="home">
        <form>
          <img
            src={theme === "light" ? light : moon}
            alt="theme"
            width={theme === "light" ? "20" : "25"}
            style={{ filter: theme === "light" ? "unset" : "brightness(0) invert(1)" }}
            onClick={() => switchTheme("light" === theme ? "dark" : "light")}
          />
          <h1>Join</h1>
            <input
              placeholder="Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Room"
              type="text"
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          <Link
            onClick={(e) => (!name || !room ? e.preventDefault() : null)}
            to={`/chat?name=${name}&room=${room}`}
          >
            <button type="submit">
              Enter
            </button>
          </Link>
        </form>
      </div>
  );
};

export default Home;