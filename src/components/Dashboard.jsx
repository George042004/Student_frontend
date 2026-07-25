import axios from "axios"
import useHook from "../hooks/useHook"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import './styles.css'

const Dashboard = ()=>{

    const {data,setData,loading,setLoading,password,setPassword} = useHook()
    const [option,setOption] = useState('profile')
    const [password1,setPassword1] = useState('')
    const [password2,setPassword2] = useState('')

    const navigate = useNavigate()

    async function getData(){
        setLoading(true)
        const token = localStorage.getItem('token')
        const res = await axios.get('https://student-backend-fe9r.onrender.com/users/getdata',{
            headers:{
                Authorization: `Bearer ${token}`
                
            }
        })
        if(res.data.status)
        {
            setData([res.data.message])
            setLoading(false)
        }

    }
    
    function logout(){
        localStorage.removeItem('token')
        toast.success('Logged out')
        navigate('/')
    }

    async function changepass() {

        if(!password || !password1 || !password2)
        {
            toast.error('Fill all the fileds!')
            return
        }
        if(password1.trim() !== password2.trim())
        {
            toast.error("new password must be same")
            return 
        }
        const token = localStorage.getItem('token')
        const res = await axios.post('https://student-backend-fe9r.onrender.com/users/resetpass',{password,password1},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        if(res.data.status)
        {
            toast.success(res.data.message)
            setPassword('')
            setPassword1('')
            setPassword2('')
            return
        }
        toast.error(res.data.message)
    
    }

    useEffect(()=>{
        getData()
    },[])

    return(
        <div className="dashboard-bg">
            {
                loading? <h1>Loading..</h1>:
                data.map((d)=>{
                    const imgurl = d.img.startsWith('http')?d.img: `http://localhost:1234/${d.img}`
                    return(
                        <div className="maindiv">
                        <nav key={d.roll} className="stdnavbar">
                            <h2>{(d.name.charAt(0).toUpperCase()+d.name.slice(1).toLowerCase())}</h2>
                            <div>
                                <div>
                                    <p>{d.roll.toUpperCase()}</p>
                                    <button onClick={()=>logout()}>Logout</button>
                                </div>
                                <img src={imgurl} alt="profile" />
                            </div>
                        </nav>

                        <div className="buttons">
                            <button onClick={()=>setOption('profile')}>profile</button>
                            <button onClick={()=>setOption('reset')}>Update password</button>
                        </div>

                        {
                            option === "profile"?
                                <div className="profile">
                                    <p>Name: {(d.name.charAt(0).toUpperCase()+d.name.slice(1).toLowerCase())}</p>
                                    <p>Roll: {d.roll.toUpperCase()}</p>
                                    <p>Email: {d.email}</p>
                                    <p>Phone: {d.phone}</p>
                                </div>
                                :
                            <div className="resetpassword">
                                <h2>Reset Password</h2>
                                <input type="password" placeholder="old password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                                <input type="password" placeholder="new password" value={password1} onChange={(e)=>setPassword1(e.target.value)} />
                                <input type="password" placeholder="confirm password" value={password2} onChange={(e)=>setPassword2(e.target.value)} />
                            <button onClick={changepass}>Reset Password</button>
                        </div>
                        }
                    </div>
                    )
                })
            }
        </div>
    )
}

export default Dashboard
