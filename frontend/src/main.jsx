import * as React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
)