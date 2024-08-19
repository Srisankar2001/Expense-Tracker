import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { LoginPage } from './Components/LoginPage/LoginPage';
import { RegisterPage } from './Components/RegisterPage/RegisterPage';
import { HomePage } from './Components/HomePage/HomePage';
import { useContext } from 'react';
import { AppContext } from './Context/AppContext';
import { NewEventPage } from './Components/NewEventPage/NewEventPage';
import { Navbar } from './Components/Navbar/Navbar';
import { EventPage } from './Components/EventPage/EventPage';

function App() {
  const _id = useContext(AppContext)
  return (
    <div className="App">
      <Router>
        <Routes>
          {!_id && <Route path='/' element={<LoginPage/>}/>}
          {!_id && <Route path='/register' element={<RegisterPage/>}/>}

          {_id && <Route path='/' element={<HomePage/>}/>}
          {_id && <Route path='/createEvent' element={<NewEventPage/>}/>}
          {_id && <Route path='/getEvent' element={<EventPage/>}/>}
        </Routes>
        {_id && <Navbar/>}
      </Router>
    </div>
  );
}

export default App;
