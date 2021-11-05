import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import "../scss/NavBar.scss";

function NavBar({user, setUser}) {

  const [loginState, SetLoginState] = useState(false);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  function TrySignIn(){
    signInWithPopup(auth, provider).then((result) =>{
      
    }).catch((error) => {
      console.log(error);
    })
  }

  function TrySignOut(){
    signOut(auth).then(() => {
      SetLoginState(false);
    }).catch((error) =>{
      console.log(error);
    })
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      SetLoginState(true);
      // ...
    } else {
      // User is signed out
      // ...
      SetLoginState(false);
    }
  });

  return (
    <div className="NavBar">
        <Navbar id="bar" bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Boggle Game</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Play</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </Nav>
              <Nav>
                { loginState === true &&
                  <Nav.Link onClick={() => TrySignOut()}>Log Out</Nav.Link>
                }
                {
                  loginState === false &&
                  <Nav.Link onClick={() => TrySignIn()}>Sign In</Nav.Link>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </div>
  );
}

export default NavBar;
