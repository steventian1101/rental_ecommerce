import { useState, useEffect } from "react"
import { InstantSearch } from "react-instantsearch-hooks-web"
import algoliasearch from 'algoliasearch/lite'
import SearchBox from "./searchBox"
import SearchResult from "./searchResult"
import Detail from "./detail"
import SidebarBack from "../sidebarBack"
const Search = ({searchText}) => {
    const [itemID, setItemID] = useState(null);
    const [detail, setDetail] = useState([]);
    const [sideBar, setSideBar] = useState([]);
    const searchClient = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
    );
    useEffect(()=>{
        itemID && itemID.length > 0 && drawDetail(itemID);
    },[itemID]);
    const drawDetail = () =>{
        setSideBar(<SidebarBack/>);
        setDetail(<Detail id={itemID} setSideBar= { setSideBar} setDetail={ setDetail} setItemID={ setItemID}/>)
    }
    return (
        <>
        {
            sideBar
        }
        {
            detail
        }
        <section className="search">
            <div className="relative title">
                <p className="text-white hometitle">RENT & ENJOY.</p>
                <div className="hometitleback"></div>
            </div>
            <p className="m-auto mb-6 text-lg font-light text-center text-white homeDetail" style={{ marginTop: "6px" }}>Explore Sydney's Largest Rental Directory.</p>
            <InstantSearch searchClient={searchClient} indexName='items'>
                <SearchBox searchText = {searchText?searchText:""}/>
                <SearchResult setItemID={setItemID}/>
            </InstantSearch>
        </section>
        </>
    )
 

}
export default Search