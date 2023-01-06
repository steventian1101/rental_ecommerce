import Header from "../components/navbar"
import { useRouter } from "next/router"
import Search from "../components/home/search";
export default function IndexPage() {
  const router = useRouter();
  return (
    <>
      <Header/>
      <Search/>
    </>
  )
}
