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
  const [continuous, updateContinuous] = React.useState()
  const [photos, updatePhotos] = React.useState([])

  const handleChange = (event) => setPrompt(event.target.value)

  const delay = ms => new Promise(res => setTimeout(res, ms))

  /* Generate a single image and add it to photos */
  const generate = async (prompt) => {
    /* json post request to the backend */
    const result = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // body: {
      //   "prompt": "puppy",
      //   "steps": 100
      // }
      body: JSON.stringify({
        "prompt": prompt,
        "steps": 5
      })
    });

    result.json().then(data => {
      console.log(data);
      updatePhotos(
        [
          { src: 'data:image/png;base64,' + data.images[0], width: 900, height: 512 },
          ...photos
        ]
      );
    });
  };

  /* Clear all photos */
  const clearPhotos = () => {
    updatePhotos([]);
  };

  /* Start or stop continuous generation */
  const startStop = () => {
    if(continuous == true) {
      updateContinuous(false);
    }
    else {
      updateContinuous(true);
    }
  };

const SECOND_MS = 1000;

/* This is the continuous generation loop */
/* Continuously generate images until continuous is false */
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