import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";
import OpenAI from "openai";
import './App.css';

function App() {
  const openai = new OpenAI({apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`, dangerouslyAllowBrowser: true});
  const [images, setImages] = useState([]);
  const [aiGenText, setAiGenText] = useState(null);

  const handleImageChange = (event) => {
    console.log("Handle image change triggered");
    const fileList = event.target.files;
    const imageList = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        imageList.push(event.target.result);
        setImages([...imageList]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (images.length === 0) {
      console.error('No images selected');
      return;
    }

    try {
      await generatePropertyDescription(images);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generatePropertyDescription = async (images) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: images.map(image => ({
          role: "user",
          content: [
            { type: "text", text: "Imagine you're a real estate agent tasked with creating a compelling property listing based on the provided images. Your goal is to attract potential buyers or renters by highlighting the key features, amenities, and unique characteristics of the property. Describe the property's size, layout, architectural style, and surroundings based on what you see in the images. Emphasize any notable selling points that would make this property desirable. Your description should be engaging and informative, painting a vivid picture of the property to entice viewers." },
            {
              type: "image_url",
              image_url: {
                "url": image,
              },
            }
          ],
        }))
      });

      setAiGenText(response.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="main">
      <div className="description">
        <h1>Image2Listing</h1>
      </div>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>
                Import Listing Images
              </Form.Label>
              <Form.Control 
                type="file" 
                accept='*'
                multiple 
                onChange={(e) => {handleImageChange(e)}} 
              />
            </Form.Group>
            <Button 
            type="submit"
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {aiGenText &&(
        <Card id="returnedResponse">
          <Card.Body>
            {aiGenText}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default App;