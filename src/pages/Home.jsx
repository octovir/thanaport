import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from '../components/Banner';
import About from '../components/About';
import Works from '../components/Works';

function Home() {
  return (
    <>
    <Navbar />

    <main>
      <>
      <Banner />
      <About />
      </>
    </main>

    <Footer />
    

    </>
    
  )
}

export default Home