import { useEffect, useState } from "react"
const InputDuration = ({first, handleDuration, setDurationIndex}) => {
    useEffect(()=>{
      setDurationIndex(first);
    },[]);
    return (
        <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }}>
            <input type="text" className="text-white bg-transparent outline-none" style={{ border: "solid 0px black" }} defaultValue={first} onChange={(e) => { handleDuration(e.target.value) }} />
        </div>

    )
}
export default InputDuration