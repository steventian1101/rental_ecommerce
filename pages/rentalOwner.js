import Header from "../components/navbar"
import RentalOwner from "../components/rentalOwner"
import { useRouter } from "next/router"
import { useState } from "react";

export default function RentalOwnerPage () {
    const [login, setLogin] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    return(
        <>
        <Header search={true} setLogin={setLogin} login={login}/>
         <RentalOwner id={id} setLogin={setLogin}/>
        </>
    )
}