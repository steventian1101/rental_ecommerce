import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchBox } from "react-instantsearch-hooks-web";
import { useCallback, useState} from "react";
import { useEffect } from "react";
const useDebounce = (func, milliseconds) => {
    const time = milliseconds || 400
    let timer

    return event => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(func, time, event)
    }
}
export default function SearchBox({ searchText, setNavbarSearch }) {
    const [text, setText] = useState(null);
    const memoizedSearch = useCallback((query, search) => {
      search(query);
    }, []);
    const { refine } = useSearchBox({
        queryHook: memoizedSearch,
    });
    const handleChange = useDebounce((event) => {
        setNavbarSearch(event.target.value)
        let temptext = event.target.value;
        console.log("localstorage setitem function")
        localStorage.setItem('searchText', temptext);
        refine(event.target.value)
    },500)
    useEffect(()=>{
        console.log("localstorage setitem useEffect")
         refine(searchText)
         setText(searchText)
         localStorage.setItem('searchText', text);
    },[text])
    return (
        <div className="flex flex-row items-center justify-around searchBox" >
            <FontAwesomeIcon icon={faSearch} className="text-xl text-white " />
                <input type="text" className="w-full p-1 text-base text-white bg-transparent outline-none home_search mx-2.5" id="homeSearch" placeholder="e.g.SnowBoards" onChange={(e) => handleChange(e)} defaultValue={text}/>
        </div>
    );
}