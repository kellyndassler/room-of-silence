import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands/hands";
import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";


const MPHands = (props) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const {setHandLandmarks} = props;

  console.log(props);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@latest/${file}`;
      },
    });
    hands.setOptions({
      modelComplexity: 1,
      maxNumHands: 2,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, []);

  const onResults = (results) => {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
    canvasCtx.translate(videoWidth, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiHandLandmarks) {
      setHandLandmarks(results.multiHandLandmarks);
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FFFFFF", lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  };

  return (
    <div>
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        style={{display: "none"}}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: 0,
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 1000,
          width: 400,
          height: 300,
        }}
      ></canvas>
    </div>
  );
};

export default MPHands;
