import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi'; // Search Icon from react-icons

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [placeholder, setPlaceholder] = useState('Search for movies...');

    // Change placeholder text based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) { // 'sm' breakpoint
                setPlaceholder('Search');
            } else {
                setPlaceholder('Search for movies...');
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(`Searching for: ${query}`);
        // Call your TMDb API or search function here
    };

    return (
        <form
            onSubmit={handleSearch}
            className="flex items-center justify-center w-full my-8 sm:px-6 md:px-8"
            style={{
                marginTop: "80px", // Avoid overlap with sidebar
                zIndex: 1,
            }}
        >
            <div className="relative w-3/4 sm:w-2/3 lg:w-1/2">
                {/* Search Input */}
                <input
                    type="text"
                placeholder={placeholder}
                className="p-3 pl-4 pr-12 w-full rounded-full outline-none bg-[#121212] text-white placeholder-gray-400  transition-all duration-200"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    height: "45px",
                    fontSize: "1rem",
                }}
                />

                {/* Search Button Inside Input */}
                <button
                    type="submit"
                    className="absolute right-[0.15rem] top-1/2 transform -translate-y-1/2 bg-[#df0707] p-2 rounded-full hover:bg-red-600 shadow-md transition-all duration-300 flex items-center justify-center md:w-[80px] w-[40px]"
                    style={{
                        height: "40px",
                    }}
                >
                    <span className="hidden md:block">Search</span>
                    <FiSearch className="text-white md:hidden w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
