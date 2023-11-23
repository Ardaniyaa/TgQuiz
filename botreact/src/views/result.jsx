import { Button } from "react-bootstrap"
import { Link, useNavigate, useParams } from 'react-router-dom'



function Result({wrongAnswer}){
    return(
        <div className="container" >
            <h1 className="text-center">Итог</h1>

        <div>
            <Link to={`/$/main`} class="btn fixed-bottom" style={{background:"#8c64d8",color:"#ffffff"}}>Вернуться к тестам</Link>
        </div>
        </div>
        
        
    )
}

export default Result