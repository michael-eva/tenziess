import React from "react"
import Die from "./components/Die"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"

export default function App() {
    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [count, setCount] = useState(0)
    const [bestScore, setBestScore] = useState()

    //use effect to sync tenzies with dice if true
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const sameValue = dice.every(die => die.value === firstValue)
        if (allHeld && sameValue) {
            setTenzies(true)
        }

    }, [dice])

    // helper function to generate new die
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(
                generateNewDie()
            )
        }
        return newDice
    }
    function rollDice() {
        // generate new dice if isHeld is false
        if (!tenzies) {
            setCount(count + 1)
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ? die : generateNewDie()
            }))
            //restarting the game
        } else {
            setTenzies(false)
            setDice(allNewDice())
            if (bestScore === 0 || count < bestScore) {
                setBestScore(count);
                return localStorage.setItem('bestScore', JSON.stringify(count));
            }
            setCount(0)
        }
        console.log(count);
        console.log(bestScore);
    }
    // holdDice is passed through the component as a prop
    //receieves the id back
    //maps over previous dice state
    //toggles between isHeld and not by clicking the die
    const holdDice = (id) => {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? { ...die, isHeld: !die.isHeld } : die
        }))
    }

    //rendering dice elements
    const diceElements = dice.map(die =>
    (<Die
        value={die.value}
        key={die.id}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
    />))

    // setting and getting data from local storage

    useEffect(() => {
        const bestScoreFromLocalStorage = JSON.parse(localStorage.getItem('bestScore'));
        if (bestScoreFromLocalStorage !== null) {
            setBestScore(bestScoreFromLocalStorage);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('bestScore', JSON.stringify(bestScore))
    }, [bestScore])


    return (
        <main>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button
                className="roll-dice"
                onClick={rollDice}>
                {tenzies ? "Reset Game" : "Roll"}
            </button>
            {bestScore ? `Lowest Score: ${bestScore}` : `No games logged`}
            <p>Updated</p>
        </main>
    )
}
