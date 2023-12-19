import React, { useEffect, useState } from 'react';
import './Destinations.css';
import SearchBar from '../common/SearchBar';

function Destinations(){
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.themeparks.wiki/v1/destinations');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result.destinations);
        setFilteredData(result.destinations);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array means this effect will run once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  function searchName(text){
    const filteredNames = data.filter((dest) => dest.name.toLowerCase().includes(text))
    setFilteredData(filteredNames);
  }

  return (
    <div>
      <h1 style={{margin: '16px'}}>Destinations:</h1>
      <SearchBar onSearch={searchName} />
      <div className='destination-page'>
      {filteredData.map((dest) => (
        <div className='card'>
          <a href={'/destinations/'+dest.id}>
            {dest.name}
          </a>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Destinations;
