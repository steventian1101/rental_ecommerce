import { useSearchBox, useInfiniteHits } from "react-instantsearch-hooks-web";
import { useCallback, useEffect, useState } from "react";
import { setIndexConfiguration } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";
const ItemNameSearchInput = ({ setId }) => {
    const { hits,
        currentPageHits,
        results,
        isFirstPage,
        isLastPage,
        showPrevious,
        showMore,
        sendEvent } = useInfiniteHits();
    const [value, setValue] = useState("");
    const [displayalgoliaresult, setDisplayalgoliaresult] = useState(false);
    const { userCredential } = useAuth();
    const memoizedSearch = useCallback((query, search) => {
        search(query);
    }, []);
    const { refine } = useSearchBox({
        queryHook: memoizedSearch,
    });
    const handleChange = (event) => {
        refine(event.target.value);
        setValue(event.target.value);
        setDisplayalgoliaresult(true)

    };
    const handleName = (any) => {
        setValue(any.item_name);
        refine(any.item_name);
        setId(any);
        setDisplayalgoliaresult(false)
    }
    useEffect(() => {
        console.log(hits)
        //  hits && hits.length > 0 && setDisplayalgoliaresult(true);
    }, [hits]);
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) { showMore() }
    }
    useEffect(() => {
        window.addEventListener("scroll", add);
        return () => {
            window.removeEventListener("scroll", add);
        }
    });
    const add = () => {
        if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
            console.log("pka")
            showMore();
        }
    };
    return (<>
        <div className="flex flex-col loginForm" >
            <p style={{ fontSize: "15px", fontFamily: "poppins-light", lineHeight: "20px", color: "white" }} className="text-white">Which item is the customer requesting.</p>
            <input type="text" className="w-full emailInput focus:bg-transparent" placeholder="E.g.Ferrari Especiale" onChange={(e) => handleChange(e)} style={{ marginBottom: "0px" }} value={value} />
        </div>
        {displayalgoliaresult ? <div className="overflow-auto max-h-72" onScroll={handleScroll} style={{ background: "#ffffff1a" }}>
            {
                userCredential.email && hits.map((hit, index) => (

                    hit.rental_owner == userCredential.email && <p className="overflow-hidden instantitemname" key={index} onClick={() => handleName(hit)}>{hit.item_name}</p>
                ))
            }
        </div> : <></>}
    </>
    )

}
export default ItemNameSearchInput