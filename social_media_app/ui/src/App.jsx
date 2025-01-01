import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
<BrowserRouter>
<Routes>
  <Route path='/' element={<Index/>}/>
  <Route path='/login' element={<Login/>} />
  <Route path='/register' element={<Register/>} />
</Routes>
</BrowserRouter>
  )
}

export default App