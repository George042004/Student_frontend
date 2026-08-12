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
    const [req,setReq] = useState('')

    const navigate = useNavigate()
    const formData = new FormData()

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
        setLoading(true)
        const res = await axios.post('https://student-backend-fe9r.onrender.com/users/resetpass',{password,password1},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        setLoading(false)

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

    // async function uploadresume(e){
    //     e.preventDefault()
    //     const token = localStorage.getItem('token')
    //     if(!formData.get("resume"))
    //     {
    //         toast.error("select resume file to add!")
    //         return 
    //     }
    //     else{
    //         setloading(true)
    //         const res = await axios.post('https://student-backend-fe9r.onrender.com/resumes/uploadresume',formData,{
    //             headers:{
    //                 Authorization: `Bearer ${token}`,
    //             }
    //         })
    //         setloading(false)
    //         if(res.data.status)
    //         {
    //             toast.success(res.data.message)
    //         }
    //         else{
    //             toast.error(res.data.message)
    //         }   
    //     }

    // }

    async function sendreq(event,name,roll,email,phone){
        event.preventDefault()
        if(!req.trim())
        {
            toast.error("Enter your request!")
            return 
        }
        const token = localStorage.getItem('token')
        setLoading(true)
        const res = await axios.post('https://student-backend-fe9r.onrender.com/request/',{
            name,roll,email,phone,request:req 
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        setLoading(false)

        if(res.data.status)
        {
            toast.success(res.data.message)
        }
        else{
            toast.error(res.data.message)
        }
    }


    useEffect(()=>{
        getData()
    },[])

    return(
        <div className="dashboard-bg">
            {
                loading? <h1>Loading..</h1>:
                data.map((d)=>{
                    return(
                        <div className="maindiv">
                        <nav key={d.roll} className="stdnavbar">
                            <h2>{(d.name.charAt(0).toUpperCase()+d.name.slice(1).toLowerCase())}</h2>
                            <div>
                                <div>
                                    <p>{d.roll.toUpperCase()}</p>
                                    <button onClick={()=>logout()}>Logout</button>
                                </div>
                                <img src={d.img?d.img:''} alt="profile" />
                            </div>
                        </nav>

                        <div className="buttons">
                            <button onClick={()=>setOption('profile')}>profile</button>
                            <button onClick={()=>setOption('reset')}>Update password</button>
                            <button onClick={()=>setOption('permission')}>Permission request</button>
                            {/* <button onClick={()=>setOption('resume')}>Resume</button> */}
                        </div>

                        {
                            option === "profile" &&
                                <div className="profile">
                                    <p>Name: {(d.name.charAt(0).toUpperCase()+d.name.slice(1).toLowerCase())}</p>
                                    <p>Roll: {d.roll.toUpperCase()}</p>
                                    <p>Email: {d.email}</p>
                                    <p>Phone: {d.phone}</p>
                                </div>
                        }
                         {
                         option === "reset" &&
                         <div className="resetpassword">
                                <h2>Reset Password</h2>
                                <input type="password" placeholder="old password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                                <input type="password" placeholder="new password" value={password1} onChange={(e)=>setPassword1(e.target.value)} />
                                <input type="password" placeholder="confirm password" value={password2} onChange={(e)=>setPassword2(e.target.value)} />
                            <button onClick={changepass}>{loading? (<><Loader /> Resetting...</>):"Reset Password"}</button>
                        </div>
                        }
                        {/* {
                            option === "resume" && 
                            <div className="resume-div">
                                <input type='file' accept=".pdf" className="resumeinput" placeholder="Upload Resume" onChange={(e)=>formData.append("resume",e.target.files[0])} />
                                <button onClick={uploadresume} className="resumebutton">{loading? (<>{<Loader />} Uploading...</>):"Upload Resume"}</button>
                            </div>
                        } */}

                        {
                            option === 'permission' &&
                            <div className="permission">
                                <h2>Permission</h2>
                                <textarea id="" placeholder="Type reason.." value={req} onChange={(e)=>setReq(e.target.value)}></textarea>
                                <button onClick={(e)=>sendreq(e,d.name,d.roll,d.email,d.phone)} disabled={loading}>{loading?"Sending..":"send request"}</button>
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
