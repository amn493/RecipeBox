import logo from './logo.svg';
import Navbar from './Navbar.js'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container">
        <Navbar signedIn="true" />

        <p>Page content starts here! There's padding within the navbar which is why this looks off.</p>
    </div>
  );
}

export default App;
