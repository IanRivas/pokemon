import type {Pokemon} from "./types";

import {useState, useEffect} from "react";

import api from "./api";

function App() {
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [win, setWin] = useState(false);
  const [giveUp, setGiveUp] = useState(false);
  const [countVictory, setCountVictory] = useState(0);
  const [countLosing, setCountLosing] = useState(0);

  useEffect(() => {
    api.random().then((data) => setPokemon(data));
    setCountVictory(Number(window.localStorage.getItem("countVictory")));
    setCountLosing(Number(window.localStorage.getItem("countLosing")));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("countVictory", String(countVictory));
  }, [countVictory]);

  useEffect(() => {
    window.localStorage.setItem("countLosing", String(countLosing));
  }, [countLosing]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const guessInput = e.target.pokemonName.value.toLowerCase().replace(/\W/g, "");
    const pokemonName = pokemon?.name.toLowerCase().replace(/\W/g, "");

    if (giveUp) {
      e.target.pokemonName.value = "";

      return;
    }
    if (pokemonName === guessInput && win !== true) {
      setWin(true);
      setCountVictory(countVictory + 1);
      e.target.pokemonName.value = "";
    } else if (pokemon?.name !== e.target.pokemonName.value && win !== true) {
      setCountLosing(countLosing + 1);
    }
  };
  const handleGiveUp = () => {
    if (!giveUp && !win) {
      setGiveUp(true);
      setCountLosing(countLosing + 1);
    }
  };

  const resetGame = () => {
    api.random().then((data) => setPokemon(data));
    setWin(false);
    setGiveUp(false);
  };
  const resetCountVictory = () => {
    setCountVictory(0);
    window.localStorage.setItem("countVictory", String(0));
  };
  const resetCountLosing = () => {
    setCountLosing(0);
    window.localStorage.setItem("countLosing", String(0));
  };

  return (
    <main>
      <h2>Who&apos;s That Pokémon??</h2>
      <div className={win || giveUp ? "pokemon-container" : ""}>
        <img
          alt="pokemon image"
          className={!win && !giveUp ? "hidden" : ""}
          src={pokemon ? pokemon.image : "#"}
        />
        {win ? (
          <div className="win">
            <h2>{pokemon ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : null}</h2>
            <h3>You Win!!</h3>
            <button className="nes-btn is-success" onClick={resetGame}>
              Play Again
            </button>
          </div>
        ) : null}
        {giveUp ? (
          <div className="win">
            <h2>{pokemon ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : null}</h2>
            <button className="nes-btn is-success" onClick={resetGame}>
              Play Again
            </button>
          </div>
        ) : null}
      </div>

      <form className="nes-field is-inline" onSubmit={handleSubmit}>
        <input className="nes-input" name="pokemonName" type="text" />
        <div>
          <button className="nes-btn is-primary" type="submit">
            Guess
          </button>
          <button className="nes-btn is-warning" onClick={handleGiveUp}>
            Give up
          </button>
        </div>
      </form>
      <div className="container-count">
        <div className="countItem">
          <p>Winning Count: {countVictory}</p>
          <button className="nes-btn is-error" onClick={resetCountVictory}>
            Reset Winning Count
          </button>
        </div>
        <div className="countItem">
          <p>Losing Count: {countLosing}</p>
          <button className="nes-btn is-error" onClick={resetCountLosing}>
            Reset Losing Count
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
