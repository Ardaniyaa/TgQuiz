import { useEffect, useState, useRef } from "react"
import axiosClient from "../axiosclient"
import { Link, useParams } from 'react-router-dom'
import Login from "./Login"
import { Modal, ModalDialog } from "react-bootstrap"

function Main(){
    const [subject, setSubject] = useState([])
    const [test, setTest] = useState([])
    const [show, setShow] = useState(false)

    const [complete, setComplete] = useState([])

    const routerParams = useParams()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [feedlabel, setFeedlabel] = useState("")

    const feedbackRef = useRef()

    useEffect(()=> {
        getSubject()
        getComplete()
    }, [])

    const getSubject = async () => {
        await axiosClient.post('/getSubTest')
            .then(async ({data}) => {
                setSubject(data.subjects)

                // await setTest(data.tests)
                let test_array = data.tests
                getComplete(test_array)

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
        
        await axiosClient.post("/sendFeedback",payload)
        
    }

const shadowButton={
    boxShadow:"1px 2px 9px #342827 ",
    backgroundColor: "#8C64D8",
    color: "#FFFFFF"
};
const checkStyle={
    // background:"8c64d8",
    color:"#8c64d8",
    border:"2px solid",
}

    const getComplete = async (test_array) =>{
        const payload ={
            "chat_id":routerParams.chatid,
        }
        await axiosClient.post('/checkTest', payload)
        .then(async ({data})=>{
            setComplete(data.data)
            let ara_ara = data.data
            let ar = test_array.map((e) => {
                if (ara_ara.includes(e.id)) {
                    e['complete'] = true
                    return e
                } else {
                    e['complete'] = false
                    return e
                }
            })
            setTest(ar)
            
        })
    }

    return(
        
        <div className="container" >
          <div className="row" style={{background:"#8c64d8",height: "56px"}} > 
                <nav class="navbar navbar " style={{color:"#ffffff"}} >
                    <div class="container-fluid">
                        <a class="navbar-brand " href="#" style={{color:"#ffffff"}}>Тесты</a>
                        <button class="navbar-toggler btn btn-light"  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrollingLabel" aria-controls="offcanvaskNavbar" aria-label="Toggle navigation" >
                            <span class="navbar-toggler-icon "> </span>
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
                                <Link to={`/${routerParams.chatid}/course`} class="nav-link" href="#">Мой профиль</Link>
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
                                                <input ref={feedbackRef} className="form-control" placeholder="Введите ваш отзыв" ></input>
                                            </Modal.Body>
                                            <Modal.Footer>
                                            <button className="btn"  style={{background:"#8c64d8", color:"#FFFFFF"}} onClick={handleClose}>Закрыть</button>
                                                <button className="btn" type="submit" style={{background:"#8c64d8", color:"#FFFFFF"}} id="feedbackID" onClick={feedback} >
                                                        Отправить
                                                </button>
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
            <div className="row">
                <img src="https://nethammer.online/images/logo.png" alt=""/>
            </div>
            {
                subject.map((s) => (
                    <div className="d-grid mt-3" style={{width:""}}>
                    
                    <div className="btn p-2 mb-3 " style={shadowButton} type="button" data-bs-toggle='collapse' data-bs-target={`#${s.title.replace(' ', '')}`} aria-expanded="false" aria-controls='collapseExample'>
                        <div className="container-md">
                            <a className="navbar-brand text-center" href="#">{s.title}</a>
                        </div>
                    </div>
                    <div className="collapse" id={s.title.replace(' ', '')}>
                        <div className="card card-body" style={{background:""}}>
                            {
                                test.map((t) => (
                                    <div className="row ">
                                                {t.complete == true
                                                ?
                                                    <>
                                                    {s.id == t.subject_id &&
                                                        <Link to={`/${routerParams.chatid}/quiz/${t.id}/${t.title}`} className="btn d-grid mt-2" style={{background: '#8c64d8', color: "#ffffff",opacity:"70%"}}>
                                                            {t.title} 
                                                        </Link>}
                                                        </>
                                                        
                                                :
                                                    <>
                                                    {s.id == t.subject_id &&
                                                        <Link to={`/${routerParams.chatid}/quiz/${t.id}/${t.title}`} className="btn d-grid mt-2" style={{background:"8c64d8",color:"#8c64d8",border:"2px solid"}}>
                                                        {t.title} 
                                                        </Link>}
                                                    </>
                                                }
                                            
                                        

                                    
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    </div>
                ))
            }

        
      </div>
      )
  }
  export default Main