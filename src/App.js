import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Week from './components/Week/Week';

function App() {
  return (
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/week/:id' element={<Week/>}/>
   </Routes>
  );
}

export default App;
