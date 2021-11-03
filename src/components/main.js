import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BogglePage from '../pages/Boggle';
import ProfilePage from '../pages/Profile';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={BogglePage}></Route>
      <Route exact path='/profile' component={ProfilePage}></Route>
    </Switch>
  );
}

export default Main;