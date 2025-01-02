import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/Footer'
import Background from './components/Background'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'

const App = () => {
  return (
    <div>
    <Background/>
    <ToastContainer/>
<BrowserRouter>
<Routes>
  <Route path='/' element={<Index/>}/>
  <Route path='/login' element={<Login/>} />
  <Route path='/register' element={<Register/>} />
  <Route path='/home' element={<Home/>} />
</Routes>
<Footer />
</BrowserRouter>
</div>
  )
}

export default App