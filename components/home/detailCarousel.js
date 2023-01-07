import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Loading from "../auth/loading";

const DetailCarousel = ({ imgArray}) => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [imgStyle, setImgStyle] = useState([]);
    const [drawImg, setDrawImg] = useState([]);
    const [touchPosition, setTouchPosition] = useState(null);
    const [indicatorPan, setIndicatorPan] = useState([]);
    const [width, setWidth] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleTouchStart = (e) => {
        const touchDown = e.touches[0].clientX
        setTouchPosition(touchDown);
    }
    const temp = [];
    const imgRef = useRef();
    useEffect(() => {
        for (let k in imgArray) {
            temp.push(<img src={imgArray[k]} className="w-full h-auto rounded-xl" ref={imgRef} key={k} />);
        }
        setDrawImg(temp);
    }, [])
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
        <div className="relative overflow-hidden carousel" onTouchStart={(e) => handleTouchStart(e)} onTouchMove={(e) => handleTouchMove(e)} >
            <div className="absolute z-30 flex flex-row justify-center w-full bottom-4">
                {
                    indicatorPan
                }
            </div>
            <button id="prev" type="button" style={{ position: "absolute", left: "0px", width: "40px", height: "100%", background: "transparent  ", zIndex: "100" }} onClick={() => { handleNext() }}></button>
            <button id="next" type="button" style={{ position: "absolute", right: "0px", width: "40px", height: "100%", background: "transparent", zIndex: "100" }} onClick={() => {
                handlePrev()
            }}></button>
            <div style={imgStyle} className="flex w-full h-auto">
                {drawImg}
            </div>

        </div>
        </>
    )
}
export default DetailCarousel