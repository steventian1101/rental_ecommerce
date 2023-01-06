import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchBox } from "react-instantsearch-hooks-web";
import { useCallback } from "react";
import { useEffect } from "react";
export default function SearchBox({ queryText }) {
    const memoizedSearch = useCallback((query, search) => {
        search(query);
    }, []);
    const { refine } = useSearchBox({
        queryHook: memoizedSearch,
    });
    const handleChange = (event) => {
        refine(event.target.value);
    };
    useEffect(() => {
        refine(queryText)
    }, [])

    return (
        <div className="flex flex-row items-center justify-around searchBox">
            <FontAwesomeIcon icon={faSearch} className="text-xl text-white " />
            <input type="text" className="w-full p-1 text-base text-white bg-transparent outline-none home_search mx-2.5" id="homeSearch" placeholder="e.g.SnowBoards" onChange={(e) => handleChange(e)} defaultValue={queryText ? queryText : ''} />
        </div>
    );
}