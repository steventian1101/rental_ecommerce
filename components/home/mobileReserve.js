import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import Calendar from 'react-calendar';
import { useEffect, useState } from "react"
const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
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
]
const MobileReserve = ({ content, ownerData, durationIndex, setUpdateMobileSidebar, value, setValue, disabledDates, setDurationIndex, date, startTime, setStartTime, tempDuration, setTempDuration }) => {
    const [calendarDisplay, setCalendarDisplay] = useState(false);
    const [displayTimetable, setDisplayTimetable] = useState(false);
    const [tempValue, setTempValue] = useState(null);
    const [tempStartTime, setTempStartTime] = useState(null);
    const [duration, setDuraion] = useState(null);
    const [tempdate, setTempdate] = useState(null);
    useEffect(() => {
        setTempdate(tempValue)
        setCalendarDisplay(false);
    },[tempValue]);
    const handleTime = (index) => {
        setStartTime(index)
        setDisplayTimetable(false);
    }
    useEffect(() => {
        setTempValue(value);
        setTempStartTime(startTime);
        setTempDuration(null);
        setTempdate(date);
    }, []);
    const handleUpdate = () =>{
        setStartTime(tempStartTime);
        setValue(tempValue);
        setTempDuration(duration);
        setUpdateMobileSidebar(false);
        
    }
    return (
        <div className="fixed top-0 right-0 z-50 hidden w-full h-full bg-black stickyupdate" style={{ display: "", zIndex: "10001" }}>
            <div className="relative w-full">
                <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center w-full cursor-pointer" onClick={() => { setUpdateMobileSidebar(false) }}><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" /></div>
                <p className="mb-1 text-white font-18 bold">{content && content["item_name"]}</p>
                <p className="mb-2.5 font-15 text-white">{ownerData && ownerData[0]["nick_name"]}</p>
                <div className="w-full">
                    <p className="font-15">Start Date</p>
                    <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setCalendarDisplay(true) }}>
                        <p className="text-white font-15">{tempdate && tempdate.getDate() + " " + month[`${tempdate.getMonth()}`] + ", " + tempdate.getFullYear()}</p>
                        <FontAwesomeIcon icon={faCalendar} className="text-lg text-white" />
                    </div>
                    {
                        calendarDisplay && <div className="w-full top-8 ">
                            <Calendar onChange={setTempValue} value={tempValue} tileDisabled={({ date, view }) =>
                                (view === 'month') && disabledDates &&
                                disabledDates.some(disabledDate =>
                                    (date.getFullYear() === disabledDate.getFullYear() &&
                                        date.getMonth() === disabledDate.getMonth() &&
                                        date.getDate() === disabledDate.getDate()) || date < new Date()
                                )} defaultActiveStartDate={new Date()} />
                        </div>
                    }
                </div>
                <div className="my-2.5">
                    <p className="font-15 ">Start Time</p>
                    <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }} onClick={() => { setDisplayTimetable(true) }}>
                        <p className="text-white font-15">{time[tempStartTime]}</p>
                        <FontAwesomeIcon icon={faClock} className="text-lg text-white" />
                    </div>
                    {
                        displayTimetable && <div className="flex flex-col bg-white" style={{ background: "#ffffff1a" }}>
                            {
                                time.map((time, index) => (
                                    <p className="w-full px-2 py-1 text-white time" onClick={() => { handleTime(index) }}>{time}</p>
                                ))
                            }

                        </div>
                    }
                </div>

                <div className="my-2.5">
                    {content && content.item_charge_rate == "person" ? <p className="font-15 ">Members</p> : <p className="font-15 ">Duration</p>}

                    <div className="relative flex flex-row items-center justify-between py-2" style={{ borderBottom: "solid 1px #ffffff1a" }}>
                        <input type="text" className="text-white bg-transparent outline-none" style={{ border: "solid 0px black" }} defaultValue={durationIndex} onChange={(e) => { setDuraion(e.target.value) }} />
                    </div>
                </div>

                <div className=" loginButton">
                    <button className="flex items-center justify-center" onClick={() => { handleUpdate() }}><p className="font-15 bold">UPDATE</p></button>
                </div>

            </div>
        </div>

    )

}
export default MobileReserve