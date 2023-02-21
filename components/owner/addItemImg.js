import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { useState, useEffect } from "react";

const AddItemImg = ({ setSideBar, setProfileImgs, profileImgs }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [drawPreview, setDrawPreview] = useState([]);
    useEffect (()=>{
        setPreviewImages([]);
        setFiles([]);
         profileImgs && profileImgs.length > 0 &&  createBefore(profileImgs);
    },[])

    const handleComplete = () => {
        if (files.length != 0) {
            setSideBar(0);
            setProfileImgs(files);
        }   
    }
    const handlefile = (e) => {
        var src = URL.createObjectURL(e.target.files[0]);
        var temp = e.target.files[0];
        setPreviewImages([...previewImages, src]);
        setFiles([...files, temp]);
    }
    const createBefore = (profileImgs) =>{
        let tempImages = [];
        let tempFiles = [];
        for(let i in profileImgs ){
            var src = URL.createObjectURL(profileImgs[i]);
            var temp = profileImgs[i];
            tempImages = [...tempImages, src];
            tempFiles = [...tempFiles, temp];
        }

        setPreviewImages(tempImages);
        setFiles(tempFiles)
    }
    useEffect(() => {
        let temp = [];
        for (let i in previewImages) {
            temp.push(<div className="relative" key={i}> <img src={previewImages[i]} style={{ width: "100%", height: "180px", borderRadius: "8px", marginTop: "30px", objectFit: "cover" }} /><div className="absolute flex items-center justify-center cursor-pointer" style={{ top: "5%", right: "3%", width: "30px", height: "30px", borderRadius: "100px" }} onClick={() => { handleDelete(i) }}><FontAwesomeIcon icon={faCircleXmark} className="text-black fontIcon" style={{ fontSize: "20px" }} /></div></div>)
        }
        setDrawPreview(temp)
    }, [previewImages]);
    const handleDelete = (order) => {
        previewImages.splice(order, 1);
        setPreviewImages([...previewImages])
        files.splice(order, 1);
        setFiles([...files])
    }
    return (
        <section className="overflow-auto addItemImg">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white" onClick={() => setSideBar(0)} /></div>
            <p className="loginText">ADD YOUR ITEM'S PHOTOS</p>
            <p className="loginDetail">We've seen that items with better photos, generally gets more interest. Don't hold back!</p>
            <div className="relative flex flex-col items-center justify-center w-full" style={{ height: "180px", border: "1px solid #ffffff4a", borderRadius: "8px" }}>
                <div className="relative flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: "30px", color: "white" }} />
                    <p className="text-white">Add Profile Photo</p>
                </div>
                <input type="file" className="absolute flex w-full h-full opacity-0" onChange={(e) => handlefile(e)}></input>
            </div>
            <div style={{ marginTop: "30px", marginBottom: "30px", width: "100%", height: "1px", background: "#ffffff4a" }}></div>
            {
                drawPreview
            }
            <div className="loginButton">
                <button className="flex items-center justify-center" onClick={() => handleComplete()}>Complete</button>
            </div>
        </section>
    )
}
export default AddItemImg