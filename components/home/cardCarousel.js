import { useState, useEffect, useRef, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { doc, deleteDoc} from "firebase/firestore";
import { db } from "../../lib/initFirebase";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../auth/loading";

const CardCarousel = ({ imgArray, timeduration, id, location }) => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [imgStyle, setImgStyle] = useState([]);
    const [drawImg, setDrawImg] = useState([]);
    const [touchPosition, setTouchPosition] = useState(null);
    const [indicatorPan, setIndicatorPan] = useState([]);
    const [width, setWidth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('');
    const [onDuration, setOnDuration] = useState(false);
    useEffect(()=>{
        if (typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("geo")) {
            if(localStorage.getItem("geo") == "true"){
                setOnDuration(true)
            }
            else{
                setOnDuration(false);
            }
           
        } else {
            setOnDuration(false)
        }
    },[])
    const handleTouchStart = (e) => {
        const touchDown = e.touches[0].clientX
        setTouchPosition(touchDown);
    }
    const temp = [];
    const imgRef = useRef();
    useEffect(() => {
        for (let k in imgArray) {
            temp.push(<img src={imgArray[k]} className="carousel_img" ref={imgRef} key={k} />);
        }
        setDrawImg(temp);
        getTime(location)
    }, [id])
    const getTime = (location) =>{
        let key = JSON.stringify(location);
        let address = localStorage.getItem(key);
        if(address){
            setDuration(address)
        }
        
    }
    const handlePrev = () => {
        if (index == imgArray.length - 1) {
            return;
        }
        setIndex(index + 1);
        setDirection(2)
    }
    const handleNext = () => {
        if (index == 0) {
            return;
        }
        setIndex(index - 1);
        setDirection(1);
    }
    useEffect(() => {
        imgRef.current && drawCarousel();
        drawDot();
    }, [index]);
    const drawCarousel = () => {
        let width = imgRef.current.clientWidth;
        if (direction == 2) {
            let style = {
                transform: `translateX(${-width * (index)}px)`,
                transition: '0.5s'
            }
            setImgStyle(style);
        }
        if (direction == 1) {
            let style = {
                transform: `translateX(${-width * (index)}px)`,
                transition: '0.5s'
            }
            setImgStyle(style);
        }
    }
    useEffect(() => {
        window.addEventListener("resize", getListSize);
        return () => {
            window.addEventListener("resize", getListSize);
        }
    }, [imgRef.current?.clientWidth]);
    const getListSize = () => {
        imgRef.current && imgRef.current.clientWidth && setWidth(imgRef.current.clientWidth);
    }
    const handleTouchMove = (e) => {
        const touchDown = touchPosition;
        if (touchPosition === null) {
            return;
        }
        const currentTouch = e.touches[0].clientX;
        const diff = touchDown - currentTouch;

        if (diff > 50) {
            handlePrev();
            setTouchPosition(null);
        }
        if (diff < -50) {
            handleNext();
            setTouchPosition(null);
        }
    }
    useEffect(() => {
        imgRef.current && width && drawCarousel();
    }, [width]);
    const drawDot = () => {
        const temp = [];
        for (let i = 0; i < imgArray.length; i++) {
            if (i == index) {
                temp.push(<div className="indicator current" onClick={() => setIndex(i)} key={i}></div>)
            }
            else {
                temp.push(<div className="indicator" onClick={() => setIndex(i)} key={i}></div>);
            }
        }
        setIndicatorPan(temp)
    }
    return (
        <>
        {
            loading?<Loading/>:<></>
        }
        <div className="relative overflow-hidden cursor-pointer carousel" onTouchStart={(e) => handleTouchStart(e)} onTouchMove={(e) => handleTouchMove(e)} >
            <div className="absolute z-30 flex flex-row justify-center w-full bottom-4">
                {
                    indicatorPan
                }
            </div>
            <button id="prev" type="button" style={{ position: "absolute", left: "0px", width: "40px", height: "100%", background: "transparent  ", zIndex: "100" }} onClick={() => { handleNext() }}></button>
            <button id="next" type="button" style={{ position: "absolute", right: "0px", width: "40px", height: "100%", background: "transparent", zIndex: "100" }} onClick={() => {
                handlePrev()
            }}></button>
           <Link href={`/item?id=${id}`}> <div style={imgStyle} className="flex w-full h-full" >
                {drawImg}
            </div></Link>
            {
                onDuration && <div className="absolute top-2 right-2">
                {
                     duration ? <div className="flex flex-row items-center w-auto px-2 py-2 bg-black rounded-md">
                    <img src = "/logo/runner.svg" className="w-auto h-4 mr-2"/>
                    <p className="text-white font-15">{duration}</p>
                </div>:<div className="flex flex-row items-center w-auto px-2 py-2 bg-black rounded-md">
                    <img src = "/logo/runner.svg" className="w-auto h-4 mr-2"/>
                    <p className="text-white font-15">Not working</p>
                </div>
                }
            </div>
            }
        </div>
        </>
    )
}
export default CardCarousel