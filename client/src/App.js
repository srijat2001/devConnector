import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/register';
import Login from './components/auth/login';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import react,{Component} from 'react';
import {Provider} from 'react-redux';
import store from './store';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar/>
          <Route exact path="/" component={Landing}/>
          <div className="container">
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
          </div>
          <Footer/>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
