import React from 'react'

const Search = ({searchTerm,setSearchTerm}) => {
  // console.log("Handler")
  const searchHandler = (value)=>{
    setSearchTerm(value)
    console.log("value",value)
  }
  return (
    <div className="search">
        <div>
            <img src="search.svg"alt="search"/>
            <input
            type="text"
            placeholder="search thousands of  Movies"
            // onChange={searchHandler}
            value={searchTerm}
            onChange={(event)=>searchHandler(event.target.value)}

            />
        </div>


    </div> 
   

    
     
    
  )
}

export default Search;