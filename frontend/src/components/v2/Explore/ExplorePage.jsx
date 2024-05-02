import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';
import TextField from '@mui/material/TextField';

function ExplorePage(){
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/allParks');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  function searchName(text){
    setName(text);
    const filteredNames = data.filter((dest) => dest.ParkName?.toLowerCase().includes(text.toLowerCase()))
    setFilteredData(filteredNames);
  }
  
  function openLink(id) {
    const url = `/parks/${id}`;
    navigate(url); 
  }

  function renderCountryList(){
    const countryMap = {};
    filteredData.forEach((row) => {
      if(countryMap[row.Country]?.length){
        countryMap[row.Country] = [...countryMap[row.Country], row];
      }else{
        countryMap[row.Country] = [row];
      }
    });
    const countries = Object.keys(countryMap);
    countries.sort((a,b) => a.localeCompare(b));
    const firstColumn = countries.length > 10 ? countries.splice(0, 13) : countries.splice(0, Math.ceil(countries.length / 2));
    return (
      <div className='country-list-div'>
        <div className='half-column'>
          {firstColumn.map(c => <ParkGroup list={countryMap[c]} name={c} openLink={openLink} /> )}
        </div>        
        <div className='half-column'>
          {countries.map(c => <ParkGroup list={countryMap[c]} name={c} openLink={openLink} /> )}
        </div>
      </div>
    )
  }

  return (
    <div style={{height: '100%'}}>
      <h1 style={{margin: '16px'}}>Parks:</h1>
      <FilterBar name={name} searchName={searchName} />
      <div style={{display: 'flex', width: '20%'}}>
        <p style={{margin: '0 8px'}}>List</p>
        <p>Map</p>
      </div>
      
      <div>
        {renderCountryList()}
      </div>
    </div>
  );
};

function FilterBar({name, searchName}){

  return (
    <div className='filter-bar'>
      <TextField 
        id="outlined-basic" 
        label="Name" 
        // variant="outlined" 
        // color=''
        value={name}
        onChange={(event) => { searchName(event.target.value)}}
        focused
        sx={{ color: 'white' }}
      />

    </div>
  )
}

function ParkGroup({list, name, openLink}){
  list.sort((a,b) => a.ParkName.localeCompare(b.ParkName));
  return (
    <div className='group-list' key={name + "-group"}>
      <p className='group-name'>{name}</p>
      {list.map(park => 
      <div className='group-park'>
        <p className='group-park-name' onClick={() => openLink(park.ParkID)}>
          {park.ParkName}
        </p>
        <div className='group-park-link'>
          
        </div>
      </div>
      )}
    </div>
  )
}

export default ExplorePage;
