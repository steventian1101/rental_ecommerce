import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
const DetailLoading = () =>{
    return(
        <section className="fixed top-0 right-0 z-50 bg-white detail">
            <div className="relative">
            <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white"/></div>
            </div>
        </section>
    )

}
export default DetailLoading