import React, { useState } from 'react';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Switch, Route } from 'react-router-dom';
import BogglePage from '../pages/Boggle';
import ProfilePage from '../pages/Profile';

function Main({user, setUser}){
  const [firebaseUser, SetFirebaseUser] = useState(null);
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in.");
      SetFirebaseUser(user);
    } else {
      console.log("User logged out.");
      SetFirebaseUser(null);
    }
  });
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={() => (<BogglePage user={firebaseUser} />)}></Route>
      <Route exact path='/profile' component={() => (<ProfilePage firebaseUser={firebaseUser} />) }></Route>
    </Switch>
  );
}

export default Main;