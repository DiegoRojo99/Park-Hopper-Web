import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import WideCard from '../common/WideCard';

export function ParkDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const [children, setChildren] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {

    function divideChildren(children){
      let attractions = children.filter((child) => child.entityType === "ATTRACTION");
      let restaurants = children.filter((child) => child.entityType === "RESTAURANT");
      let hotels = children.filter((child) => child.entityType === "HOTEL");
      let shows = children.filter((child) => child.entityType === "SHOW");

      setChildren({ attractions, restaurants, hotels, shows});
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/children`);
        const scheduleRes = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/schedule`);
        
        if (!response.ok || !scheduleRes.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const scheduleObj = await scheduleRes.json();
        divideChildren(result.children);
        setData(result);
        const groupedByDate = scheduleObj.schedule.reduce((acc, obj) => {
          const date = new Date(obj.date).toLocaleDateString(); // Extracting only the date part
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(obj);
          return acc;
        }, {});
        setSchedule(groupedByDate);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  function openLink(id) {
    const url = `/attractions/${id}`;
    navigate(url); 
  }

  function renderChildrenObjects(){
    if(!loading){
      return(
        <>
          <div className='destination-page'>
            {children.attractions.map((child) => { 
            return (
              <WideCard child={child} openLink={openLink} />
            )})}
          </div>
        </>
      );
    }
    else{
      return <></>;
    }
  }

  
  if(loading){
    return <>Loading</>
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