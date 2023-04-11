import axios from 'axios' // 一种处理 Get request 的 module，可以更方便地完成 fetchdata.
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const url = ''
const tempUrl =
  'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {

  // 将可能需要用到的 state 列出：

  // 首先：是否处于 setup form 页面？
  const [waiting, setWaiting] = useState(true); 
    // 是由于 waiting 没有正确设置，页面没有 end point，落脚点
    // 导致 object undefined！（在 loading 上持续空转）

  // 是否位于 loading 页面?
  const [loading, setLoading] = useState(false);

  // 问题 array？
  const [questions, setQuestions] = useState([]);

  // 目前问题进行到第几个？
  const [index, setIndex] = useState(0);

  // 目前累积的 回答正确 个数？
  const [correct,setCorrect] = useState(0);

  // ending modal 是否 open？
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 是否出现 Error?
  const [error, setError] = useState(false);

  // SetUp Form 的初始值
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy'
  })

  const fetchQuestions = async (url) => { // 使用 axios 来简化步骤！
    setLoading(true);
    setWaiting(false);

    const response = await axios(url).catch((err) => console.log(err)) // axios 的 get request 不需要写出来，默认 axios() 就是 get
    // console.log(response);

    // 目前能够 console.log 一个 object，属于理想状态
    // 如果 response 不存在，则无法加载 object 中的 data.

    if (response) { 
      // 当 url 输入正确时，response 为 true, 则可以 setQuestions
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setWaiting(false);
        setError(false);
      } else { // 若除了 data 有内容之外的任何其他情况，
        // 譬如 amount > 50 的情况，则 response 会回传，但会传回如下 object:

          // {"response_code": 1,
          //   "results": []}

        // （response 仅包含一个 empty array results）
        setWaiting(true);
        setError(true); // 在 waiting 页面上显示 Can't Generate Questions, Please Try Different Options
      }
    } else { // 若 response 根本不存在，没有回传，则停留在 setupForm 页面上。 
      setWaiting(true);
    }
  }

  const nextQuestion = () => {
    setIndex((oldIndex) => { // 还记得吗？setter 的 callback函数，接收 previous 值作为默认值。
      const index = oldIndex + 1
      if (index > questions.length - 1) {
        // 此时打开 Modal 与返回键，并返回第一个问题
        openModal();
        return 0;
      } else {
        return index
      }})}

  const checkAnswer = (value) => {
    if (value === true) { // 当 checkAnswer 的结果为 true 时，
      setCorrect((oldState) => oldState + 1) // 将 correct answer 的数字加一。
    }
    nextQuestion()
  }

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setWaiting(true);
    setCorrect(0); // correct state 还原为 0
    setIsModalOpen(false);
  }

  // useEffect(() => {
  //   fetchQuestions(tempUrl);
  // },[]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setQuiz({...quiz, [name]: value}) // object 内对于某个 property 的 query 方式: ...quiz, [name]
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const {amount, category, difficulty} = quiz;
    // const tempUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple' 
    // 先使用一个 替代 API 来开发 Question 页面。

    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;

    fetchQuestions(url);
  } 


  return <AppContext.Provider value={{
    waiting, setWaiting,
    loading,
    questions,
    index,
    correct,
    isModalOpen,
    error,
    nextQuestion,
    checkAnswer,
    closeModal,
    quiz,
    handleChange,
    handleSubmit
  }}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
