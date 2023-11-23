import { useEffect, useState, useRef } from "react"
import axiosClient from "../axiosclient"
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import { Modal, ModalDialog } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'

function Courses(){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate()

    const [feedlabel, setFeedlabel] = useState("")
    

    const [user, setUser]= useState([])
    const routerParams = useParams()
    const [userResult, setUserResult]= useState([])
    
    const feedbackRef = useRef()

    useEffect(()=>{
        getUser()
        getResult()
        checkUserId(routerParams)
    },[])
    
    const checkUserId = (routerParams) => {
        const payload = {
            'data': routerParams.chatid
        }
        axiosClient.post("/getUserId",payload)
        .then((response)=>{
            if(response.data=="False"){
                navigate(`/${routerParams.chatid}/login`)
            }
        })
    }
    



    const getResult = async()=>{
        const payload={
            "chat_id":routerParams.chatid
        }
        await axiosClient.post("/getResult",payload)
            .then(({data})=>{
                
                setUserResult(data.data)
    })
    }

    const getUser = async()=>{
        const payload={
            "chat_id":routerParams.chatid
        }
        await axiosClient.post("/getUser", payload)
        .then(({data})=>{
            
            setUser(data.data)
        })
    }

    const feedback = async(text)=>{
        setFeedlabel("Отзыв отправлен!")
        // document.getElementsByTagName("input")[0].value
        
        const payload={
            // "chat_id":routerParams.chatid,
            "data": {
                "text": feedbackRef.current.value
            }
        }
        console.log(payload);
        await axiosClient.post("/sendFeedback",payload)
        
    }




    return(
        <div className='container'>
            <div className="row" style={{background:"#8c64d8",height: "56px"}} > 
                <nav class="navbar navbar " style={{color:"#ffffff"}} >
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#" style={{color:"#ffffff"}}>Мой профиль</a>
                        <button class="navbar-toggler btn btn-light"  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrollingLabel" aria-controls="offcanvaskNavbar" aria-label="Toggle navigation" >
                            <span class="navbar-toggler-icon "></span>
                        </button>
                        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasScrollingLabel" aria-labelledby="offcanvasRightLabell" aria-hidden="false" data-bs-scroll="true" data-bs-backdrop="false">
                            <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasRightLabel"style={{color:"#8c64d8"}}>Меню</h5>
                            <button type="button" class="btn-close" style={{color:"#8c64d8"}} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div class="offcanvas-body ">
                            <ul class="navbar-nav ">
                                
                                <li class="nav-item">
                                    <div className="btn">
                                <Link to={`/${routerParams.chatid}/main`} class="nav-link" href="#">Тесты</Link>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <div className="btn">
                                <Link to="#" class="nav-link " onClick={handleShow} href="#" style={{color:"#8c64d8"}}>Обратная связь</Link>
                                        <Modal show={show}>
                                            <Modal.Header> 
                                                <Modal.Title>Обратная связь</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <label className="label" style={{color:"#07da63", transition:"1s"}}>{feedlabel}</label>
                                                <input className="form-control" ref={feedbackRef} placeholder="Введите ваш отзыв"></input>
                                            </Modal.Body>
                                            <Modal.Footer>
                                            <button className="btn"  style={{background:"#8c64d8", color:"#FFFFFF"}} onClick={handleClose}>Закрыть</button>
                                                <button className="btn" type="submit" style={{background:"#8c64d8", color:"#FFFFFF"}} id="feedbackID" onClick={feedback}>Отправить</button>
                                            </Modal.Footer>
                                        </Modal>

                                    </div>
                                </li>
                            </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <div className='row'>
                <div class="card" >
                    <ul class="list-group list-group-flush ">
                        {
                            user.map((q)=>( 
                                <><li class="list-group-item">Имя: {q.first_name}</li>   
                                <li class="list-group-item">Фамилия: {q.last_name}</li>
                                <li class="list-group-item">Почта: {q.email}</li>
                                <li class="list-group-item">Номер телефона: {q.phone}</li></>
                            ))
                        }
                    </ul>
                </div>
            <div className="card">    
            <table class="table">
                <thead class>
                    <tr>
                    <th scope="col">Предмет</th>
                    <th scope="col">Тест</th>
                    <th className="row" scope="col">Результат</th>
                    </tr>
                </thead>
                <tbody>
                    
                    
                    {
                        userResult.map((r)=>(
                            <>
                            <tr>
                                <td>{r.subject}</td>
                                <td>{r.test}</td>
                                <td>{r.result}/{r.all_question}</td>
                            </tr>
                            </>
                        ))
                    }
                </tbody>
                </table>
                </div>
            </div>
        </div>
        
        )
  }
  export default Courses