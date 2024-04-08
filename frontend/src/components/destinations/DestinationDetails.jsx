import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';

function DestinationDetails() {
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

  function handleSaveDestination() {
    const { children, ...dataWithoutChildren } = data;

    fetch('http://localhost:8000/api/destinations', {
      method: 'POST',
      body: JSON.stringify(dataWithoutChildren),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save destination');
      }
      // Handle success
    })
    .catch(error => {
      // Handle error
    });
  };

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

  function renderChildrenObjects() {
    return (
      <div>
        <div className='destination-page'>
          {children.map((child) => {
            return <Card child={child} openLink={openLink} />
          })}
        </div>
        <div>
          
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ width: '100%', display: 'flex' }}>
        <h1 style={{ margin: '32px 0', textAlign: 'center', width: '100%' }}>{data.name}</h1>
      </div>

      {renderChildrenObjects()}
    </div>
  );
};

export default DestinationDetails;
