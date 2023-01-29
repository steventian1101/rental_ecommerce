import Header from "../components/navbar"
import RentalOwner from "../components/rentalOwner"
import { useRouter } from "next/router"
import { useState } from "react";

export default function RentalOwnerPage () {
    const [login, setLogin] = useState(false);
    const router = useRouter();
    console.log(router)
    const { id } = router.query;
    console.log(id)
    return(
        <>
        <Header search={true} setLogin={setLogin} login={login}/>
         <RentalOwner id={id} setLogin={setLogin}/>
        </>
    )
}