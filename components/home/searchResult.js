import Itemcard from "./itemcard"
import { useInfiniteHits } from 'react-instantsearch-hooks-web'
import { useEffect } from "react";
const SearchResult = ({ setItemID, searchText }) => {
    console.log("search result................", searchText)
    const { hits,
        currentPageHits,
        results,
        isFirstPage,
        isLastPage,
        showPrevious,
        showMore,
        sendEvent } = useInfiniteHits();
    useEffect(() => {
        console.log(hits)
    }, [hits]);
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    })
    const handleScroll = () => {
        if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
            showMore();
        }
    };
    return (
        <div className="flex flex-row flex-wrap justify-center searchResult">
            {
                hits && hits.length > 0 && hits.map((hit, index) => (
                    <Itemcard details={hit} key={index} setItemID={setItemID} />
                ))
            }
        </div>
    )

}
export default SearchResult