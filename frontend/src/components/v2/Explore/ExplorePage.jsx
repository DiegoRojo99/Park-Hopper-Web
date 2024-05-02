import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';
import SearchBar from '../../common/SearchBar';
import Card from '../../common/Card';
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

  return (
    <div style={{height: '100%'}}>
      <h1 style={{margin: '16px'}}>Parks:</h1>
      <FilterBar name={name} searchName={searchName} />
      <div style={{display: 'flex', width: '20%'}}>
        <p style={{margin: '0 8px'}}>List</p>
        <p>Map</p>
      </div>
      <div className='grid-all'>
      {filteredData.map((park, index) => (
        <Card key={"park-"+index} child={park} openLink={openLink} /> 
      ))}
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

export default ExplorePage;
