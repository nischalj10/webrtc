import { type } from "@testing-library/user-event/dist/type";
import React, { useRef, useState } from "react";
import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

const Recorder = () => {
  const recorder = useRef(typeof RecordRTC);
  const cameraStream = useRef(typeof MediaStream);
  const screenStream = useRef(typeof MediaStream);
  const videoBlob = useRef(typeof Blob);
  const [videoUrl, setVideoUrl] = useState(typeof URL);

  // const captureCamera = (cb) => {
  //   navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(cb);
  // };

  // const invokeGetDisplayMedia = (success, error) => {
  //   var displaymediastreamconstraints = {
  //     video: {
  //       displaySurface: "monitor", // monitor, window, application, browser
  //       logicalSurface: true,
  //       cursor: "always", // never, always, motion
  //     },
  //   };
  //   // above constraints are NOT supported YET
  //   // that's why overridnig them
  //   displaymediastreamconstraints = {
  //     video: true,
  //   };

  //   if (navigator.mediaDevices.getDisplayMedia) {
  //     navigator.mediaDevices
  //       .getDisplayMedia(displaymediastreamconstraints)
  //       .then(success)
  //       .catch(error);
  //   } else {
  //     navigator
  //       .getDisplayMedia(displaymediastreamconstraints)
  //       .then(success)
  //       .catch(error);
  //   }
  // };

  // const keepStreamActive = (stream) => {
  //   var video = document.createElement("video");
  //   video.muted = true;
  //   video.srcObject = stream;
  //   video.style.display = "none";
  //   (document.body || document.documentElement).appendChild(video);
  // };

  // const captureScreen = () =>
  //   // console.log("captureScreen");
  //   keepStreamActive(screenStream);
  // captureCamera(function (cameraStream) {
  //   keepStreamActive(cameraStream);

  //   screenStream.width = window.screen.width;
  //   screenStream.height = window.screen.height;
  //   screenStream.fullcanvas = true;

  //   cameraStream.width = 320;
  //   cameraStream.height = 240;
  //   cameraStream.top = screenStream.height - cameraStream.height;
  //   cameraStream.left = screenStream.width - cameraStream.width;

  //   var recorder = RecordRTC([screenStream, cameraStream], {
  //     type: "video",
  //     mimeType: "video/webm",
  //     previewStream: function (s) {
  //       document.querySelector("video").muted = true;
  //       document.querySelector("video").srcObject = s;
  //     },
  //   });

  //   recorder.startRecording();

  //   window.stopCallback = function () {
  //     window.stopCallback = null;

  //     recorder.stopRecording(function () {
  //       var blob = recorder.getBlob();
  //       document.querySelector("video").srcObject = null;
  //       document.querySelector("video").src = URL.createObjectURL(blob);
  //       document.querySelector("video").muted = false;

  //       [screenStream, cameraStream].forEach(function (stream) {
  //         stream.getTracks().forEach(function (track) {
  //           track.stop();
  //         });
  //       });
  //     });
  //   };

  //   window.timeout = setTimeout(window.stopCallback, 10 * 1000);
  // });

  // const addStreamStopListener = (stream, callback) => {
  //   stream.addEventListener(
  //     "ended",
  //     function () {
  //       callback();
  //       callback = function () {};
  //     },
  //     false
  //   );
  //   stream.addEventListener(
  //     "inactive",
  //     function () {
  //       callback();
  //       callback = function () {};
  //     },
  //     false
  //   );
  //   stream.getTracks().forEach(function (track) {
  //     track.addEventListener(
  //       "ended",
  //       function () {
  //         callback();
  //         callback = function () {};
  //       },
  //       false
  //     );
  //     track.addEventListener(
  //       "inactive",
  //       function () {
  //         callback();
  //         callback = function () {};
  //       },
  //       false
  //     );
  //   });
  // };

  const startRecorder = async () => {
    //get camera stream
    const mediaDevices = navigator.mediaDevices;
    cameraStream.current = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    console.log("cameraStream", cameraStream.current);

    //get screen stream
    if (navigator.mediaDevices.getDisplayMedia) {
      screenStream.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
    } else {
      screenStream.current = await navigator.getDisplayMedia({ video: true });
    }

    console.log("screeeStream", screenStream.current);

    //resizing streams
    screenStream.current.width = window.screen.width;
    screenStream.current.height = window.screen.height;
    screenStream.current.fullcanvas = true;
    cameraStream.current.width = 320;
    cameraStream.current.height = 240;
    cameraStream.current.top =
      screenStream.current.height - cameraStream.current.height;
    cameraStream.current.left =
      screenStream.current.width - cameraStream.current.width;

    //creating recorder
    //   var recorder = RecordRTC([screenStream, cameraStream], {
    //     type: "video",
    //     mimeType: "video/webm",
    //     previewStream: function (s) {
    //       document.querySelector("video").muted = true;
    //       document.querySelector("video").srcObject = s;
    //     },
    //   });

    // recorder.current = new RecordRTCPromisesHandler(cameraStream.current, {
    //   type: "video",
    // });
    recorder.current = new RecordRTCPromisesHandler(
      [screenStream.current, cameraStream.current],
      {
        type: "video",
        mimeType: "video/webm",
      }
    );
    await recorder.current.startRecording();
    console.log("recorder started", recorder.current);
  };

  const stopRecorder = async () => {
    await recorder.current.stopRecording();
    videoBlob.current = await recorder.current.getBlob();
    cameraStream.current.stop();
    screenStream.current.stop();
    // console.log("videoBlob", videoBlob.current);
    setVideoUrl(window.URL.createObjectURL(videoBlob.current));
    cameraStream.current = null;
    screenStream.current = null;
    recorder.current = null;
  };

  return (
    <div style={{ marginTop: "20px", display: "flex" }}>
      <div>
        <button onClick={startRecorder}>Record</button>
        <button onClick={stopRecorder}>Stop</button>
        {<Player src={videoUrl} />}
      </div>
    </div>
  );
};

export default Recorder;
