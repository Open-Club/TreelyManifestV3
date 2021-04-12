import React from "react"

const Search = () => {
  const styles = {

  }
  return (
    <div>
      <div
        className="h-8 pl-3 pr-2 bg-gray-900 text-gray-600 focus-within:text-gray-400 rounded-md flex justify-between items-center relative"
        style={{ width: "70%" }}
      >
        <button type="submit" className="bg-gray-900 mr-1 focus:outline-none active:outline-none">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <input type="search" name="search" id="search" placeholder="Search..."
          className={`bg-gray-900 appearance-none w-full outline-none text-sm cursor-not-allowed `}
          disabled={true}
        />

      </div>

    </div>
  )
}


export default Search;
