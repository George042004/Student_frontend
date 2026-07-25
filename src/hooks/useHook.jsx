import { useState } from "react";

function useHook(){

    const [name,setName] = useState('')
    const [roll,setRoll] = useState('')
    const [phone,setPhone] = useState('')
    const [password,setPassword] = useState('')
    const [confirm,setConfirm] = useState('')
    const [email,setEmail] = useState('')
    const [data,setData] = useState([])
    const [img,setImg] = useState(null)
    const [loading,setLoading] = useState(false)


    return{
        name,setName,
        roll,setRoll,
        phone,setPhone,
        password,setPassword,
        confirm,setConfirm,
        img,setImg,
        loading,setLoading,
        email,setEmail,
        data,setData
    }

}

export default useHook;