import React, { useState, useEffect } from 'react';
import { Image, Button } from 'react-bootstrap';
import NavBar from '../components/Navbar.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './Profile.css';

function ProfilePage({firebaseUser}) {

  const auth = getAuth();
  const user = auth.currentUser;

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
