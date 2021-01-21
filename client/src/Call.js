import {
  Box, Container, IconButton, Paper, Tooltip, Typography
} from "@material-ui/core";
import {
  CallEnd, Mic, Videocam, MicOff, VideocamOff, ScreenShare, StopScreenShare
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useState, useLayoutEffect, useRef } from "react";
import { ToastsStore } from "react-toasts";
import Peer from "simple-peer";
import useStyles from "./Call.style";

const {
  REACT_APP_ICE_SERVER_PASSWORD,
  REACT_APP_ICE_SERVER_USERNAME
} = process.env;

export default ({
  onEndCall, initiator, incomingSignal, socket, peerInfo
}) => {
  const classes = useStyles();
  const [mainVideo, setMainVideo] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const selfScreenStream = useRef(null);
  const selfMainStream = useRef(null);
  const selfPeer = useRef(null);
  const peerVideo = useRef(null);
  const selfVideo = useRef(null);

  const stopSharingScreen = () => {
    const [screenTrack] = selfScreenStream.current.getVideoTracks();
    const [cameraTrack] = selfMainStream.current.getVideoTracks();
    selfPeer.current.replaceTrack(screenTrack, cameraTrack, selfMainStream.current);
    selfVideo.current.srcObject = selfMainStream.current;
    selfScreenStream.current = null;
    setShareScreen(false);
  };
  
  const toggleMainVideo = () => setMainVideo(!mainVideo);
  
  const toggleMic = () => {
    const [audio] = selfMainStream.current.getAudioTracks();
    audio.enabled = !mic;
    setMic(!mic);
  };

  const toggleCam = () => {
    const [audio] = selfMainStream.current.getVideoTracks();
    audio.enabled = !cam;
    setCam(!cam);
  };
  
  const toggleShareScreen = () => {
    if (shareScreen) stopSharingScreen();
    else {
      navigator
        .mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((streamChannel) => {
          selfScreenStream.current = streamChannel;
          const [screenTrack] = streamChannel.getVideoTracks();
          const [cameraTrack] = selfMainStream.current.getVideoTracks();
          selfPeer.current.replaceTrack(cameraTrack, screenTrack, selfMainStream.current);
          selfVideo.current.srcObject = streamChannel;
          screenTrack.onended = stopSharingScreen;
          setShareScreen(true);
        });
    }
  };

  useLayoutEffect(() => {
    navigator
      .mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then((stream) => {
        selfPeer.current = new Peer({
          trickle: false,
          initiator,
          config: {
            iceServers: [
              {
                urls: "stun:numb.viagenie.ca",
                username: REACT_APP_ICE_SERVER_USERNAME,
                credential: REACT_APP_ICE_SERVER_PASSWORD
              },
              {
                urls: "turn:numb.viagenie.ca",
                username: REACT_APP_ICE_SERVER_USERNAME,
                credential: REACT_APP_ICE_SERVER_PASSWORD
              }
            ]
          },
          stream,
        });
        selfMainStream.current = stream;
        selfVideo.current.srcObject = stream;
        
        socket.once("callAccepted", (data) => selfPeer.current.signal(data));
        socket.once("callClosed", () => {
          ToastsStore.error("User has disconnected from the call");
          onEndCall();
        });

        selfPeer.current.on("error", onEndCall);
        selfPeer.current.on("stream", (data) => {
          peerVideo.current.srcObject = data;
        });

        if (!initiator) selfPeer.current.signal(incomingSignal);
        selfPeer.current.on("signal", (data) => {
          if (initiator) socket.emit("requestCall", { to: peerInfo.id, signal: data });
          else socket.emit("acceptCall", data);
        });
      })
      .catch((err) => {
        console.log(err);
        ToastsStore.error("You must grant video and audio permission in order to take the call");
      });
      
    return () => {
      if (selfPeer.current) selfPeer.current.destroy();
      socket.emit("closeCall");
    };
  }, [incomingSignal, socket, peerInfo.id, onEndCall, initiator]);

  return (
    <Box className={classes.container}>
      <Container maxWidth="md" className={classes.innerContainer}>
        <Box
          className={clsx({
            [classes.mainVideo]: !mainVideo,
            [classes.subVideo]: mainVideo
          })}
        >
          <Box position="relative">
            <video
              ref={peerVideo}
              autoPlay
              onClick={toggleMainVideo}
              height="100%"
              width="100%"
              playsInline
            />
            <Box className={classes.bottomOverlay}>
              <Typography variant="h5">
                {peerInfo.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          className={clsx({
            [classes.subVideo]: !mainVideo,
            [classes.mainVideo]: mainVideo
          })}
        >
          <Box position="relative">
            <video
              height="100%"
              width="100%"
              onClick={toggleMainVideo}
              muted
              ref={selfVideo}
              autoPlay
              playsInline
            />
            <Box className={classes.bottomOverlay}>
              <Typography variant="h5">
                You
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      <Paper className={classes.controlBar} elevation={15}>
        <Typography variant="h5" className={classes.peerName}>
          {`You are talking to ${peerInfo.name}`}
        </Typography>
        <Box className={classes.controls}>
          <Tooltip title={mic ? "Mute Mic" : "Unmute Mic"}>
            <IconButton onClick={toggleMic}>
              {
                mic
                  ? <Mic color="secondary" />
                  : <MicOff color="secondary" />
              }
            </IconButton>
          </Tooltip>

          <Tooltip title="End Call">
            <IconButton onClick={onEndCall}>
              <CallEnd color="error" />
            </IconButton>
          </Tooltip>

          <Tooltip title={cam ? "Disable Video" : " Enable Video"}>
            <IconButton onClick={toggleCam}>
              {
                cam
                  ? <Videocam color="secondary" />
                  : <VideocamOff color="secondary" />
              }
            </IconButton>
          </Tooltip>

          <Tooltip title={shareScreen ? "Disable Video" : " Enable Video"}>
            <IconButton onClick={toggleShareScreen}>
              {
                shareScreen
                  ? <StopScreenShare color="secondary" />
                  : <ScreenShare color="secondary" />
              }
            </IconButton>
          </Tooltip>

        </Box>
        <Box className={classes.controlFill} />
      </Paper>
    </Box>
  );
};
