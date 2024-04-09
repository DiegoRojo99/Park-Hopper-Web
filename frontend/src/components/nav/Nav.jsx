import './Nav.css';

function Nav() {
  return (
    <div class="nav-menu">
      <ul class="nav-menu-content">
        <li><a href="/"><span class="material-symbols-outlined">home</span></a></li>
        {/* <li><a href="#"><span class="material-symbols-outlined">dashboard</span><span>DashBoard</span></a></li> */}
        <li><a href="/destinations"><span class="material-symbols-outlined">explore</span></a></li>
        <li><a href="#"><span class="material-symbols-outlined">settings</span></a></li>
        {/* <li><a href="#"><span class="material-symbols-outlined">analytics</span><span>Analytics</span></a></li>
        <li><a href="#"><span class="material-symbols-outlined">person</span><span>Account</span></a></li>
        <li><a href="#"><span class="material-symbols-outlined">report</span><span>Report</span></a></li>
        <li><a href="#"><span class="material-symbols-outlined">email</span><span>Contact</span></a></li>*/}
        <li style={{flex: '16'}}></li>
        <li style={{float: 'right'}}><a href="/login"><span class="material-symbols-outlined">login</span></a></li> 
      </ul>
    </div>
  );
}

export default Nav;
