import React, { useState } from 'react'
import './WatchList.css'
import Navbar from '../components/Navbar.jsx'
import { useAppContext } from "../context/AppContext.jsx";
import DashboardHeader from '../components/Dashboard-Header.jsx';
import Footer from '../components/Footer.jsx';
import filterIcon from '../assets/filter-button.svg';


const  Watchlist= () => {
  const { darkMode, setDarkMode, isSearchActive, setIsSearchActive } = useAppContext();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceError, setPriceError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    dailyChange: '',
    dailyChangePercent: '',
    priceFrom: '',
    priceUpto: '',
    sectors: [],
    marketCap: [],
    sortBy: ''
  });

  // Sample watchlist data
  const [watchlistData] = useState([
    { company: 'TATA Motors', symbol: 'TATAMOTORS.NS', price: 418.30, change: 4.35, changePercent: 0.83 },
    { company: 'Reliance Industries', symbol: 'RELIANCE.NS', price: 2584.50, change: 8.1, changePercent: 0.56 },
    { company: 'Infosys Ltd', symbol: 'INFY.NS', price: 1468.90, change: -12.2, changePercent: -0.42 },
    { company: 'Waree Energy', symbol: 'WAREEENR.NS', price: 3178.34, change: -23.10, changePercent: -0.15 },
    { company: 'Bajaj Hindustan Sugar Lt', symbol: 'BAJAJHIND', price: 22.09, change: -0.22, changePercent: -0.08 },
    { company: 'Coal India Ltd', symbol: 'COALINDIA.NS', price: 388.65, change: 0.95, changePercent: 0.25 }
  ]);

  const sectors = [
    'Technology / IT', 'Communication Services', 'Materials & Mining',
    'Consumer Cyclical', 'Consumer Defensive', 'Basic Materials',
    'Financial Services', 'Real Estate', 'Healthcare / Pharmaceuticals',
    'Energy / Oil & Gas', 'Utilities / Power', 'Industrials', 'Others'
  ];

  const handleRemoveStock = (symbol) => {
    console.log('Remove stock:', symbol);
  };

  const toggleSector = (sector) => {
    setFilters(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const toggleMarketCap = (cap) => {
    setFilters(prev => ({
      ...prev,
      marketCap: prev.marketCap.includes(cap)
        ? prev.marketCap.filter(c => c !== cap)
        : [...prev.marketCap, cap]
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      dailyChange: '',
      dailyChangePercent: '',
      priceFrom: '',
      priceUpto: '',
      sectors: [],
      marketCap: [],
      sortBy: ''
    });
    setPriceError('');
  };

  return (
    <div className="watchlist">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        pageType="dashboard"
        profileData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }} 
      />
      
      <DashboardHeader darkMode={darkMode} />
      
      <div className="watchlist-content">

         <div className="watchlist-title">
            <h1>Your Watchlist</h1>
            <p>Track your favorite stocks and monitor their performance</p>
          </div>
          
          <div className="search-container">
              <i className="pi pi-search"></i>
              <input 
                type="text" 
                placeholder="Search your stock"
                onFocus={() => setIsSearchActive(true)}
              />
              <button className="filter-btn"  onClick={() => setIsFilterOpen(true)}> 
                <img src={filterIcon} alt="filter-icon" />
              </button>
            
            </div>
       

        {/* Watchlist Table */}
        <div className="watchlist-table-container">
          <table className="watchlist-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlistData.map((stock, index) => (
                  <tr key={index}>
                    <td>
                      <div className="company-cell">
                        <span className="company-name">{stock.company}</span>
                      </div>
                    </td>
                    <td>
                      <span className="company-symbol">{stock.symbol}</span>
                    </td>
                    <td>
                      <span className="price-cell">{stock.price.toFixed(2)}</span>
                    </td>
                    <td>
                      <span className={`change-cell ${stock.change >= 0 ? 'change-positive' : 'change-negative'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-btn" 
                        onClick={() => handleRemoveStock(stock.symbol)}
                      >
                       <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="filter-modal-overlay overlay" onClick={() => {setIsFilterOpen(false);handleClearFilters();}}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h2>Filter Options</h2>
           
            </div>

            <div className="filter-modal-content">
              {/* Daily Change */}
              <div className="filter-section">
                <div className="daily-change">
                <div className="filter-section-title">Daily change</div>
                <div className="filter-options">
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="gainers" 
                      name="dailyChange"
                      checked={filters.dailyChange === 'gainers'}
                      onChange={() => setFilters({...filters, dailyChange: 'gainers'})}
                    />
                    <label htmlFor="gainers">Gainers</label>
                  </div>
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="losers" 
                      name="dailyChange"
                      checked={filters.dailyChange === 'losers'}
                      onChange={() => setFilters({...filters, dailyChange: 'losers'})}
                    />
                    <label htmlFor="losers">Losers</label>
                  </div>
                </div>
            </div>

              {/* Daily Change % */}
              <div className="daily-change-percentage">
             <div className="filter-section-title">Daily change (%)</div>
                <div className="filter-options">
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="gainers-percent" 
                      name="dailyChangePercent"
                      checked={filters.dailyChangePercent === 'gainers'}
                      onChange={() => setFilters({...filters, dailyChangePercent: 'gainers'})}
                    />
                    <label htmlFor="gainers-percent">Gainers</label>
                  </div>
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="losers-percent" 
                      name="dailyChangePercent"
                      checked={filters.dailyChangePercent === 'losers'}
                      onChange={() => setFilters({...filters, dailyChangePercent: 'losers'})}
                    />
                    <label htmlFor="losers-percent">Losers</label>
                  </div>
                </div>
                </div>
              </div>


              {/* Price Range */}
              <div className="filter-section">
                <div className="price-range">
                <div className="filter-section-title">Price Range</div>
                <div className="price-range-inputs">
                      <div className="price-input-group">
                        <label>From</label>
                        <input 
                          type="number" 
                          placeholder="10"
                          value={filters.priceFrom}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilters({ ...filters, priceFrom: value });

                            if (filters.priceUpto && Number(value) > Number(filters.priceUpto)) {
                              setPriceError('“From” cannot be greater than “Upto”.');
                            } else {
                              setPriceError('');
                            }
                          }}
                        />
                      </div>

                      <div className="price-input-group">
                        <label>Upto</label>
                        <input 
                          type="number" 
                          placeholder="439"
                          value={filters.priceUpto}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFilters({ ...filters, priceUpto: value });

                            if (filters.priceFrom && Number(value) < Number(filters.priceFrom)) {
                              setPriceError('“Upto” cannot be less than “From”.');
                            } else {
                              setPriceError('');
                            }
                          }}
                        />
                      </div>


                </div>
              {priceError && <p className="price-error">{priceError}</p>}

                </div>


                {/* Sort By */}
                   <div className="sort-by">
                <div className="filter-section-title">Sort by</div>
                <div className="filter-options-sortby">
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="low-high" 
                      name="sortBy"
                      checked={filters.sortBy === 'low-high'}
                      onChange={() => setFilters({...filters, sortBy: 'low-high'})}
                    />
                    <label htmlFor="low-high">Low-High</label>
                  </div>
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="high-low" 
                      name="sortBy"
                      checked={filters.sortBy === 'high-low'}
                      onChange={() => setFilters({...filters, sortBy: 'high-low'})}
                    />
                    <label htmlFor="high-low">High-Low</label>
                  </div>
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="low-high-percent" 
                      name="sortBy"
                      checked={filters.sortBy === 'low-high-percent'}
                      onChange={() => setFilters({...filters, sortBy: 'low-high-percent'})}
                    />
                    <label htmlFor="low-high-percent">Low-High (%)</label>
                  </div>
                  <div className="filter-option">
                    <input 
                      type="radio" 
                      id="high-low-percent" 
                      name="sortBy"
                      checked={filters.sortBy === 'high-low-percent'}
                      onChange={() => setFilters({...filters, sortBy: 'high-low-percent'})}
                    />
                    <label htmlFor="high-low-percent">High-Low (%)</label>
                  </div>
                </div>
              </div>
            </div>


              {/* Market Cap */}
              <div className="filter-section-market-cap">
                <div className="filter-section-title">Market Cap</div>
                <div className="filter-options">
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="small-cap"
                      checked={filters.marketCap.includes('small')}
                      onChange={() => toggleMarketCap('small')}
                    />
                    <label htmlFor="small-cap">Small Cap</label>
                  </div>
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="mid-cap"
                      checked={filters.marketCap.includes('mid')}
                      onChange={() => toggleMarketCap('mid')}
                    />
                    <label htmlFor="mid-cap">Mid Cap</label>
                  </div>
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="large-cap"
                      checked={filters.marketCap.includes('large')}
                      onChange={() => toggleMarketCap('large')}
                    />
                    <label htmlFor="large-cap">Large Cap</label>
                  </div>
                </div>
              </div>

              {/* Sector */}
              <div className="filter-section-sector">
                <div className="filter-section-title">Sector</div>
                <div className="sector-grid">
                  {sectors.map((sector, index) => (
                    <button
                      key={index}
                      className={`sector-btn ${filters.sectors.includes(sector) ? 'active' : ''}`}
                      onClick={() => toggleSector(sector)}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                Clear All
              </button>
              <button className="apply-filter-btn" onClick={handleApplyFilters}  disabled={!!priceError}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="footer-div">
        <Footer 
          darkMode={darkMode}  
          navigationLinks={[
            { text: "Portfolio", href: "#" },
            { text: "AI Insigths", href: "#" },
            { text: "Wacthlist", href: "#" },
            { text: "Compare Stocks", href: "#" },
          ]}
          legalLinks={[
            { text: "Privacy Policy", href: "#privacy" },
            { text: "Terms Of Service", href: "#terms" },
            { text: "Contact Us", href: "#contact" },
          ]}
        />
      </div>
    </div>
  )
}

export default Watchlist;
