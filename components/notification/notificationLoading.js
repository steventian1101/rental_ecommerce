const NotificationLoading = () =>{
       return(
        <div className="flex flex-row items-start cursor-pointer notificationItem">
            <div style={{ width:"30px", height:"30px", borderRadius:"100px", marginRight:"15px"}} className="flex items-center justify-center sidebar-loading">
            </div>
            <div className="flex flex-col" style={{ width:"255px"}}>
                <p className="text-white sidebar-loading" style={{ height:"60px", marginBottom:"5px"}}></p>
                <p className="w-32 h-5 text-white sidebar-loading"></p>
            </div>
        </div>
       )
}
export default NotificationLoading