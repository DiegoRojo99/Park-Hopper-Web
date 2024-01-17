import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';

function DestinationDetails(){
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const [children, setChildren] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/children`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setChildren(result.children.filter((child) => child.entityType === "PARK"));
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  function openLink(id) {
    const url = `/parks/${id}`;
    navigate(url); 
  }

  function renderChildrenObjects(){
    return(
      <>           
        <div className='destination-page'>
          {children.map((child) => { 
            return <Card child={child} openLink={openLink} /> 
          })}
        </div>
      </>
    );
  }

  if(loading){
    return <></>;
  }
  return (
    <div>
      <div style={{width: '100%', display: 'flex'}}>
        <h1 style={{margin: '32px 0', textAlign: 'center', width: '100%'}}>{data.name}</h1>
        {/* <span style={{margin: '32px 0', cursor: 'pointer'}} className="material-symbols-outlined">calendar_month</span> */}
      </div>
               
      {renderChildrenObjects()}
    </div>
  );
};

export default DestinationDetails;