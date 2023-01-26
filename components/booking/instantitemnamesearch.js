import { InstantSearch } from 'react-instantsearch-hooks-web'
import algoliasearch from 'algoliasearch/lite'
import ItemNameSearchInput from './itemnamesearchinput';
const   InstantItemNameSearch = ({setId}) => {
    const searchClient = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
    );
    
    return (
        <InstantSearch searchClient={searchClient} indexName='items'>
            <ItemNameSearchInput setId={ setId}/>
        </InstantSearch>
    )

}
export default InstantItemNameSearch