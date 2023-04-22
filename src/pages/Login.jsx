import React, { useState } from 'react'
import '../style.scss'
import { useNavigate,Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const Login = () => {



  const [err,setError] = useState(false)
  const navigate = useNavigate();

const handleSubmit= async(e)=>{


  e.preventDefault()

  const email = e.target[0].value;
  const password = e.target[1].value;

  try{
   
    await signInWithEmailAndPassword(auth, email, password)
    navigate("/")

  }
  catch(err){
    setError(true)
 console.log(err);
  }

}

  return (
    <div className='formContainer'>
    <div className="formWrapper">
        <span className='logo'>MERC</span>
        <span className='title'>Login</span>

        <form onSubmit={handleSubmit}>
            <input type="email" placeholder='email' required/>
            <input type="password" placeholder='password' pattern=".{8,}" required title="8 characters minimum"/>
            <button>Sign in</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
        {err && <span>Something Went Wrong</span>}
        
    </div>
</div>
  )
}

export default Login