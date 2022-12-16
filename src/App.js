import React from 'react';
import { useEffect } from 'react';
import logo from './logo.svg';
import headerImage from './images/creationHeader.PNG';
import './App.css';
import PhotoAlbum from "react-photo-album";
import image1 from './images/emojiBling.png';
import image2 from './images/emojiGrillz.jpg';
import {
  ChakraProvider,
  Heading,
  Container,
  Text,
  Input,
  Button,
  Wrap,
  Stack, 
  Image,
  Link,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = React.useState('')
  const [image, updateImage] = React.useState()
  const [loading, updateLoading] = React.useState()
  const [continuous, updateContinuous] = React.useState()
  const [photos, updatePhotos] = React.useState([])

  const handleChange = (event) => setPrompt(event.target.value)

  const delay = ms => new Promise(res => setTimeout(res, ms))

  const generate = async (prompt) => {
    updateLoading(true);
    // const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
    const result = await axios.get('https://upload.wikimedia.org/wikipedia/commons/6/6a/PNG_Test.png');
    updatePhotos(
      [
        ...photos,
        { src: image1, width: 900, height: 512 }
      ]
    );
    updateImage(result.data);
    updateLoading(false);
  };

  const clearPhotos = () => {
    updatePhotos([]);
  };

  const startStop = () => {
    if(continuous == true) {
      updateContinuous(false);
    }
    else {
      updateContinuous(true);
    }
  };

const SECOND_MS = 1000;

useEffect(() => {
  const interval = setInterval(() => {
    console.log('Logs every second');
  }, SECOND_MS);

  return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [])

  return (
    <div className="App">
        <ChakraProvider>
            <Container>
              <Image src={headerImage}/>
               <Wrap marginBottom={"10px"}>
                <Input
                  value={prompt}
                  onChange={handleChange}
                  placeholder='what do you want to see?'
                  width={"350px"}
                ></Input>
                <Button onClick={(e) => generate(prompt)} colorScheme={"green"}>
                  Generate
                </Button>
                <Button onClick={(e) => startStop()} colorScheme={"yellow"}>
                  Start/Stop
                </Button>
                <Button onClick={(e) => clearPhotos()} colorScheme={"red"}>
                  Clear
                </Button>
              </Wrap>
            </Container>
        </ChakraProvider>
        <PhotoAlbum layout="rows" photos={photos} />
    </div>
  );
}

export default App;