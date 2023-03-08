import { useState, useEffect } from "react"
const AuthInput = ({ title, placeholder, status, change, type, value, name, nickname}) => {
    const [ stringColor, setStringColor] = useState('');
    const [ inputborder, setInputBorder] = useState('');
    useEffect(()=>{
        if(status === false){
            setStringColor("#f66");
            setInputBorder("#f66")
        }
        else{
            setStringColor("");
            setInputBorder("");

        }
    },[status])
    useEffect(()=>{
     change(value)
    },[value])
    return (
        <div className="flex flex-col loginForm">
            <p style={{color:stringColor}} className="text-white font-15">{title}</p>
            <input type={ type} className="w-full emailInput focus:bg-transparent" placeholder={ placeholder } style={{ borderColor:inputborder}} onChange={(e)=>{change(e.target.value)}} defaultValue={value} name={name} id ={name}/>
        </div>
    )

}
export default AuthInput