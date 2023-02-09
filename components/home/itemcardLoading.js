const ItemcardLoading = () =>{
   return(
    <div className="ownerItemcard">
            <div className="carousel">
                <div className="w-full h-full detail-loading"></div>
            </div>
            <div className="flex flex-row items-center justify-between my-4">
                <div style={{ width: "40px", height: "40px", borderRadius: "100px" }} className="detail-loading"></div>
                <div style={{ width: "85%" }} className="flex flex-col justify-start">
                    <div style={{ width: "90%", height: "20px", marginBottom: "10px" }} className="detail-loading"></div>
                    <div style={{ width: "70%", height: "20px" }} className="detail-loading"></div>
                </div>
            </div>
        </div>
   ) 
}
export default ItemcardLoading