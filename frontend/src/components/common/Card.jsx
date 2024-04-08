
function Card({ child, openLink }){
  const rating = 4.32;
  console.log("C: ", child)
  return (
    <div className='card' key={"card-"+child} >
      <div className='card2' onClick={() => openLink(child.id)}>
        <img className="card-img" src="" />
        <div className="card-desc">
          <div className="card-row">
            <p className="card-name">{child.name}</p>
            <div className="card-stars">
              <p style={{margin: '0 0 0 4px'}}>{child?.queue?.STANDBY?.waitTime ? child.queue.STANDBY.waitTime : "-"}</p>
              <i>⌚</i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;