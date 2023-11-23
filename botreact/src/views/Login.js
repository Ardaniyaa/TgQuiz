import { wait } from "@testing-library/user-event/dist/utils"
import axios from "../axiosclient"
import { useEffect, useState, useRef} from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosClient from "../axiosclient"


function Login(){
  const first_nameRef=useRef()
  const last_nameRef=useRef()
  const emailRef=useRef()
  const phoneRef=useRef()
  const navigate = useNavigate()
  const routerParams = useParams()

  const [error, setError] = useState([])
  



  const onSubmit= async (ev) =>{
    ev.preventDefault()
    const payload={
      chat_id: routerParams.chatid,
      first_name: first_nameRef.current.value,
      last_name: last_nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value
    }
  
    axiosClient.post(`/createUser`, payload)
      .then(({data})=>{
        if (data == 'OK') {
          navigate(`/${routerParams.chatid}/main`);
        } else {
          setError(data)
        }
        
      })
              
  

  }

  return(
    <div className="container text-center">
      <div className="row">
        <img src="http://nethammer.online/images/logo.png" alt=""/>
      </div>
      <div className="row">
      <div>
      <label htmlFor="exampleFormControlInput1" className="form-label">Заполните форму, чтобы получить доступ к тестам.</label>
      </div>
      <label style={{color:"#f8021e"}}>{error.first_name_error}</label>
        <div className="mb-1 mt-3">
          <input ref={first_nameRef} htmlFor="validationCustom01" type="text" className="form-control" id="alidationCustom01" placeholder="Имя" required/>
        </div>
        <label style={{color:"#f8021e"}}>{error.last_name_error}</label>  
        <div className="mb-2 mt-3">
      <input ref={last_nameRef} type="text"  className="form-control" id="exampleFormControlInput2" placeholder="Фамилия"/>
          </div>
      <label style={{color:"#f8021e"}}>{error.email_error}</label>     
          <div className="mb-3 mt-3">
      <input ref={emailRef} type="email" className="form-control" id="exampleFormControlInput3" placeholder="@email(необязательно)"/>
        </div>
      <label style={{color:"#f8021e"}}>{error.phone_error}</label>   
        <div className="mb-4 mt-1">
      <input ref={phoneRef} type="number" className="form-control" id="exampleFormControlInput4" placeholder="Номер телефона(необязательно)"/>
      </div>
      </div>
      <div className="d-grid gap-2">
        <Link to={`/${routerParams.chatid}/main`} type="Submit" className="btn" onClick={ev => {onSubmit(ev)}} style={{background: '#8c64d8',color:"#ffffff"}}>Отправить</Link>
        
      </div>
    </div>   
  )
}
export default Login