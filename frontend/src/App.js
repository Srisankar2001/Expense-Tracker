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
import { NewExpensePage } from './Components/NewExpensePage/NewExpensePage';
import { FriendPage } from './Components/FriendPage/FriendPage';
import { NewFriendPage } from './Components/NewFriendPage/NewFriendPage';
import { UpdateExpensePage } from './Components/UpdateExpensePage/UpdateExpensePage';
import { NewMemberPage } from './Components/NewMemberPage/NewMemberPage';

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
          {_id && <Route path='/createExpense' element={<NewExpensePage/>}/>}
          {_id && <Route path='/editExpense' element={<UpdateExpensePage/>}/>}
          {_id && <Route path='/friend' element={<FriendPage/>}/>}
          {_id && <Route path='/allFriend' element={<NewFriendPage/>}/>}
          {_id && <Route path='/manage' element={<NewMemberPage/>}/>}</Routes>
        {_id && <Navbar/>}
      </Router>
    </div>
  );
}

export default App;
