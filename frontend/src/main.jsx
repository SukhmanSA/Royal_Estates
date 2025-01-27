import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import { store } from './redux/store.jsx'
import { Provider } from 'react-redux'
import dotenv from "dotenv"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
         <App/>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
