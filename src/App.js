import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";
import OpenAI from "openai";
import './App.css';

function App() {
  const openai = new OpenAI({apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`, dangerouslyAllowBrowser: true});
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (event) => {
    console.log("Handle image change triggered");
    const fileList = event.target.files;
    const imageList = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        imageList.push(event.target.result); // Pushing base64 data to the list
        setImages([...imageList]);
      };
      reader.readAsDataURL(file); // Reading file as base64
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

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
            { type: "text", text: "Please generate a descriptive property listing based on the provided images. Describe the property's key features, amenities, and any notable characteristics that can be inferred from the images. Be sure to include details about the property's size, layout, architectural style, surroundings, and any unique selling points. Your description should be engaging and informative, aimed at attracting potential buyers or renters." },
            {
              type: "image_url",
              image_url: {
                "url": image,
              },
            }
          ],
        }))
      });

      console.log(response.choices[0]);
      // Handle response as needed
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
                multiple 
                onChange={(e) => {handleImageChange(e)}} 
              />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default App;
