import { useState , useEffect } from 'react';
import axios from 'axios'

//import page
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Display from './pages/Display';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path= '/' element={<Home />} />
        <Route path= '/home' element={<Home />} />
        <Route path= '/contact' element={<Contact />} />
        <Route path= '/github' element={<Display />} />
      </Routes>
    </Router>
  )
}

export default App
