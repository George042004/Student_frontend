import { useState } from 'react'
import useHook from '../hooks/useHook'
import './styles.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


const Resetpassword = ()=>{

    const {email,setEmail,password,setPassword} = useHook()
    const [otp,setOtp] = useState('')
    const [activate,setActivate] = useState(false)
    const [password1,setPassword1] = useState('')
    const [minutes,setMinutes] = useState(3)
    const [sec,setSec] = useState(59)
    const [timer, setTimer] = useState(false)

    const navigate = useNavigate()


    useEffect(()=>{
                 let counter = setInterval(()=>{

                    if(minutes===0 && sec===0)
                        {
                            clearInterval(counter)
                            setTimer(false)
                            return
                        }
                        if(!timer)
                        {
                            return
                        }
                             
                        if(sec===0)
                            {
                                setMinutes(prev => prev-1)
                                setSec(59)
                            }
                            else{
                                setSec(prev => prev-1)
                            }
                        },1000);
                        return()=>clearInterval(counter)
                        
                    },[timer,sec, minutes]) 


    async function sendotp(e){
        e.preventDefault()
        setSec(59)
        setMinutes(3)
        if(!email.trim())
        {
            toast.error('enter email')
            return
        }
        const res = await axios.post('https://student-backend-fe9r.onrender.com/users/otp',{
            email:email
        })

        if(res.data.status){
            setTimer(true)
            toast.success(res.data.message)       
        }
        else{
            toast.error(res.data.message)
        }
    }

    async function verify(e){
        e.preventDefault()
        setSec(59)
        setMinutes(3)
        if(!otp.trim())
        {
            toast.error('enter otp')
            return
        }
        const res = await axios.post('https://student-backend-fe9r.onrender.com/users/verify',{
            sentotp:otp, email:email
        })
        if(res.data.status){
           
            // localStorage.setItem('token',token)
            toast.success(res.data.message)
            // navigate('/dashboard')
            setActivate(true)
        }
        else{
            toast.error(res.data.message)
        }
    }

    async function changepass(e) {
        e.preventDefault()
        if(!password || !password1)
        {
            toast.error('Enter password')
            return
        }
        else if(password.trim()!==password1.trim())
        {
            toast.error("Password must match!")
        }
        else{
            const res = await axios.put('https://student-backend-fe9r.onrender.com/users/changepassword',{
                email:email, password:password
            })
            if(res.data.status)
            {
                toast.success(res.data.message)
                setEmail('')
                setOtp('')
                setPassword('')
                setPassword1('')
                navigate('/')
            }
            else{
                toast.error(res.data.message)
            }
        }
        
    }


   

    return(
        <div className='resetdiv'>
            <button className='back' title='back' onClick={()=>navigate('/')}>X</button>
            <form className="form">
                <h2>Reset password</h2>
                <div>
                <input type="email" placeholder="enter email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <button onClick={sendotp}>send otp</button>
                </div>
                <div>
                <input type="number" placeholder="enter otp"  value={otp} onChange={(e)=>setOtp(e.target.value)} />
                <button className='verify' onClick={verify} disabled={minutes===0 && sec===0}>Verify otp</button>
                </div>
                <input type="password" placeholder="new password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <input type="password" placeholder="confirm password" value={password1} onChange={(e)=>setPassword1(e.target.value)} />
                <p className='timer'>{minutes.toString().padStart(2,'0')}:{sec.toString().padStart(2,'0')}</p>
                <button className='changepassbut' disabled={!activate} onClick={changepass}>change password</button>
            </form>

        </div>
    )

}

export default Resetpassword