import React from 'react';
import AppNavbar from '../Navigation/AppNavbar'; // Your Navbar component
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import leaves from '../art_assets/leaves.png';
import icon from '../art_assets/seed_logo.png';
import SDGSelector from './SDGSelector';
import NewsFeed from './Newsfeed';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import Popup from '../Popup/Popup.js';
import sdgData from './sdgData.js';

const fetchStockInfo = async (stockSymbol) => {
    try {
      const url = `http://127.0.0.1:5002/stock?ticker=${stockSymbol.toUpperCase()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      return {
        name: data.companyName,
        symbol: data.symbol,
        currentPrice: data.currentPrice,
        marketCap: data.marketCap,
        '52WeekHigh': data['52WeekHigh'],
        '52WeekLow': data['52WeekLow'],
        esg: data.esg,
        es: data.es,
        gs: data.gs,
        ss: data.ss,
        beta: data.beta,
        dividendYield: data.dividendYield,
        peRatio: data.peRatio,
        chartData: [data.day0, data.day1, data.day2, data.day3, data.day4, data.day5],
        sector: data.sector,
      };
    } catch (error) {
      console.error("Failed to fetch stock info:", error);
      return null;
    }
  };

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
    const parsePortfolio = (response) => {
        try {
            var parsedResponse = JSON.parse(response)
            let a = {
                portfolio: parsedResponse.portfolio,
                justification: parsedResponse.justification
            }
    
            let tickers = []
            let percentages = []
    
            a.portfolio.forEach((obj) => {
                tickers.push(obj.ticker)
                percentages.push(obj.percentage)
            })

            setData(tickers)
            setPercentages(percentages)
            
            return {
                portfolio: parsedResponse.portfolio,
                justification: parsedResponse.justification
            }
    
        } catch (error) {
            console.error("Failed to parse portfolio:", error);
            return null;
        }
    };

    const [data, setData] = useState([])
    const [percentages, setPercentages] = useState([])
    const [justification, setJustification] = useState('')

    const [searchTerm, setSearchTerm] = useState('');

    //For initial Modal
    const [modalOpen, setModalOpen] = useState(true);
    const [canCloseModal, setCanCloseModal] = useState(false);
    
    const [experience, setExperience] = useState(0);
    const [amount, setAmount] = useState(null);
    const [pastAmounts, setPastAmounts] = useState([0, 0]);
    const [philosophy, setPhilosophy] = useState(null);
    
    const [selectedSDGs, setSelectedSDGs] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleSDGSelectionChange = (selectedIds) => {
        setSelectedSDGs(selectedIds);
    };

    const [mapping, setMapping] = useState({});
    const [ctx, setCtx] = useState('');
    const [fetchingData, setFetchingData] = useState(false)

    const followUpAPI = async (ctx) => {
        console.log(ctx)

        setFetchingData(true)
        setIsRefreshing(true)

        try {
            const url = `http://127.0.0.1:5002/func?cntxt=` + ctx + `?new=false`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            parsePortfolio(data)
            console.log("Fetched stock data:", data);
        } catch(error) {
            console.log("Error in API call: " + error)
        }

        setIsRefreshing(false);
    }

    const fetchData = async () => {
        setIsRefreshing(true);
        // Simulate fetch call
        try {
            var sdgString = "";

            selectedSDGs.map(idx => {
                sdgString += sdgData[idx-1].name + ", "
            })

            const url = `http://127.0.0.1:5002/func?cntxt=` + sdgString + ". My investment philosophy is: (ignore if blank)" + philosophy;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            parsePortfolio(data)
            console.log("Fetched stock data:", data);
        } catch(error) {
            console.log("Error in API call: " + error)
        }

        setIsRefreshing(false);
        setFetchingData(false);
      };
    
      useEffect(() => {
        if (!modalOpen && isRefreshing && data.length == 0) {
          fetchData();
        } else if (!modalOpen && isRefreshing && !fetchingData) {
            followUpAPI()
        }
      }, [isRefreshing]);


    const handleCloseModal = () => {
        if (canCloseModal) {
            setModalOpen(false);
            setPastAmounts(prev => [...prev, amount]);
            //Fetch needed clusters
            setIsRefreshing(true);
        }
    };  

    const chartOptions = {
        plugins: {
            legend: {
                display: false, // Hide legend
            },
        },
        elements: {
            point: {
                radius: 0, // Hide points on the line
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white', // Set x-axis tick color to white
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // Set x-axis grid line color to white with low opacity
                }
            },
            y: {
                ticks: {
                    color: 'white', // Set y-axis tick color to white
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // Set y-axis grid line color to white with low opacity
                }
            }
        },
        maintainAspectRatio: true,
        responsive: true,
    };
    

    useEffect(() => {
        // Update canCloseModal based on amount and experience conditions
        const isEligibleToClose = amount >= 10 && experience > 0;
        setCanCloseModal(isEligibleToClose);
    }, [amount, experience]); 

    const [hoverData, setHoverData] = useState('');
    const [textInput, setTextInput] = useState('');

    const pieData = {
        labels: data, //All ticker names
        datasets: [
            {
                label: 'Current Portfolio',
                data: percentages,
                backgroundColor: generateColorShadesForPie("hsl(119, 49%, 56%)", data.length),
                hoverOffset: 4,
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                },
            },
        },
        interaction: {
            intersect: true,
            mode: 'point',
        },
        responsive: true,
        maintainAspectRatio: true,
        onHover: async (event, chartElement) => {
            if (chartElement.length) {
                const index = chartElement[0].index;
                const label = pieData.labels[index];
                const stockSymbol = label; // Assuming label is the stock symbol
                const stockInfo = mapping[stockSymbol]; // Fetch stock information
                setHoverData(prev => {
                    if (stockInfo && stockInfo !== prev) {
                        return (
                            <div className="">
                                <div className="relative top-20 mx-auto shadow-lg rounded-md bg-white max-w-2xl p-4">
                                    <div className="text-center font-bold text-lg">
                                        {stockInfo.name} ({stockInfo.symbol})
                                    </div>
                                    <div className="text-center">
                                        <div className="text-center text-xl font-semibold mt-2">
                                            Current Price: <span className="text-green-600">${stockInfo.currentPrice}</span>
                                        </div>
                                        <p>{stockInfo.name} is a U.S. Publicly Traded Company in the {stockInfo.sector} Sector.</p>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                });
            } else {
                setHoverData(null);
            }
        }}

    function generateColorShadesForPie(initialColorHSL, n) {
        // Parse the initial color HSL values
        let [hue, saturation, lightness] = initialColorHSL.match(/\d+/g).map(Number);
      
        const colors = [initialColorHSL]; // Include the initial color in the array
      
        for (let i = 1; i < n; i++) {
          // Adjust lightness and saturation for each new color
          lightness = (lightness + 10) % 100;
          saturation = (saturation + 5) % 100;
      
          // Ensure lightness stays within a visually appealing range
          if (lightness > 90) lightness -= 30;
          if (saturation < 30) saturation += 20;
      
          colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
      
        return colors;
      }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            {isRefreshing && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
            <Modal show={modalOpen}>
            <div className="flex flex-col items-left w-full relative overflow-hidden p-5">
                            <img
                                src={leaves}
                                alt="Leaves"
                                className="absolute -right-16 h-1/2 top-0"
                            />
                    <div className="flex items-left mb-3">
                        <h2 className="text-left text-2xl font-bold mr-4">Get Started</h2>
                        <img src={icon} alt="Icon" className="w-10 h-10 rounded-xl"/>
                    </div>
                    <div className="flex items-center w-full mb-4 pt-5 pb-5">
                        <p className="w-4/12 text-left font-medium">How much investment experience do you have?</p>
                        <div className="flex justify-left w-6/12 ml-10">
                            <button onClick={() => setExperience(0.25)} className={`px-4 py-2 rounded-full hover:bg-[#00BF63] text-black mr-5 ${experience === 0.25? 'bg-[#00BF63]': 'bg-transparent'}`}>
                                Not much
                            </button>
                            <button onClick={() => setExperience(0.75)} className={`px-4 py-2 rounded-full hover:bg-[#00BF63] text-black mr-5 ${experience === 0.75? 'bg-[#00BF63]': 'bg-transparent'}`}>
                                I know what I'm doing
                            </button>
                            <button onClick={() => setExperience(1.25)} className={`px-4 py-2 rounded-full hover:bg-[#00BF63] text-black ${experience === 1.25? 'bg-[#00BF63]': 'bg-transparent'}`}>
                                I'm an Expert
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center w-full mb-10">
                        <p className="w-4/12 text-left font-medium flex items-center">How much money would you like to invest?</p>
                        <div className="flex items-center w-6/12 ml-10">
                            <div className="relative rounded-md shadow-sm w-2/3 flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar" viewBox="0 0 16 16">
                                        <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                                    </svg>
                                </div>
                                <input type="number" name="amount" min="0" placeholder="Enter Amount" required
                                    onChange={(e) => {
                                        const newAmount = parseFloat(e.target.value); // Convert string to float
                                            if (!isNaN(newAmount)) { // Check if the conversion is successful
                                              setAmount(newAmount);
                                            }
                                    }} value={amount}
                                    className="focus:ring-black/[0.5] block w-full pl-10 pr-4 py-2 bg-white text-black text-sm rounded-md focus:outline-none focus:ring-1 dark:bg-white dark:placeholder-gray-400 dark:text-black dark:focus:ring-black/[0.5] dark:focus:border-black" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center w-full mb-6">
                    <p className="text-left font-medium">Select causes you support:</p>
                    {/* Highlighted text element */}
                    <div className="ml-5 bg-black text-white rounded-full px-3 py-1 items-left">
                        {/* Assuming `selectedCount` is the state variable that holds the number of selected causes */}
                        {selectedSDGs.length}
                    </div>
                    </div>
                    <div className="overflow-x-auto max-h-1/3 mb-10 rounded-2xl">
                    <SDGSelector onSelectionChange={handleSDGSelectionChange} selectedSDGs={selectedSDGs} />
                    </div>

                    <div className="flex items-center w-full mb-5">
                        <p className="w-4/12 text-left font-medium flex items-center">Any Investment Philosophy?</p>
                        <div className="flex items-center w-8/12 ml-10">
                            <div className="relative rounded-md shadow-sm w-full flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"/>
                                </svg>
                                </div>
                                <input type="text" name="philosophy" placeholder="(Optional) Tell us about your investment philosophy"
                                    onChange={(e) => setPhilosophy(e.target.value)} value={philosophy}
                                    className="focus:ring-black/[0.5] block w-full pl-10 pr-4 py-2 bg-white text-black text-sm rounded-md focus:outline-none focus:ring-1 dark:bg-white dark:placeholder-gray-400 dark:text-black dark:focus:ring-black/[0.5] dark:focus:border-black" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type='submit'
                            onClick={() => handleCloseModal()} 
                            disabled={!canCloseModal} 
                            className={`text-white text-sm py-3 px-8 rounded-full ${canCloseModal ? 'bg-[#050505] hover:bg-[#1C281E]/[0.5]' : 'bg-gray-500 text-gray-200'}`}
                        >
                            {canCloseModal ? 'Proceed' : 'Fill this out...'}
                        </button>
                    </div>   
                </div>
            </Modal>


        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <div className="w-full">
                <AppNavbar />
            </div>
            <div className='flex flex-row items-center justify-center h-full overflow-x-hidden p-4'>
                <div className='flex flex-col h-full w-1/2 p-2 justify-start rounded-xl'>
                        {/* Pie Chart */}
                        <div className='bg-[#142629] h-full w-full flex flex-col rounded-xl p-5 justify-start'>
                        <h2 className='text-lg font-md text-white'>Curated Portfolio</h2>
                        <div className='w-full h-1/2 flex items-center justify-center'>
                                <Pie data={pieData} options={pieOptions} />
                            </div>

                            {/* Hover Info Box - Use remaining space more effectively */}
                            <div id='hover-data' className='flex-grow w-full my-3'>
                                {hoverData && (
                                    <div className='p-2 bg-gray-200 rounded-md h-full'>
                                        {hoverData}
                                    </div>
                                )}
                            </div>

                            {/* Text Input - Ensure it's at the bottom */}
                            <div className='w-full mt-auto'>
                                <form>
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => {
                                        setTextInput(e.target.value)
                                        
                                    }}
                                    className="bg-white text-black text-sm rounded-md focus:ring-2 block w-full p-3 focus:outline-none focus:ring-black/[0.5]"
                                    placeholder="Your investment philosophy or changes you'd like to make..."
                                />
                        <button 
                            type='submit'
                            onClick={(e) => {e.preventDefault(); followUpAPI(textInput); setTextInput("")}} 
                            className={`'bg-[#050505] hover:bg-[#1C281E]/[0.5]' : 'bg-gray-500 text-gray-200'}`}
                        >
                            'Proceed' 
                        </button>                                
                        </form>
                    </div>
                    </div>
                </div>
                <div className='flex flex-col h-full w-1/4 text-white p-2'>
                    {/* Portfolio History Header */}
                    <div className='mb-4 bg-black/[0.7] p-5 rounded-xl'>
                        <h2 className='text-lg font-md text-white '>Portfolio History</h2>
                        <div className='flex items-center justify-between mt-5 mb-5 w-full h-32'>
                            {/* Create Button */} 
                            <button className='text-sm bg-[#00BF63] hover:opacity-[0.8] text-white font-md py-2 px-4 rounded-full w-1/3 mr-3' onClick={()=> {}}>
                                Create +
                            </button>
                            {/* Mini Chart Container */}
                                    <div className='w-2/3 h-full flex justify-center items-center p-3 rounded-xl'>
                                    <Line
                                        data={{
                                            labels: pastAmounts,
                                            datasets: [{ data: pastAmounts, fill: false, borderColor: "#00BF63" }],
                                        }}
                                        options={chartOptions}
                                    />
                                    </div>
                        </div>
                    </div>
                <div className='flex flex-col h-full bg-black/[0.7] p-5 rounded-xl'></div>
                </div>
                <div className='flex flex-col h-full w-1/4 overflow-auto ml-2'>
                    <NewsFeed />
                </div>
            </div>
        </div>
        </motion.div>
    );
}

export default Dashboard;