import { useEffect, useState } from "react"
import axiosClient from "../axiosclient"
import axios from "axios"
import { Link, useParams } from "react-router-dom"
import { Form, ModalTitle } from 'react-bootstrap'
import ReactPlayer from "react-player";
import { configure } from "mobx"
import { makeAutoObservable, reaction, observable } from "mobx"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import router from "../router"

const quizNew = observable(() => {
    const AnswersStorage =  0
})

function Quiz(){
    const [question, setQuestion]= useState([])
    const [answer, setAnswer]= useState([]) 
    const routerParams = useParams()
    
    const [wrongAnswer, setWrongAnswer] = useState([])
    const [wrongQuestion, setWrongQuestion] = useState([])

    const [compliteQuestion , setCompliteQuestion] = useState(0)
    const [totalQuestion , setTotalQuestion] = useState(0)
    const [totalWrongQuestion , setTotalWrongQuestion] = useState(0)

    // const [answerQuestionIdSet, setAnswerQuestionIdSet] = useState([])

    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(true)

    const [jopago, setJopago] = useState([])
    const [bool, setBool] = useState(false)

    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    
    
    useEffect(()=>{
        getQuestions()
        
    },[])

    const getQuestions= async()=>{
        
        const payload = {
            "test_id": routerParams.testid
        }
        await axiosClient.post('/getQuestionAnswer', payload)
        .then(async ({data})=>{
            await setQuestion(data.questions)
            await setAnswer(data.answers)
            await setTotalQuestion(data.questions.length)
            setLoading(false)
        })
    }

    const test = () => {
        setBool(true)
        if (bool === false) question.map((e) => jopago.push({q_id: e.id, q_type: e.type, answer: null}))
    }
    


    let checkanswer=[]
    const handleClickbox= (e, a, q) =>{
        test()
        const checkbox =document.getElementById(q.id)
        a["type"]= 'checkbox'

        a['checked'] = e.target.checked;

        const answerChecked = answer.filter((elem) => {
            return elem.checked
        })
        console.log(answerChecked)
        const answerQuestionId = answerChecked.map((el)=> {
            return el.question_id
        })
        const answerQuestionIdSet = [...new Set(answerQuestionId)];
        // setAnswerQuestionIdSet([...new Set(answerQuestionId)])
        setCompliteQuestion(answerQuestionIdSet.length)
        console.log(answerQuestionIdSet)
        if (checkbox.checked){
            checkanswer.push(a)
            
        } else{
            checkanswer.splice()
        }

        // Deleting null answer from jopago
        if (a['checked']) {
            setJopago(jopago.filter((obj) => {
                return obj.q_id !== q.id
            }))
        }
        console.log(jopago);
    }

    
    const handleClicktext =(e, a, q) =>{
        test()

        let index = jopago.findIndex(e => e.q_id === a.question_id)
        if (index === - 1) {
            jopago.push({q_id: q.id, q_type: q.type, answer: e})
        } else {
            jopago[index] = {q_id: q.id, q_type: q.type, answer: e}
        }
        console.log(jopago)

        
        // a['checked'] = e.target.checked;
        if (document.getElementById(q.id).value!=""){
            a['checked'] = true
        } else {
            a['checked'] = false
        }
        const answerChecked = answer.filter((elem) => {
            return elem.checked
        })
        
        const answerQuestionId = answerChecked.map((el)=> {
            return el.question_id
        })
        
        const answerQuestionIdSet = [...new Set(answerQuestionId)];
        // setAnswerQuestionIdSet([...new Set(answerQuestionId)])
        // if (document.getElementById(q.id).value!=""){
        //     answerQuestionIdSet.push(q.id)
        // }
        console.log("asdasda", answerQuestionIdSet);
        setCompliteQuestion(answerQuestionIdSet.length)
    }



    const handleClick = (e, a, q) => {
        test()
        
        let index = jopago.findIndex(e => e.q_id === a.question_id)
        if (index === - 1) {
            jopago.push({q_id: q.id, q_type: q.type, answer: a})
        } else {
            jopago[index] = {q_id: q.id, q_type: q.type, answer: a}
        }
        a['checked'] = e.target.checked;
        const answerChecked = answer.filter((elem) => {
            return elem.checked
        })
        console.log(answerChecked)
        const answerQuestionId = answerChecked.map((el)=> {
            return el.question_id
        })
        const answerQuestionIdSet = [...new Set(answerQuestionId)];
        // setAnswerQuestionIdSet([...new Set(answerQuestionId)])
        setCompliteQuestion(answerQuestionIdSet.length)
        
    }
    const onSubmit=async (jopago)=>{
        setChecked(true)
        if (jopago.length == 0) {
            test()
            console.log(jopago);
        }

        const answerChecked = answer.filter((elem) => {
            if (elem['type']=='checkbox'){
                return elem.checked
            }
        })

        if (answerChecked.length!=0) {
            jopago.push(answerChecked)
        }

        const payload = {
            "data": jopago
        }
        let wrongQuestion 
        await axiosClient.post('/checkResult',payload)
        .then(async ({data})=>{
            wrongQuestion = data.questions.length
            setWrongQuestion(data.questions)
            setWrongAnswer(data.answers)
            setTotalWrongQuestion(data.questions.length)
            
        });
        // console.log(totalQuestion)
        // console.log(totalWrongQuestion)
        // const load={
    
        //         "chat_id":routerParams.chatid,
        //         "test_id":routerParams.testid,
        //         "result":totalQuestion-totalWrongQuestion,
        //         "all_question":totalQuestion
        // }
        await createResult(wrongQuestion)
    }

    const createResult = async(wrongQuestion) => {
        const load={
            "chat_id":routerParams.chatid,
            "test_id":routerParams.testid,
            "result":totalQuestion-wrongQuestion,
            "all_question":totalQuestion

        }
        console.log(load);
        await axiosClient.post('/createResult',load)
    }
    
    const progress = Math.round((compliteQuestion / totalQuestion) * 100)

    const checkstyle={
        color:"#8c64d8",
        border:"2px solid",
        margin:"5px 5px 0px 0px ",

    } 
    const radiostyle={
    margin:"0px 5px 0px 0px ",
    appearance: "none",
    border:"2px solid",
    // border: "50%",
    width: "16px",
    height: "16px",
    color:"#8c64d8",
    
    transition: "0.2s all linear",

    position: "relative",
    top: "4px",
    }
    
   

    return(
        <>
        {
            loading == true 
            ?
            <div className="text-center">
                <div className="spinner-grow m-5 mx-auto" role="status" style={{color: '#8c64d8',width:"5rem", height:"5rem"}}>
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
            :
            <>
            {
                checked == false
                    ?
                    <>
                    <div className="border-bottom border-3 border-black p-2" >
                    <h2 className="text-center mt-3">{routerParams.testname}</h2>
                    </div>
                    <div className="container mt-3">
                    <form class="Hueta">
                    
                    
                        {question.map((q) => (
                            <> <h3 className="row p-2">
                                {q.text}
                            </h3>
                                {answer.map((a) => (
                                    
                                    a.question_id == q.id &&
                                    
                                    // <div className="form-check">
                                    //     <input style={{ color:"#8c64d8"}} type="radio" id={q.id} name={q.id}/>
                                    //     <label className="mt-1" htmlFor={q.id}>{a.text}</label>
                                    // </div>
                                    <div>
                                        
                                        <label className="" style={{padding:"3px",marginBottom:""}}> 
                                            {
                                                q.type == 'text' 
                                                ?
                                                    <input class="text" className="form-control" placeholder="Ответ" style={{ }} type={q.type} id={q.id} name={q.id} onKeyUp={e => handleClicktext(e.target.value, a, q)} />
                                                : 
                                                    q.type=="radio"
                                                    ?
                                                        <>
                                                        
                                                            <input class="form-check-input " style={radiostyle} type={q.type} id={q.id} name={q.id} onChange={e => handleClick(e, a, q)} />
                                                            {a.text}
                                                        </>
                                                    :
                                                        <>
                                                            <input class="form-check-input " style={checkstyle} type={q.type} id={q.id} name={q.id} onChange={e => handleClickbox(e, a, q)} />
                                                            {a.text}
                                                        </>



                                            }

                                        {/* <input class="form-check-input" style={{ color: "#8c64d8" }} type={q.type} id={q.id} name={q.id} onChange={e => handleClick(e, a, q)} /> */}
                                        </label>
                                        
                                    </div>
                                
                                ))}
                            </>
                        ))}
                        <div class="progress fixed-top" role="progressbar" style={{ color: "#8c64d8", height:'20px' }} aria-label="Animated striped example" aria-valuemin="0" aria-valuemax="100">
                            <div class="striped variant text-center"  style={{ background: "#8c64d8", color: "#ffffff", width:`${progress}%` }}> {progress}%</div>
                        </div> 
                        <div  class="p-3 mb-1">
                        <button className="container btn mt-1 " onClick={handleShow} style={{ background: '#8c64d8', color: "#ffffff" }} type="button">Сдать</button>
                            <Modal show={show}> 
                                <Modal.Header>
                                            <Modal.Title>Вы действительно хотите сдать тест?</Modal.Title>
                                </Modal.Header>
                                            <Modal.Footer>
                                            <button type="button" class="btn btn-secondary" onClick={handleClose} data-bs-dismiss="modal">Отмена</button>
                                            <button className="btn mt-1 " onClick={e => onSubmit(jopago)} style={{ background: '#8c64d8', color: "#ffffff" }} type="button">Сдать</button>
                                            </Modal.Footer>
                            </Modal>
                                        {/* <button className="container btn mt-1 " onClick={e => onSubmit(jopago)} style={{ background: '#8c64d8', color: "#ffffff" }} type="button">Сдать</button> */}
                        {/* onClick={e => onSubmit(jopago)} */}
                        </div>
                    </form>
                </div>
                    </>
                    :
                    <div className="container overflow-auto" >
                        <div className="d-grid gap-2 p-2"><Link to={`/${routerParams.chatid}/main`} className="btn " style={{background:"#8c64d8",color:"#ffffff"}}>Вернуться к тестам</Link></div>
                        <h1 className="text-center p-2">Результат: </h1>
                        <h1 className="text-center p-2">Верных ответов: {totalQuestion-totalWrongQuestion} из {totalQuestion}</h1>
                        <div className=" p-1 "  >
                        <div className="">
                            <p style={{textAlign:"left"}}>🟩 - верный ответ   🟥 - ваш ответ</p> 
                        </div>
                    </div>
                        {wrongQuestion.map((q) => (
                            <> 
                            <h3 className="row mb-1 p-1">
                                {q.text}
                            </h3>
                                {
                                    wrongAnswer.map((a) => (
                                        
                                        
                                            a.question_id == q.id &&
                                                (
                                                    a.is_right == false 
                                                    ?
                                                        a.checked == true
                                                        ?
                                                            <h6 style={{color: "#ff0000"}}>{a.text}</h6>
                                                        :
                                                            <h6>{a.text}</h6>
                                                    :
                                                        a.question_id == q.id &&
                                                            <h6 style={{color: '#00ff15'}}>{a.text}</h6>
                                                )                                        
                                    ))
                                }
                            </>
                        ))}
                        <div><div className="d-grid gap-2 p-2 ">
                            {/* <Link to={`/${routerParams.chatid}/main`} className="btn right" style={{background:"#8c64d8",color:"#ffffff"}}>Вернуться к тестам</Link>
                            <Link to={`/${routerParams.chatid}/quiz`} className="btn left" style={{background:"#8c64d8",color:"#ffffff"}}>Перепройти тест</Link> */}
                        </div>
                        
                        </div>

                        {
                            totalQuestion===totalQuestion-totalWrongQuestion &&
                            <div> Ты ответил на все вопросы правильно вот твой SIUUUU
                                <ReactPlayer url="https://www.youtube.com/watch?v=TP_FoJfDPCQ&ab_channel=ElTrend" width="100%" controls></ReactPlayer>
                            </div>
                        }
                    
                        
                        
                    
                    </div>
            }
            </>
        }
        </>
        
    )
}

export default Quiz

