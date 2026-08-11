import React from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import useHook from '../hooks/useHook'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from './Loader'


const Register = () => {
    
    const {name,setName,roll,setRoll,phone,setPhone,password,setPassword,confirm,setConfirm,img,setImg,email,setEmail,loading,setLoading} = useHook()

    async function register(e){
        e.preventDefault()

       if(!name || !roll ||!email || !phone || ! password || !confirm)
       {
            toast.error('Fill all the fields !')
            return
       }
       else{

        if(password!==confirm)
        {
            toast.error("password doesn't match")
            return
        }

            const formData = new FormData()
            formData.append('name',name.toLowerCase().trim())
            formData.append('roll',roll.toLowerCase().trim())
            formData.append('email',email.toLowerCase().trim())
            formData.append('phone',phone)
            formData.append('password',password.trim())
            formData.append('img',img)
            setLoading(true)
            const res = await axios.post('https://student-backend-fe9r.onrender.com/users/register',formData)
            setLoading(false)
            if(res.data.status)
            {
                toast.success(res.data.message)
                setName('')
                setRoll('')
                setPhone('')
                setEmail('')
                setPassword('')
                setConfirm('')
                setImg(null)
            }
            else{
                toast.error(res.data.message)
            }
       }
    }
    
    return (
    <>
      <div className="container">
        <form className='form' onSubmit={register} >
            <h2>Sign up</h2>
            <input type="text" placeholder='name' value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="text" placeholder='roll' value={roll} onChange={(e)=>setRoll(e.target.value)} />
            <input type="text" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="number" placeholder='phone' value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <input type="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            <input type="password" placeholder='confirm password' value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
            <input type="file" onChange={(e)=>setImg(e.target.files[0])} />
            <button type='submit'>{loading? "Registering...":"Register Now"}</button>
            <p>Already have acc? <Link to='/' >Sign in</Link> </p>
        </form>
      </div>
    </>
  )
}

export default Register
