import { Navbar, Nav, Container } from 'react-bootstrap';
import '../scss/NavBar.scss';

function NavBar() {
  return (
    <div className="NavBar">
        <Navbar id="bar" bg="primary" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand href="/">Boggle App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/">Boggle</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </div>
  );
}

export default NavBar;
