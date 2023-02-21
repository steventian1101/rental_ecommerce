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
  const [navbarSearch, setNavbarSearch] = useState('');
  useEffect(() => {
    window.addEventListener("scroll", detectScroll);
    return () => {
      window.removeEventListener("scroll", detectScroll);
    }
  });
  useEffect(()=>{
      localStorage.setItem('searchText',"");
      localStorage.setItem('loginNextUrl',"");
      localStorage.setItem('beforeAddPayment',"");
  },[])
  
  const detectScroll = () => {
    if (window.pageYOffset >= 300) {
      setSearch(true);
    }
    if (window.pageYOffset < 300) {
      setSearch(false);
    }
  }
  useEffect(()=>{
        setNavbarSearch(router.query.query)
  },[router.query?.query])
  
  return (
    <>
      <Header search={search} navbarSearch={navbarSearch}/>
      {
         query && <Search searchText = {query} setLogin={ setLogin} setNavbarSearch={setNavbarSearch}/>
      }
      {
        link &&  !query &&  <Search searchText = {""} setLogin={ setLogin} setNavbarSearch={setNavbarSearch}/>
      }
      
    </>
  )
}
