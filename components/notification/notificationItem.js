const NotificationItem = () =>{
       return(
        <div className="flex flex-row items-start notificationItem">
            <div style={{ width:"30px", height:"30px", background:"#e39457", borderRadius:"100px", marginRight:"15px"}} className="flex items-center justify-center">
                <img src='/logo/blacklogo.svg' />
            </div>
            <div className="flex flex-col" style={{ width:"255px"}}>
                <p className="text-white" style={{ fontSize:"15px", marginBottom:"5px"}}>Nicki has requested to rent your Ferrari Italia 458</p>
                <p className="text-white" style={{fontSize:"12px", lingHeight:"15px", opacity:"0.7" }}>Sent 1 min ago</p>
            </div>
        </div>
       )
}
export default NotificationItem