import React , {useState , useEffect} from 'react'
import Navbar from '../components/Navbar'
import ForContact from '../components/ForContact'
import Loading from '../components/Loading'
import Footer from '../components/Footer'

function Contact() {

  return (
    <>
    <Navbar />

    <main>
      <ForContact />
      <Footer />
    </main>
    </>

  )
}

export default Contact