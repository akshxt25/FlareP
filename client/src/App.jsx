import React from 'react'
import Login from './components/Login'
import { BrowserRouter } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
    <Login/>
    </BrowserRouter>
  )
}

export default App