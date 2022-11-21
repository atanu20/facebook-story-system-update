import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Home from './page/Home';

import Error from './component/Error'
import './App.css';
import Story from './page/story/Story';
import Register from './page/Register';
import Login from './page/Login';

const App = () => {
  return (
    <>
   
    <Switch>
      <Route exact path ="/" component={Home}/>
      <Route exact path ="/story/:id" component={Story}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
      <Route component={Error} />
     
    </Switch>
    
     

    </>
  )
}

export default App;



