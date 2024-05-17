import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App.jsx'
// import './index.css'
import './main.scss' //bootstrap including theming
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
