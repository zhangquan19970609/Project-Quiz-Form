// 未执行 fetch 时，可能无法取值到 questions，questions 相关的 expressions 可能会显示为 undefined

import React from 'react'
import { useGlobalContext } from './context'

import SetupForm from './SetupForm'
import Loading from './Loading'
import Modal from './Modal'
function App() {
  const {waiting, loading, questions, index, correct, nextQuestion, checkAnswer} = useGlobalContext();
  
  if (waiting){
    return <SetupForm />
  }
  if(loading){
    return <Loading />
  }
  const {question, correct_answer, incorrect_answers} = questions[index];
  // const answers = [...incorrect_answers, correct_answer];
  let answers = [...incorrect_answers]
  // 建立一个随机数来插入 array！
  const tempIndex = Math.floor(Math.random() * 4);
  if(tempIndex === 3) {
    answers.push(correct_answer);
  } else {
    answers.push(answers[tempIndex]);
    answers[tempIndex] = correct_answer;
  }
  return <main>
    <Modal />
    <section className='quiz'>
      <p className="correct-answers">
        correct answers : {correct}/{index}
      </p>
      <article className='container'>
        {/* 为何采用 dangerouslySetInnerHTML？因为这样可以正常显示 question，
        而不是将其中的空格与符号都转化为 27% 等字符。 */}
        <h2 dangerouslySetInnerHTML={{__html: question}}/> 
        <div className='btn-container'>
          {answers.map((answer,index) => {
            return <button 
              key={index} 
              className='answer-btn'
              dangerouslySetInnerHTML={{__html: answer}}
              onClick={() => {checkAnswer(answer === correct_answer)}} // 仅在点击时才接收 parameters 并生效, checkAnswer 回传一个 true/false
            />
          })}
        </div>
      </article>
      <button className='next-question' onClick={nextQuestion}>next question</button>
    </section>  
  </main>
}

export default App
