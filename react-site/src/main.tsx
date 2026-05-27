import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Eventi from './pages/Eventi';
import Preventivo from './pages/Preventivo';
import Materiali from './pages/Materiali';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="eventi" element={<Eventi />} />
          <Route path="preventivo" element={<Preventivo />} />
          <Route path="materiali" element={<Materiali />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
