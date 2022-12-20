import React from 'react';
import { useEffect } from 'react';
import PhotoAlbum from "react-photo-album";
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

/* Import Assets */
import './App.css';
import headerImage from './images/creationHeader.PNG';
import image1 from './images/emojiBling.png';
import image2 from './images/emojiGrillz.jpg';
import logo from './logo.svg';

function App() {
  const [prompt, setPrompt] = React.useState('')
  const [continuous, updateContinuous] = React.useState()
  const [photos, updatePhotos] = React.useState([])
  const [loading, updateLoading] = React.useState(false)

  /* Change prompt when textbox changes */
  const handleChange = (event) => setPrompt(event.target.value)

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

  /* This is the continuous generation loop */
  /* Continuously generate images until continuous is false */
  useEffect(() => {
    const generate = async (oldPrompt, oldPhotos) => {
      if(continuous){
      /* json post request to the backend */
      const result = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "prompt": oldPrompt,
          "steps": 50
        })
      });

      result.json().then(data => {
        console.log(data);
        const magic = { src: 'data:image/png;base64,' + data.images[0], width: 900, height: 512 }
          updatePhotos([
            { src: 'data:image/png;base64,' + data.images[0], width: 900, height: 512 },
            ...oldPhotos
          ]);
        });
      }

      updateLoading(false)
    };

    if(loading == false) {
      updateLoading(true);
      generate(prompt, photos);
    }
  });

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
                  width={"300px"}
                ></Input>
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