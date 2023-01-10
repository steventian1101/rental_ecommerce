import Header from "../components/navbar"
import { useRouter } from "next/router"
import Search from "../components/home/search";
import { useEffect, useState } from "react";
export default function IndexPage() {
  const [searchText, setSearchText] = useState('');
  const [login, setLogin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if(router.query.query == undefined){
      setSearchText('');
    }
    if(router.query.query){
      setSearchText(router.query.query)  
    }
  }, [router.query?.query])
  return (
    <>
      <Header login = { login } setLogin={ setLogin}/>
      <Search searchText = {searchText} setLogin={ setLogin}/>
    </>
  )
}
