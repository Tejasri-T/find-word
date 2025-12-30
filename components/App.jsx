
import clsx from "clsx"
import { languages } from "./language.js"
import { useState,useEffect } from 'react'
import { getFarewellText, randomWord } from "./utils.js"
import Confetti from 'react-confetti'

export default function App() {
    const [guessedLetters, setGuessedLetters] = useState([])
    const [currentWord, setCurrentWord] = useState(() => randomWord())
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        const handler = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener("resize", handler)
    },[]

    )
    function handleNewGame() {
        setCurrentWord(randomWord)
        setGuessedLetters([])
    }
    console.log(currentWord)
    const wrongGuessCount = (guessedLetters.filter(letter => !currentWord.includes(letter))).length

    const isGameWon =
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost
    let farewell = null
    // console.log(isGameOver, guessedLetters, currentWord.split(""))
    //confetti
    console.log(size)
    

    const chips = languages.map((chip, index) => {
        const styles = {
            backgroundColor: chip.backgroundColor,
            color: chip.color

        }

        const className = clsx({
            chip: true,
            lost: wrongGuessCount > index ? true : false
        })
        // console.log(chip,className)

        if (wrongGuessCount) {
            farewell = getFarewellText(languages[wrongGuessCount - 1].name)
        }

        return (
            <span style={styles} className={className} key={index}>{chip.name}</span>
        )
    })


    // console.log(languages[wrongGuessCount-1].name,farewell)

    const currentArray = [...currentWord]
    const letterElements = currentArray.map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })





    function addGuessedLetters(letter) {
        setGuessedLetters(prev =>
            prev.includes(letter) ? prev : [...prev, letter])
    }

    // console.log(guessedLetters)

    const keyboard = "qwertyuiopasdfghjklzxcvbnm".split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)

        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })
        //  console.log(className)
        return (

            <button
                className={className}
                key={letter}
                onClick={() => addGuessedLetters(letter)}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                disabled={guessedLetters.includes(letter) || isGameOver}
            >{letter.toUpperCase()}</button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: farewell && !isGameLost && !isGameWon ? true : false
    })

    console.log(gameStatusClass)

    return (
        <main>
            {/* <div className="ditto"> */}
           { isGameWon &&
            <Confetti
      width={size.width}
      height={size.height} 
      recycle={false}
      numberOfPieces={3000}
    />}
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the
                    programming world safe from Assembly!</p>
            </header>

            <section aria-live="polite" role="status" className={gameStatusClass}>
                {isGameOver ? (
                    isGameWon ? (
                        <>
                            <h2>You win!</h2>
                            <p>Well done! 🎉</p>
                        </>
                    ) : (
                        <>
                            <h2>Game over!</h2>
                            <p>So sad you couldn't guess a word!!!</p>
                        </>
                    )
                ) : (
                    <>
                        <p>{farewell}</p>
                    </>
                )
                }
            </section>

            <section className="language-chips ">
                {chips}
            </section>
            <section className="word">
                {letterElements}
            </section>

            <section
                className="sr-only"
                aria-live="polite"
                role="status"
            >
                <p>Current word: {currentWord.split("").map(letter =>
                    guessedLetters.includes(letter) ? letter : "blank")}</p>

            </section>

            <section className="keyboard">
                {keyboard}
            </section>
            {isGameOver && <button className="new-game" onClick={handleNewGame}>New Game</button>}
            {/* </div> */}


        </main>
    )
}