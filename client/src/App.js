import React, {
  useEffect, useState, useRef, useMemo
} from "react";
import {
  Avatar, Box, Button, Container,
  Grow, IconButton, LinearProgress, List, ListItem,
  ListItemAvatar, ListItemSecondaryAction,
  ListItemText, Paper, TextField, Typography
} from "@material-ui/core";
import moment from "moment";
import { Howl } from "howler";
import Peer from "simple-peer";
import io from "socket.io-client";
import { ToastsStore } from "react-toasts";
import ringtone from "assets/ringtone.mp3";
import Background from "components/Background";
import { useDialog } from "components/DialogProvider";
import { Add, Call as CallIcon, Cancel } from "@material-ui/icons";
import Call from "./Call";
import useStyles from "./App.style";

const ringtoneSound = new Howl({
  src: [ringtone],
  preload: true
});

const App = () => {
  const [lobby, setLobby] = useState([]);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState(false);
  const [callTo, setCallTo] = useState("");
  const incomingSignal = useRef(null);
  const socket = useRef(null);
  const classes = useStyles();
  const dialog = useDialog();

  const OWNER_NAME = process.env.REACT_APP_OWNER_NAME;

  const lobbied = useMemo(() => Boolean(
    lobby.find((p) => socket.current.id === p.id)
  ), [lobby]);

  useEffect(() => {
    socket.current = io.connect("/");

    // socket.current.on("connect", () => setReady(true));
    socket.current.on("newLobby", setLobby);
    socket.current.on("ownershipGranted", () => setOwner(true));
    // socket.current.on("ownerArrived", () => setOwnerPresence(true));
    // socket.current.on("ownerLeft", () => setOwnerPresence(false));
    socket.current.on("kicked", () => ToastsStore.error("You've been removed from the lobby"));
    socket.current.on("callRequested", (signal) => {
      ringtoneSound.play();
      incomingSignal.current = signal;
      dialog.create({
        title: `${OWNER_NAME} is ready to take your call!`,
        cancelLabel: "Cancel",
        confirmLabel: "Answer",
        onContinue: () => setCallTo({ name: OWNER_NAME }),
        onCancel: () => socket.current.emit("rejectCall")
      });
    });
  }, [dialog]);

  const joinLobby = async () => socket.current.emit("joinLobby", name);
  const kick = (id) => socket.current.emit("kick", id);
  const claimOwnership = () => {
    let password;
    dialog.create({
      title: "Enter your password",
      onContinue: () => socket.current.emit("claimOwnership", password),
      children: (
        <TextField
          onChange={({ target: { value } }) => {
            password = value;
          }}
        />
      )
    });
  };

  if (callTo) {
    return (
      <Call
        initiator={owner}
        incomingSignal={incomingSignal.current}
        socket={socket.current}
        peerInfo={callTo}
        onEndCall={() => setCallTo(null)}
      />
    );
  }
  
  return (
    <Container maxWidth="md" className={classes.container}>
      <Background />
      <Grow in style={{ transitionDelay: 100 }}>
        <Box className={classes.innerContainer}>
          <Typography variant="h4" className={classes.bold}>
            {`${OWNER_NAME}'s Office`}
          </Typography>
          <Paper className={classes.form}>

            {
              !Peer.WEBRTC_SUPPORT
                ? (
                  <>
                    <Typography>
                      Your browser is too lame for this app, up your game!
                    </Typography>
                    <LinearProgress />
                  </>
                )
                : (
                  !owner
                    ? (
                      !lobbied ? (
                        <Box>
                          <Typography paragraph>
                            Write down your name and join the queue!
                          </Typography>
                          <Box className={classes.inputContainer}>
                            <TextField
                              onChange={({ target: { value } }) => setName(value)}
                              fullWidth
                            />
                            <IconButton
                              disabled={name.length < 2}
                              onClick={joinLobby}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </Box>
                      )
                        : (
                          <Typography variant="body2">
                            Alrighty, now is time to wait.
                            <br />
                            {`${OWNER_NAME} will pick up anytime soon!`}
                          </Typography>
                        )

                    )
                    : (
                      <Typography>
                        Answer people in the queue
                      </Typography>
                    )
                )
            }
            <List>
              {
                lobby.map((participant) => (
                  <ListItem selected={socket.current.id === participant.id}>
                    <ListItemAvatar>
                      <Avatar>
                        {participant.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={participant.name}
                      secondary={`Joined ${moment(participant.joinedAt).fromNow()}`}
                    />
                    {
                      owner && (
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => kick(participant.id)}>
                            <Cancel />
                          </IconButton>
                          <IconButton onClick={() => setCallTo(participant)}>
                            <CallIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )
                    }
                  </ListItem>
                ))
              }
            </List>
            {
              !owner && !lobbied && (
                <Button
                  className={classes.buzzInButton}
                  variant="text"
                  onClick={claimOwnership}
                >
                  <Typography variant="caption">
                    {`Are you ${OWNER_NAME}? Buzz yourself in!`}
                  </Typography>
                </Button>
              )
            }
          </Paper>
        </Box>
      </Grow>
    </Container>
  );
};

export default App;
