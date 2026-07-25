import axios from 'axios'
import useHook from '../hooks/useHook'
import './styles.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AdminDashboard =()=>{

    const {data,setData,loading,setLoading,roll,setRoll,email,setEmail,phone,setPhone,name,setName} = useHook()
    const navigate = useNavigate()

    const [input,setInput] = useState('')
    const [page,setPage] = useState(1)
    const limit = 4
    const [totalpages,setTotalpages] = useState(1)
    const [sort,setSort] = useState('oldest')
    const [editoption,setEditoption] = useState('off')
    const [editroll, setEditroll] = useState('')

    async function getstudents(){
        setLoading(true)
        const token = localStorage.getItem('token')
        const res = await axios.get(`https://student-backend-fe9r.onrender.com/users/students?input=${input}&page=${page}&limit=${limit}&sort=${sort}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        // setPage(res.currpage)
        setData(res.data.message)
        setLoading(false)
        
        setTotalpages(res.data.totalpages || 1)
    }

    async function del(roll){
        let conf = confirm('delete student?')
        if(!conf)
        {
            return
        }
        const res = await axios.delete(`https://student-backend-fe9r.onrender.com/users/delete/${roll}`)
        console.log(res.data)
        if(res.data.status){
            toast.success(res.data.message)
            getstudents()
        }
        else{
            toast.error(res.data.message)
        }

    }

    async function edit(e,{roll,name,email,phone}){
        setEditoption('on')
        e.preventDefault()
        setEditroll(roll)
        setName(name)
        setEmail(email)
        setPhone(phone)

    }
    
    async function editstudents(e){
        e.preventDefault()
        const token = localStorage.getItem('token')
        const res = await axios.put('https://student-backend-fe9r.onrender.com/users/update',{roll:editroll, name, email, phone},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(res.data.status)
        {
            toast.success(res.data.message)
            getstudents()
            setEditoption('off')
        }
        else{
            toast.error(res.data.message)
        }
    }

    function logout(){
        localStorage.removeItem('token')
        toast.success('Logged out')
        navigate('/')
    }

    useEffect(()=>{
        const timer = setTimeout(()=>{
            getstudents()
            },500)

        return() => clearTimeout(timer)
    },[input,page,sort])

    return(
        <>
                <nav className="adminnav">
                    <select onChange={(e)=>setSort(e.target.value)}>
                        <option value="oldest">oldest</option>
                        <option value="newest">newest</option>
                        <option value="az">a-z</option>
                        <option value="za">z-a</option>
                    </select>
                    <div>
                        <input type="text" placeholder='search' value={input} onChange={(e)=>setInput(e.target.value)} />
                        <button className='adminlogout' onClick={()=>logout()}>Logout</button>
                    </div>
                </nav>

        { editoption==='on'?
                    <div className="container">
                        <button className='back' title='back' onClick={()=>setEditoption('off')}>X</button>
                        <form className='form' onSubmit={editstudents}>
                            <h2>Edit details</h2>
                            <input type="text" value={editroll}  disabled />
                            <input type="text" placeholder='name' value={name} onChange={(e)=>setName(e.target.value)} />
                            <input type="text" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
                            <input type="number" placeholder='phone' value={phone} onChange={(e)=>setPhone(e.target.value)} />
                            <button type='submit'>Update</button>
                        </form>
                    </div>
:
                    <div className='maindiv'>
                        {
                        loading? (<h1>Loading..</h1>):
                        !Array.isArray(data) || data.length===0? (<h1>No students found</h1>):
                        
                        
                        data.map((d)=>{
                            return(
                            <div key={d.roll} className='admincontent'>
                                <div className='leftright'>
                                    <div className='left'>
                                        <h1>{d.name}</h1>
                                        <p>{d.roll}</p>
                                        <p>{d.email}</p>
                                        <p>{d.phone}</p>
                                    </div>

                                    <div className='right'>
                                        <img src={d.img} alt="profile" />
                                    </div>

                                </div>
                                <div className="bottom">
                                    <button onClick={(e)=>edit(e,{roll:d.roll, name:d.name, email:d.email, phone: d.phone})} >Edit</button>
                                    <button onClick={()=>del(d.roll)}>Delete</button>
                                </div>
                            </div>
                        )
                    })
                    }
                        <footer>
                            <button onClick={()=>setPage(page-1)} disabled={page===1}>prev</button>
                            <p>page: {page}</p>
                            <button onClick={()=>setPage(page+1)} disabled={page===totalpages}>next</button>
                        </footer>
                    </div>}
        </>
    )

}

export default AdminDashboard