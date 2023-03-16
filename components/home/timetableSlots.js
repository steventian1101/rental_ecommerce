
  const time = [
   "12:00 AM",
   "01:00 AM",
   "02:00 AM",
   "03:00 AM",
   "04:00 AM",
   "05:00 AM",
   "06:00 AM",
   "07:00 AM",
   "08:00 AM",
   "09:00 AM",
   "10:00 AM",
   "11:00 AM",
   "12:00 PM",
   "1:00 PM",
   "2:00 PM",
   "3:00 PM",
   "4:00 PM",
   "5:00 PM",
   "6:00 PM",
   "7:00 PM",
   "8:00 PM",
   "9:00 PM",
   "10:00 PM",
   "11:00 PM",
];
import { useState, useEffect } from "react";
const TimetableSlots = ({ firstTime, handleTime}) =>{
   const [start, setStart] = useState(0)
   useEffect(()=>{
       setStart(firstTime)
   },[firstTime])
   return(
      time.map((time, index) => (
         index+1 > start && <p className="w-full px-2 py-1 text-white time" onClick={() => { handleTime(index) }} key={index}>{time}</p>
       ))
   )
}
export default TimetableSlots