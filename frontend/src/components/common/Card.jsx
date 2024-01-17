
function Card({ child, openLink }){
  return (
    <div className='card' >
      <div className='card2' onClick={() => openLink(child.id)}>
        {child.name}
      </div>
    </div>
  );
};

export default Card;