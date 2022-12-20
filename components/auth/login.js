import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
const Login = ({ setSideBar, setEmail, setPassword, email, password }) =>{
    const handleLogin = () =>{
        console.log(email,password);
    }
    return(
        <section className="login">
        <div style={{ height: "50px", marginBottom: "10px" }} className="flex flex-row items-center cursor-pointer"><FontAwesomeIcon icon={faArrowLeftLong} className="text-2xl text-white"  onClick={ () =>setSideBar(0)}/></div>
        <p className="loginText">LOGIN.</p>
        <div className="loginTextBack"></div>
        <p className="loginDetail">Login to Sydney's largest rental platform</p>
        <button className="flex flex-row items-center justify-center w-full text-white rounded-lg" style={{ fontSize: "15px", fontFamily: "poppins-light", border: "solid 1px #ffffff4d", height: "45px" }} ><img src="https://uploads-ssl.webflow.com/5efdc8a4340de947404995b4/638da718ba38ef5f02dcb35a_google.svg" style={{ marginRight: "10px" }} />Login With Google</button>
        <div className="flex flex-row items-center justify-between my-5 mb-5">
            <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
            <p style={{ fontSize: "15px", fontFamily: "poppins-light", color: "white" }}>OR</p>
            <div style={{ width: "100px", height: "1px", background: "#ffffff4d" }}></div>
        </div>
        <div className="flex flex-col loginForm">
            <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Email Address</p>
            <input type="email" className="w-full emailInput focus:bg-transparent" placeholder="E.g.johndoe@gmail.com" onChange={(e) =>{ setEmail(e.target.value)}} />
        </div>
        <div className="flex flex-col loginForm">
            <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px" }} className="text-white">Password</p>
            <input type="password" className="w-full emailInput" placeholder="Min 8 Characters" onChange={(e) =>{setPassword(e.target.value)}}/>
        </div>
        <div className="loginButton">
            <button className="flex items-center justify-center" onClick = {()=>{ handleLogin(email, password)}}>LOGIN</button>
        </div>
        <div><p className="text-white cursor-pointer hover:underline" onClick = { ()=>{setSideBar(2)}} style={{ fontFamily: "poppins-light", marginBottom: "3px", fontSize: "15px" }} >Don't have an account? Sign up here.</p></div>
        <div>
            <p className="text-white cursor-pointer hover:underline" onClick = { ()=>{setSideBar(3)}} style={{ fontFamily: "poppins-light", fontSize: "15px" }}>Forgot your password? Reset it here.</p></div>
    </section>

    )
}
export default Login