import './App.css';
import Home from './components/home/Home';
import Nav from './components/nav/Nav';
import Destinations from './components/destinations/Destinations';
import DestinationDetails from './components/destinations/DestinationDetails';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ParkDetails } from './components/destinations/ParkDetails';
import { AttractionDetails } from './components/destinations/AttractionDetails';
import { WaitingTimes } from './components/destinations/WaitingTimes';

function App() {
  return (
    <BrowserRouter>
      <div id='main-container' className="App">
        <Nav />
        <div style={{width: '100%', height: '100%'}}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/destinations/:id/waiting" element={<WaitingTimes type={'destinations'} />} />
            <Route path="/parks/:id" element={<ParkDetails />} />            
            <Route path="/parks/:id/waiting" element={<WaitingTimes type={'park'} />} />
            <Route path="/attractions/:id" element={<AttractionDetails />} />
            {/* <Route path="/destinations/:id" element={<DestinationCalendar />} /> */}
          
            {/* <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
