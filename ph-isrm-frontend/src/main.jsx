import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// import React from "react";
// import ReactDOM from "react-dom/client";
// import Login from "./pages/login"
// import Dashboard from "./pages/Dashboard";

// const path = window.location.pathname;

// const App = () => {
//   if (path === "/dashboard") return <Dashboard />;
//   return <Login />;
// };

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
//<==========================================================================>
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// import React from 'react';
// import ReactDOM from "react-dom/client";
// import Login from "./pages/login";
// import Dashboard from './pages/Dashboard';

// const path = window.location.pathname;

// const App = () => {
//   if(path === "/dashboard") return <Dashboard />;
//   return <Login />;
// }

// ReactDOM.createRoot(document.getElementById("root")).render(<App/>);


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
