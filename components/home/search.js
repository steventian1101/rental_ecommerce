import { useState, useEffect } from "react"
import { InstantSearch } from "react-instantsearch-hooks-web"
import algoliasearch from 'algoliasearch/lite'
import SearchBox from "./searchBox"
const Search = () => {
    const searchClient = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
    );
    console.log(  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY)

    return (
        <section className="search">
            <div className="relative title">
                <p className="text-white hometitle">RENT & ENJOY.</p>
                <div className="hometitleback"></div>
            </div>
            <p className="m-auto mb-6 text-lg font-light text-center text-white homeDetail" style={{ marginTop: "6px" }}>Explore Sydney's Largest Rental Directory.</p>
            <InstantSearch searchClient={searchClient} indexName='items'>
                <SearchBox />
                {/* <SearchResult showData={showData} lastPage={lastPage} sticky={sticky} setSearchText={setSearchText} /> */}
            </InstantSearch>
        </section>
    )

}
export default Search