import React , {useState , useEffect} from 'react'
import Navbar from '../components/Navbar'
import ForContact from '../components/ForContact'
import Loading from '../components/Loading'

function Contact() {

  return (
    <>
    <Navbar />

    <main>
      <ForContact />
    </main>
    </>

  )
}

export default Contact