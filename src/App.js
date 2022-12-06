import './App.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Week from './components/Week/Week';
import Shopping from './components/Shopping/Shopping';

function App() {
  return (
   <Routes>
    <Route path='/' element={<Dashboard/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/week/:id' element={<Week/>}/>
    <Route path='/shopping' element={<Shopping/>}/>
   </Routes>
  );
}

export default App;
