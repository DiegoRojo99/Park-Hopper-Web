import './Common.css';
import logoImage from '../../img/logo192.png'; // adjust the path accordingly

function WideCard({ child, openLink }){
  return (
    <div className='wide-card'>
      <div className='wide-card2' onClick={() => openLink(child.id)}>
          <img className='wide-card-img' src={logoImage} />
          <div className='overlay'>            
            <p>{child.name}</p>
          </div>
      </div>
    </div>
  );
};
  
export default WideCard;