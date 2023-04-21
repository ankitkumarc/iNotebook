import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Navbar from './components/Navbar';
import About from './components/About';
import Home from './components/Home';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [alert, setAlert] = useState(null);
  const [mode, setMode] = useState('light')

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  const toggle = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#230554';
      showAlert("Dark Mode Enabled", "Success")
    }
    else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
      showAlert("Light Mode Enabled", "Success")
    }
  }


  return (
    <>
      <NoteState>
        <Router>
          <Navbar mode={mode} toggle={toggle} />
          <Alert alert={alert} />
          <div className='container'>
            <Routes>
              <Route exact path='/' element={<Home showAlert={showAlert} mode={mode} toggle={toggle} />} />
              <Route exact path='/about' element={<About showAlert={showAlert} mode={mode} toggle={toggle} />} />
              <Route exact path='/login' element={<Login showAlert={showAlert} mode={mode} toggle={toggle} />} />
              <Route exact path='/signup' element={<Signup showAlert={showAlert} mode={mode} toggle={toggle} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
