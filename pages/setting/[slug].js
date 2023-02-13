import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import Payment from '../../components/setting/payment';
import SidebarBack from '../../components/sidebarBack';
import Header from '../../components/navbar';
import Setting from '../../components/setting/setting';
import Location from '../../components/setting/location';
import Profile from '../../components/setting/profile';
const Page = () => {
    const [sideBar, setSideBar] = useState(null)
    const router = useRouter();
    const { slug } = router.query;
    useEffect(() => {
        if (slug == "payment") {
            setSideBar(<Payment />);
        }
        if (slug == "profile") {
            setSideBar(<Profile/>);
        }
        if (slug == "location") {
            setSideBar(<Location />);
        }

    }, [slug])

    return (
        <>
            {
                sideBar
            }
            <Header search={true} />
            <Setting />
            <SidebarBack />

        </>
    )
};

export default Page;    