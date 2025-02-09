import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Works from '../components/Works'
import Loading from '../components/Loading'

function Display() {
  return (
    <>
    <Navbar />
    <main>
        <Loading />
    </main>
    </>
  )
}

export default Display