import React, { useState, useEffect } from 'react';
import { Image, Button } from 'react-bootstrap';
import NavBar from '../components/Navbar.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './Profile.css';

function ProfilePage({firebaseApp, firebaseAnalytics}) {

  const auth = getAuth();
  const user = auth.currentUser;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      user.providerData.forEach((profile) => {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });    
    
    } else {
      // User is signed out
      // ...
    }
  });

  return (
    <div className="Profile">
      {user !== null &&
        <div>
          <div>Signed in as {user.displayName}</div>
          <div>Email: {user.email}</div>
          
        </div>
      }
      {user === null &&
        <div>
          <div>User is not signed in.</div>
        </div>
      }
    </div>
  );
}

export default ProfilePage;
