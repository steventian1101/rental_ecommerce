import Header from "../components/navbar"
import { useRouter } from "next/router"
import Search from "../components/home/search";
import { use, useEffect, useState } from "react";
export default function IndexPage() {
  const [login, setLogin] = useState(false);
  const router = useRouter();
  const { query } = router.query;
  const link = router.pathname;
  const [search, setSearch] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", detectScroll);
    return () => {
      window.removeEventListener("scroll", detectScroll);
    }
  });
  const detectScroll = () => {
    if (window.pageYOffset >= 300) {
      setSearch(true);
    }
    if (window.pageYOffset < 300) {
      setSearch(false);
    }
  }
  useEffect(()=>{
        if(router.query.login == "true"){
          setLogin(true)
        }
  },[router.query?.login])
  
  return (
    <>
      <Header login = { login } setLogin={ setLogin} search={search}/>
      {
         query && <Search searchText = {query} setLogin={ setLogin} />
      }
      {
        link &&  !query &&  <Search searchText = {""} setLogin={ setLogin}/>
      }
      
    </>
  )
}
