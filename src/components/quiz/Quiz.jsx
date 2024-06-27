import { useRef, useState } from 'react'
import './Quiz.css'
import { data } from '../../assets/data'

const Quiz = () => {

    let [index, setIndex] = useState(0)
    let [question, setQuestion] = useState(data[index])
    let [lock, setLock] = useState(false)
    let [score, setScore] = useState(0)
    let [result, setResult] = useState(false)

    let options_array = question.options

    const checkAnswer = (e, ans) => {
        if (!lock) {
            if (question.answer == ans) {
                e.target.classList.add("correct")
                setScore(prev => prev + 1)
            } else {
                e.target.classList.add("wrong")
                let correctOption = options_array.indexOf(question.answer)
                document.getElementById(`option${correctOption + 1}`).classList.add("correct")
            }
            setLock(true)
        }
    }

    const next = () => {
        if (lock) {
            if (index === data.length - 1) {
                setResult(true)
                return 0
            }
            setIndex(prevIndex => {
                const newIndex = prevIndex + 1
                setQuestion(data[newIndex])
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
        setQuestion(data[0])
        setScore(0)
        setLock(false)
        setResult(false)
    }

    return (
        <div className='container my-5'>
            <div className="card pt-1 pb-4 px-3">
                <div className="card-header text-center">
                    <h1>Quiz App</h1>
                </div>
                {result ? (<>
                    <h2>You Scored {score} out of {data.length}</h2>
                    <button onClick={reset}>Reset</button>
                </>) : (<>
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
                        <p className="index text-muted">{index + 1} of {data.length} questions</p>
                    </div>
                </>)}
            </div>
        </div>
    )
}

export default Quiz