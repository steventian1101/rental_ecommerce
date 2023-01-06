import { useState, useEffect} from "react";

const Textarea = ({title, placeholder, status, change, type, value}) => {
    const [ stringColor, setStringColor] = useState('');
    const [ inputborder, setInputBorder] = useState('');
    const [desc, setDesc] = useState(null);
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
     setDesc(value)
    },[value])
    return (
        <div>
            <p className="text-white" style={{ fontSize: "15px", color: stringColor }}>{title}</p>
            <textarea className="w-full bg-transparent outline-none" rows="7" placeholder={placeholder} style={{ borderColor: inputborder }} onChange={(e) => change(e.target.value)} defaultValue={desc} />
        </div>
    )

}
export default Textarea