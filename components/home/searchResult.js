import Itemcard from "./itemcard"
import { useInfiniteHits} from 'react-instantsearch-hooks-web'
const SearchResult = ({ setItemID}) =>{
    const {   hits,
        currentPageHits,
        results,
        isFirstPage,
        isLastPage,
        showPrevious,
        showMore,
        sendEvent } = useInfiniteHits();
    return(
        <div className="flex flex-row flex-wrap justify-center searchResult">
             {
                    hits && hits.length > 0 && hits.map((hit, index) => (
                        <Itemcard details={hit} key={index} setItemID={ setItemID}/>
                    ))
                }
        </div>
        )

}
export default SearchResult