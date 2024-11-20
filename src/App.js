import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";
import "./App.css";

const App = () => {
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const webcamRef = useRef(null);

  useEffect(() => {
    moveDotRandomly();
    const interval = setInterval(moveDotRandomly, 5000); // Move dot every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const moveDotRandomly = () => {
    // Generate random positions for the dot within the viewport
    const x = Math.floor(Math.random() * (window.innerWidth - 50)); // Leave space for dot size
    const y = Math.floor(Math.random() * (window.innerHeight - 50)); // Leave space for dot size

    setDotPosition({ x, y });
  };

  const captureEyeData = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    // Log the dot's current coordinates
    console.log("Captured coordinates:", dotPosition);

    // Crop and save the eye region
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Define crop dimensions for the eye region
      const cropWidth = 150;
      const cropHeight = 50;
      const cropX = img.width / 2 - cropWidth / 2;
      const cropY = img.height / 4;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      // Convert canvas to blob and save the cropped image
      canvas.toBlob((blob) => {
        saveAs(blob, `eye_region_${Date.now()}.png`);
      });
    };
  };

  return (
    <div className="App">
      <h1>Eye Tracking Dataset Collection</h1>
      <div className="webcam-container">
        <Webcam ref={webcamRef} className="webcam" screenshotFormat="image/png" />
      </div>
      <div
        className="dot"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
        }}
      ></div>
      <button className="capture-button" onClick={captureEyeData}>
        Capture Eye Data
      </button>
    </div>
  );
};

export default App;







