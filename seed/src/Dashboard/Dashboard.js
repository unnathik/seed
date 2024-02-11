import React from 'react';
import AppNavbar from '../Navigation/AppNavbar'; // Your Navbar component
import { motion } from 'framer-motion';
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
            <div className='flex flex-col h-full w-1/4 pl-4'>
                <NewsFeed />
            </div>
            </div>
        </div>
        </motion.div>
    );
}

export default Dashboard;