import { useState, useEffect } from "react";
const useDebounce = (value) => {
    const [state, setState] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setState(value), 500);

        return () => clearTimeout(handler);
    }, [text, 500]);

    return state;
};
export default useDebounce