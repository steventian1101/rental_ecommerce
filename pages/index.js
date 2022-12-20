import Header from "../components/navbar"
import { useRouter } from "next/router"
export default function IndexPage() {
  const router = useRouter();
  return (
    <>
    <Header/>
    </>
  )
}
