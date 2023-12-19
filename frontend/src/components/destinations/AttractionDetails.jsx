import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function AttractionDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [data, setData] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themeparks.wiki/v1/entity/${id}/schedule`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
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

  function renderChildrenObjects(){
    // const liveDataObj = data.liveData[0];
    console.log("LD: ", data)
    return(
      <>
        {/* <h4>{new Date(liveDataObj.lastUpdated).toLocaleString()}</h4> */}

      </>
    );
  }

  return (
    <div>
      <div style={{width: '100%', display: 'flex'}}>
        <h1 style={{margin: '32px 16px', textAlign: 'end', width: '75%'}}>{data.name}</h1>
        <span style={{margin: '32px 0', cursor: 'pointer', height: '48px'}} className="material-symbols-outlined">calendar_month</span>
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