const SelectStar = ({booking, ownerdata}) => {
    return (
        <>
            <p></p>
            <div className="flex flex-row">
                <FontAwesomeIcon icon={faStar} className='text-lg text-white cursor-pointer' />
                <FontAwesomeIcon icon={faStar} className='text-lg text-white' />
                <FontAwesomeIcon icon={faStar} className='text-lg text-white' />
                <FontAwesomeIcon icon={faStar} className='text-lg text-white' />
                <FontAwesomeIcon icon={faStar} className='text-lg text-white' />
            </div>
        </>
    )

}
export default SelectStar