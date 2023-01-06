import Header from "../components/navbar"
import EditItem from "../components/owner/editItem"
import { useRouter } from "next/router"
export default function EditPage () {
    const router = useRouter();
     return(
        <>
        <Header/>
        <EditItem query={router.query}/>
        </>
     )
}