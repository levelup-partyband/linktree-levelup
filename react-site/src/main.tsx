import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import './index.css';

// Code-split heavy routes: Preventivo pulls in jsPDF, Materiali pulls in
// pdfjs-dist (~5.7MB). Keeping them lazy removes that weight from the
// homepage initial bundle.
const Eventi = lazy(() => import('./pages/Eventi'));
const Preventivo = lazy(() => import('./pages/Preventivo'));
const Materiali = lazy(() => import('./pages/Materiali'));
const Privacy = lazy(() => import('./pages/Privacy'));

function RouteFallback() {
  return (
    <div className="container-x py-32 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-brand-pink/30 border-t-brand-pink animate-spin" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="eventi" element={<Suspense fallback={<RouteFallback />}><Eventi /></Suspense>} />
          <Route path="preventivo" element={<Suspense fallback={<RouteFallback />}><Preventivo /></Suspense>} />
          <Route path="materiali" element={<Suspense fallback={<RouteFallback />}><Materiali /></Suspense>} />
          <Route path="privacy" element={<Suspense fallback={<RouteFallback />}><Privacy /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
