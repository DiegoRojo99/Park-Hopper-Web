import './Common.css';
import logoImage from '../../img/logo192.png'; // adjust the path accordingly

function WideCard({ child, openLink }){
  return (
    <div className='wide-card'>
      <div className='wide-card2' onClick={() => openLink(child.id)}>
          {/* <img className='wide-card-img' src={logoImage} /> */}
          <div className='overlay'>            
            <p style={{width: '92.5%'}}>{child.name}</p>
            <p style={{width: '2.5%'}}>{child?.queue?.STANDBY?.waitTime ? child.queue.STANDBY.waitTime : "-"}</p>
            <i style={{width: '5%'}}>⌚</i>
          </div>
      </div>
    </div>
  );
};
  
export default WideCard;