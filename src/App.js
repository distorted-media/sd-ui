import logo from './logo.svg';
import './App.css';
import PhotoAlbum from "react-photo-album";
import image1 from './images/emojiBling.png';
import image2 from './images/emojiGrillz.jpg';

const photos = [
    { src: image1, width: 900, height: 512 },
    { src: image2, width: 216, height: 233 },
];

function App() {
  return (
    <div className="App">
      <PhotoAlbum layout="rows" photos={photos} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// export default App;