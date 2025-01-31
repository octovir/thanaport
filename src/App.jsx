import { useState , useEffect } from 'react';
import axios from 'axios'

//import page
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Project from "./pages/Project";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path= '/' element={<Home />} />
        <Route path= '/home' element={<Home />} />
        <Route path= '/contact' element={<Contact />} />
        <Route path= '/Project' element={<Project />} />
      </Routes>
    </Router>
  )
}

export default App
