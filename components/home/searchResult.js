import Itemcard from "./itemcard"
import { useInfiniteHits } from 'react-instantsearch-hooks-web'
import { useEffect } from "react";
import ItemcardLoading from "./itemcardLoading";
const SearchResult = ({ setItemID, searchText }) => {
    const { hits,
        currentPageHits,
        results,
        isFirstPage,
        isLastPage,
        showPrevious,
        showMore,
        sendEvent } = useInfiniteHits();
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    })
    const handleScroll = () => {
        if (((window.innerHeight + window.scrollY) == document.body.offsetHeight)) {
           hits &&  showMore();
        }
    };

    return (
        <>
        {
            hits && hits.length > 0
                ?
                    <div className="flex flex-row flex-wrap justify-center searchResult">
                        {
                            hits.map((hit, index) => (
                                <Itemcard details={hit} key={index} setItemID={setItemID} />
                            ))
                        }
                    </div>
                :
                    <div className="flex flex-row flex-wrap justify-center searchResult">
                        {
                            new Array(20).map(() => (
                                <ItemcardLoading />
                            ))
                        }
                    </div>
        }
        </>
    )

}
export default SearchResult