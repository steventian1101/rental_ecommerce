import { useRouter } from "next/router";
const HomeBack = () =>{
    const handleClick = () =>{
       router.push('/')
    }
    const router = useRouter();
    return (
    <section>
        <div style={{ width:"100vw", height:"100%", position:"fixed", background:"black", opacity:"0.9", zIndex:"10000", top:"0px"}} onClick={handleClick}>
        </div>
    </section>);
}
export default HomeBack