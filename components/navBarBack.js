const NavBarBack = ({ setDrawbackground, setNotify}) =>{
    const handleClick = () =>{
        setDrawbackground(false);
        setNotify(false);
    }
    return (
    <section>
        <div style={{ width:"100vw", height:"100%", position:"fixed", background:"black", opacity:"0.9", zIndex:"100001", top:"0px"}} onClick={handleClick}>
        </div>
    </section>);
}
export default NavBarBack