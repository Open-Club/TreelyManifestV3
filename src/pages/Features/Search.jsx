import React from "react"

const Search = () => {
  const styles = {
    wrapper: {
      padding: "10px 14px 10px 20px"
    }

  }
  return (
    <div style={styles.wrapper}>
      <div
        className="h-8 pl-3 pr-2 bg-gradient-to-r from-green-400 to-blue-500 text-white focus-within:text-gray-400 rounded-md flex justify-between items-center relative"

      >
        <button type="submit" className="bg-transparent mr-1 focus:outline-none active:outline-none">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <input type="search" name="search" id="search" placeholder="Search..."
          className={`bg-transparent appearance-none w-full outline-none text-sm cursor-not-allowed text-white placeholder-white `}
          disabled={true}
        />
      </div>

    </div>
  )
}


export default Search;
