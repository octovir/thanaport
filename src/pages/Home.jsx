import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from '../components/Banner';
import About from '../components/About';

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