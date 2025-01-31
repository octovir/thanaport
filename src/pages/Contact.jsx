import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Form from '../components/Form'
import Inform from '../components/Inform'

function Contact() {
  return (
    <>
    <Navbar />

    <main>
      <Inform />
      <Form />
    </main>

    <Footer />
    </>

  )
}

export default Contact