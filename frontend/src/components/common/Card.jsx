
function Card({ child, openLink }){
  const rating = 4.32;

  return (
    <div className='card' key={"card-"+child} >
      <div className='card2' onClick={() => openLink(child.id)}>
        <img className="card-img" src="../../img/logo192.png" />
        <div className="card-desc">
          <div className="card-row">
            <p className="card-name">{child.name}</p>
            <div className="card-stars">
              <i>★</i>
              <p>{rating}</p>
              <p>(64)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;