import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function ParkDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);
  const [children, setChildren] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [chosenChild, setChosenChild] = useState(null);
  const columns = ["attractions", "restaurants", "shows"];

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  function openChildrenPage(id) {
    const url = `/${chosenChild}/${id}`;
    navigate(url); 
  }

  function renderChildrenObjects(){
    if(chosenChild!==null && children[chosenChild] && children[chosenChild].length > 0){
      return(
        <>
          <h4>{chosenChild.toLocaleUpperCase()}</h4>            
          <div className='destination-page'>
            {children[chosenChild].map((child) => { 
            return (
              <div className='card' onClick={() => openChildrenPage(child.id)}>
                {child.name}
              </div>
            )})}
          </div>
        </>
      );
    }
    else{
      console.log("SC: ",schedule)
      return <></>;
    }
  }

  return (
    <div>
      <div style={{width: '100%', display: 'flex'}}>
        <h1 style={{margin: '32px 0', textAlign: 'center', width: '100%'}}>{data.name}</h1>
        {/* <span style={{margin: '32px 0', cursor: 'pointer'}} className="material-symbols-outlined">calendar_month</span> */}
      </div>
               
      <div className='destination-cards'>
      {columns.map((col) => {
        return (
          <p className='full-card' onClick={() => setChosenChild(col)}>
            {col.toLocaleUpperCase()}
          </p>
        )
      })}
      </div>
      {renderChildrenObjects()}

      {/* {columns.map((col) => {
        if(children[col] && children[col].length > 0){
          return(
            <>
              <h4>{col.toLocaleUpperCase()}</h4>            
              <div className='destination-page'>
                {children[col].map((child) => (
                  <div className='card'>
                    {child.name}
                  </div>
                ))}
              </div>
            </>
          );
        }else{
          return <></>;
        }
      })} */}
    </div>
  );
};