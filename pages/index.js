import Header from "../components/navbar"
import { useRouter } from "next/router"
import Search from "../components/home/search";
import { useEffect, useState } from "react";
export default function IndexPage() {
  const [login, setLogin] = useState(false);
  const router = useRouter();
  const { query } = router.query;
  // useEffect(() => {
  //   if(router.query.query == undefined){
  //     console.log("udefined")
  //     setSearchText("");
  //   }
  //   if(router.query.query){
  //     console.log("defined")
  //     setSearchText(router.query.query)  
  //   }
  // }, [router.query?.query]);
 const link = router.pathname;
 console.log(link)
  
  return (
    <>
      <Header login = { login } setLogin={ setLogin}/>
      {
         query && <Search searchText = {query} setLogin={ setLogin}/>
      }
      {
        link &&  !query &&  <Search searchText = {""} setLogin={ setLogin}/>
      }
      
    </>
  )
}
