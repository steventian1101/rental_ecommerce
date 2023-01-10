const DetailReview = ({src, username, date, content}) => {
    return (
        <div className="flex flex-row items-start w-full">
            <div className="detailReviewAvatar">
                <img src={src} className="object-cover w-full h-full" style={{ borderRadius: "100px" }} />
            </div>
            <div className="flex flex-col" style={{width:"80%"}}>
                <div className="flex flex-row" style={{ marginBottom: "5px" }}>
                    <p className="bold font-15" style={{ paddingRight: "10px", borderRight: "solid 1px #ffffff1a" }}>{username}</p>
                    <p className=" font-15" style={{ paddingLeft: "10px" }}>{date}</p>
                </div>
               <p className="text-white font-15">
              {content}
               </p>
            </div>

        </div>
    )

}
export default DetailReview