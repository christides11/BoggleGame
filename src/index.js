import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './custom.scss';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {firebaseConfig} from './firebase.js';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/Navbar.js';
import './index.css';

const app = initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <NavBar />
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
