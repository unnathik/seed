import React from 'react';
import AppNavbar from '../Navigation/AppNavbar'; // Your Navbar component
import { motion } from 'framer-motion';
import { useState } from 'react';
import NewsFeed from './Newsfeed';

const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

function Dashboard() {

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (e) => {
        // Check if Enter key is pressed
        if (e.key === 'Enter') {
            // Call your search function here
            console.log('Search Term:', searchTerm); // Example action
            // search(searchTerm); // Uncomment and implement your search logic
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <div className="w-full">
                <AppNavbar />
            </div>
            <div className='flex flex-row items-center justify-center p-4 h-full'>
            {/* Main content */}
            <div className='flex flex-col h-full w-3/4 bg-black'></div>
            <div className='flex flex-col h-full w-1/4 px-4'>
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-white text-black text-sm rounded-md focus:ring-black/[0.5] block w-full p-2 dark:bg-white dark:placeholder-gray-400 dark:text-black dark:focus:ring-black/[0.5] dark:focus:border-black focus:outline-none focus:ring-1" // Adjusted height and added padding, border, and shadow
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <NewsFeed />
            </div>
            </div>
        </div>
        </motion.div>
    );
}

export default Dashboard;