import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Destinations.css';
import SearchBar from '../common/SearchBar';
import Card from '../common/Card';

function Destinations(){
  const navigate = useNavigate();
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
  
  function openLink(id) {
    const url = `/destinations/${id}`;
    navigate(url); 
  }

  return (
    <div>
      <h1 style={{margin: '16px'}}>Destinations:</h1>
      <SearchBar onSearch={searchName} />
      <div className='destination-page'>
      {filteredData.map((dest) => (
        <Card child={dest} openLink={openLink} /> 
      ))}
      </div>
    </div>
  );
};

export default Destinations;
