// src/index.js — REPLACE karo apna purana index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/theme.css';
import './index.css';
import './styles/premium.css';
import './styles/admin-premium.css';
import './styles/luxuryStayTheme.css';
import App from './App';
import { AuthProvider } from './Context/AuthContext'; // ✅ apna exact path check karo

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>   {/* ✅ App ke upar wrap karo */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);