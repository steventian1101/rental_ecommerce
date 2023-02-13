import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Login from '../components/auth/login';
import Register from '../components/auth/register';
import ResetPassword from '../components/auth/resetPassword';
import Search from '../components/home/search';
import Header from '../components/navbar';
import SidebarBack from '../components/sidebarBack';
import Detail from '../components/home/detail';
import HomeBack from '../components/home/homeBack';

const Page = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { id } = router.query;
    const [sideBar, setSideBar] = useState(null);
    useEffect(() => {
        console.log(slug)
        if (slug == 'login') {
            setSideBar(<Login />)
        }
        if (slug == 'register') {
            setSideBar(<Register />)
        }
        if (slug == 'resetPassword') {
            setSideBar(<ResetPassword />)
        }
        if(slug == 'item'){
            setSideBar(<Detail id ={ id }/>)
        }
        if(slug == null){
            setSideBar(null)
        }
    }, [slug, id])

    return (
        <>
            {
                      sideBar
            }
            <Header/>
            <Search searchText = {typeof window !== "undefined" && "localStorage" in window &&   localStorage.getItem("searchText")?localStorage.getItem("searchText"):""}/>
            <HomeBack/>
        </>
    );
};

export default Page;