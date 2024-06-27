import { useState, useEffect } from 'react'
import axios from 'axios'
import './Quiz.css'

const Quiz = () => {
    const [index, setIndex] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState(null)
    const [lock, setLock] = useState(false)
    const [score, setScore] = useState(0)
    const [result, setResult] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Fetch questions from OpenTDB API
        axios.get('https://opentdb.com/api.php?amount=10&type=multiple')
            .then(response => {
                const data = response.data.results.map((item) => ({
                    question: decodeHTMLEntities(item.question),
                    options: shuffleOptions([...item.incorrect_answers.map(decodeHTMLEntities), decodeHTMLEntities(item.correct_answer)]),
                    answer: decodeHTMLEntities(item.correct_answer)
                }))
                setQuestions(data)
                setQuestion(data[0])
            })
            .catch(error => {
                console.error('Error fetching data:', error)
                setError('Failed to fetch questions. Please try again later.')
            })
    }, [])

    const shuffleOptions = (options) => {
        // Shuffle the options array
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = options[i]
            options[i] = options[j]
            options[j] = temp
        }
        return options
    }

    const decodeHTMLEntities = (text) => {
        const textArea = document.createElement('textarea')
        textArea.innerHTML = text
        return textArea.value
    }

    const checkAnswer = (e, ans) => {
        if (!lock) {
            if (question.answer === ans) {
                e.target.classList.add("correct")
                setScore(prev => prev + 1)
            } else {
                e.target.classList.add("wrong")
                let correctOption = question.options.indexOf(question.answer)
                document.getElementById(`option${correctOption + 1}`).classList.add("correct")
            }
            setLock(true)
        }
    }

    const next = () => {
        if (lock) {
            if (index === questions.length - 1) {
                setResult(true)
                return
            }
            setIndex(prevIndex => {
                const newIndex = prevIndex + 1
                setQuestion(questions[newIndex])
                return newIndex
            })
            setLock(false)
            const wrongElements = document.getElementsByClassName('wrong')
            while (wrongElements.length > 0) {
                wrongElements[0].classList.remove('wrong')
            }
            const correctElements = document.getElementsByClassName('correct')
            while (correctElements.length > 0) {
                correctElements[0].classList.remove('correct')
            }
        }
    }

    const reset = () => {
        setIndex(0)
        setQuestion(questions[0])
        setScore(0)
        setLock(false)
        setResult(false)
    }

    if (error) {
        return <div>{error}</div>
    }

    if (questions.length === 0) {
        return (<div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>)
    }

    return (
        <div className='container my-5'>
            <div className="card pt-1 pb-4 px-3">
                <div className="card-header text-center">
                    <h1>Quiz App</h1>
                </div>
                {result ? (
                    <>
                        <h2>You Scored {score} out of {questions.length}</h2>
                        <button onClick={reset}>Reset</button>
                    </>
                ) : (
                    <>
                        <div className="card-body">
                            <h2 className='fw-normal'>{index + 1}. {question.question}</h2>
                            <ul className='list-unstyled'>
                                {question.options.map((option, i) => (
                                    <li key={i} id={`option${i + 1}`} onClick={(e) => checkAnswer(e, option)}>{option}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-footer text-center">
                            <button onClick={next}>Next</button>
                            <p className="index text-muted">{index + 1} of {questions.length} questions</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Quiz
