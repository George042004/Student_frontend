import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useHook from '../hooks/useHook'
import toast from 'react-hot-toast'
import axios from 'axios'

const Login = () => {

    const {roll,setRoll,password,setPassword} = useHook()

    const navigate = useNavigate()

    async function login(e) {
        e.preventDefault()

        if(!roll || !password)
        {
            toast.error('Fill the fields !')
        }
        else{
            const res = await axios.post('https://student-backend-fe9r.onrender.com/users/login',{roll:roll.toLowerCase().trim() ,password:password.trim()})
            if(res.data.status)
            {
                localStorage.setItem('token',res.data.token)
                setRoll('')
                setPassword('')
                toast.success(res.data.message)
                if(roll.toLowerCase().trim() === '23me1a5490' || roll.toLowerCase().trim() === 'georgemullarm045@gmail.com')
                {
                    navigate('/admin/dashboard')
                    return
                }
                navigate('/dashboard')
            }
            else{
                toast.error(res.data.message)
            }
        }
    }

  return (
    <>
      <div className="container">
        <form className='form' onSubmit={login} >
            <h2>Sign in</h2>
            <input type="text" placeholder='roll/email' value={roll} onChange={((e)=>setRoll(e.target.value))} />
            <input type="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button type='submit'>Sign in</button>
            <p>forgot password? <Link to='/resetpassword' >reset password</Link> </p>
            <p>No acc? <Link to='/register' >register</Link> </p>
        </form>
      </div>
    </>
  )
}

export default Login
