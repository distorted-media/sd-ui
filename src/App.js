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
  const [prompt, setPrompt] = React.useState('') // prompt for the model
  const [photos, updatePhotos] = React.useState([])
  const [loading, updateLoading] = React.useState(false)
  const [startButtonState, updateStartButtonState] = React.useState(false)
  const [startButtonColor, updateStartButtonColor] = React.useState('green')
  const [startButtonText, updateStartButtonText] = React.useState('Start')

  let mutex = false;

  /* Change prompt when textbox changes */
  const handleChange = (event) => setPrompt(event.target.value)

  /* Clear all photos */
  const clearPhotos = () => {
    updatePhotos([]);
  };

  /* Start or stop continuous generation of images */
  const startStop = () => {
    /* Curently generating images, set state to false */
    if(startButtonState === true) {
      updateStartButtonState(false);
      updateStartButtonColor('green');
      updateStartButtonText('Start');
    }
    /* Not currently generating images, set state to true */
    else {
      updateStartButtonState(true);
      updateStartButtonColor('red');
      updateStartButtonText('Stop');
    }
  };

  /* This is the continuous generation loop */
  /* Continuously generate images until continuous is false */
  useEffect(() => {
    const generate = async (oldPrompt, oldPhotos) => {
      if (mutex) {
        return;
      }
      if(startButtonState === true){
      mutex = ture;
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
          updatePhotos([
            { src: 'data:image/png;base64,' + data.images[0], width: 900, height: 512 },
            ...oldPhotos
          ]);
        });
      }
      mutex = false;
    };
    generate(prompt, photos);
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
                <Button onClick={(e) => startStop()} colorScheme={startButtonColor}>
                  {startButtonText}
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