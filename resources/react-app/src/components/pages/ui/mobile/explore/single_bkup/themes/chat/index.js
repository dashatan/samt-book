import React, {useEffect, useState} from "react";
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Axios from "axios";
import {ArrowBack, AttachFile, Done, DoneAll, PlayArrow, Send} from "@material-ui/icons";
import {Fab, Zoom} from "@material-ui/core";
import {useHistory, useLocation} from "react-router";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import translate from "../../../../../../../translate";
import Grid from "@material-ui/core/Grid";
import {lightBlue, lightGreen} from "@material-ui/core/colors";
import Dropzone from "dropzone";
import Divider from "@material-ui/core/Divider";
import Store from "../../../../../../../redux/store";
import Echo from "../../../../../../../echo";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
  }
}

const Chat = (props) => {
  let {push, location} = useHistory();
  if (!props.user) {
    push(location.pathname.replace('/chat', ''))
  }
  let {goBack} = useHistory();
  let {state} = useLocation();
  let [opponentUser, setOpponentUser] = useState(state.opponentUser || false);
  let [messages, setMessages] = useState([]);
  let [loading, setLoading] = useState(false);
  let [btnLoading, setBtnLoading] = useState(false);
  let [message, setMessage] = useState('');
  let [room, setRoom] = useState(state.room || false);
  let [dzInitialize, setDzInitialize] = useState(false);
  let [dzInitialized, setDzInitialized] = useState(false);
  let [echoInitialized, setEchoInitialized] = useState(false);

  useEffect(() => {
    !opponentUser && getReceiverUser();
    opponentUser && getMessages();
  }, [])
  if (room && !echoInitialized) {
    setEchoInitialized(true);
    Echo().private(`chat.${room.id}`)
    .listen('MessageSent', () => {
      getMessages(false);
    });
  }

  const getReceiverUser = () => {
    setLoading(true);
    const url = `${props.baseUrl}/api/single/getReceiverUser`;
    let data = {userId: state.opponentUserId}
    Axios.post(url, data).then(e => {
      setLoading(false);
      setOpponentUser(e.data);
      getMessages();
    }).catch(e => {
      setLoading(false);
      console.log(e);
    })
  }

  const getMessages = (showLoading) => {
    setLoading(showLoading || true);
    const url = `${props.baseUrl}/api/single/getMessages`;
    let data = {
      userId: props.user.id,
      opponentUserId: state.opponentUser ? state.opponentUser.id : state.opponentUserId
    }
    if (room) {
      data.roomId = room.id;
    }
    Axios.post(url, data).then(e => {
      setLoading(false);
      setMessages(e.data.messages.data);
      setRoom(e.data.room);
      let scrollElement = document.getElementById('chat-scroll-element');
      scrollElement.scrollTop = scrollElement.scrollHeight;
      if (!dzInitialized) {
        setDzInitialize(true);
      }
      getUser()
    }).catch(e => {
      setLoading(false);
      console.log(e);
    })
  }

  const getUser = () => {
    let url = props.baseUrl + '/api/profile/getUser';
    Axios.post(url, {userToken: props.userToken}).then(e => {
      Store.dispatch({
        type: 'user',
        payload: e.data,
      });
    }).catch(e => {
      console.log(e);
      localStorage.removeItem('userToken');
      Store.dispatch({
        type: "user",
        payload: null
      });
      Store.dispatch({
        type: 'userToken',
        payload: null
      });
    })
  };

  const sendMessage = () => {
    setMessage('');
    if (room && message && props.user) {
      setBtnLoading(true);
      const url = props.baseUrl + '/api/single/sendMessage';
      const data = {
        type: 'text',
        message,
        userId: props.user.id,
        opponentUserId: state.opponentUserId,
        roomId: room.id,
      };
      Axios.post(url, data).then(e => {
        setBtnLoading(false);
        let newMessages = [
          e.data.message,
          ...messages,
        ]
        setMessages(newMessages);
        let scrollElement = document.getElementById('chat-scroll-element');
        scrollElement.scrollTop = scrollElement.scrollHeight;

      }).catch(e => {
        setBtnLoading(false);
        console.log(e);
      })
    }
  }

  //media
  let setMedia;
  if (dzInitialize && !dzInitialized) {
    setMedia = new Dropzone("#dz-element", {
      url: props.baseUrl + '/api/single/sendMediaMessage',
      clickable: "#dz-clickable",
      resizeWidth: 600,
      maxFilesize: 20,
    });
    setDzInitialized(true);
    setMedia.on('sending', function (file, xhr, formData) {
      formData.append('userId', props.user.id);
      formData.append('roomId', room.id);
      setBtnLoading(true);
    });
    setMedia.on('success', function (file, response) {
      setBtnLoading(false);
      console.log(response);
      let newMessages = [
        response.message,
        ...messages,
      ]
      console.log(newMessages)
      setMessages(newMessages);
    });
    setMedia.on('error', function (file, response) {
      setBtnLoading(false);
      alert(translate('خطا'))
      console.log(response);
    });
  }

  return (
    <Slide in={true} direction="left">
      <Box
        id="chat-scroll-element"
        style={{
          position: 'fixed',
          zIndex: 10000,
          height: '100vh',
          width: '100%',
          top: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: `#ffffff`,
          backgroundImage: `url("${props.baseUrl}/images/backgrounds/chat.jpg")`,
          backgroundSize: 'contain',
        }}
      >
        <Box id="dz-element" style={{display: 'none'}}/>
        <Box style={{height: 60}}>
          <AppBar position="fixed" color="inherit">
            <Toolbar
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                {opponentUser && (
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Avatar src={opponentUser.avatar}/>
                    <Box style={{width: 10}}/>
                    <Typography>{opponentUser.name}</Typography>
                  </Box>
                )}

              </Box>
              <Fab
                size="small"
                focusRipple
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              >
                <ArrowBack onClick={goBack}/>
              </Fab>
            </Toolbar>
          </AppBar>
        </Box>
        <Box
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'column-reverse'
          }}
        >
          {loading && (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <Fab size="small" style={{backgroundColor: "#ffffff"}}>
                <CircularProgress size={20} color="primary"/>
              </Fab>
            </Box>
          )}
          {messages.map((messageItem, key) => {

            let userOwnsMessage = parseInt(messageItem.user_id) === props.user.id;
            let messageIsShort = messageItem.displayType === 'text' && messageItem.message.length <= 40;
            let messageIsLong = messageItem.displayType === 'text' && messageItem.message.length > 40;
            let newDay = messages[key - 1] && messages[key - 1].date > messageItem.date;
            let textTypeStyles = {
              width: 'fit-content',
              backgroundColor: userOwnsMessage ? lightGreen["200"] : '#ffffff',
              color: '#000000',
              padding: '5px 10px',
              borderRadius: 10,
              borderBottomLeftRadius: userOwnsMessage ? 10 : 0,
              borderBottomRightRadius: userOwnsMessage ? 0 : 10,
            }
            let infoBarStyles = {display: "flex"}
            if (messageIsShort) {
              textTypeStyles = {
                ...textTypeStyles,
                display: 'flex',
              }
              infoBarStyles = {
                ...infoBarStyles,
                paddingLeft: 10,
                paddingTop: 5,
              }
            }
            let infoBar = <Box style={infoBarStyles}>
              {parseInt(messageItem.seen) === 0
                ? <Done style={{fontSize: 16, color: 'cornflowerblue'}}/>
                : <DoneAll style={{fontSize: 16, color: 'cornflowerblue'}}/>
              }
              <Typography variant="caption">
                {messageItem.time}
              </Typography>
            </Box>;
            return (
              <Box key={key} style={{marginBottom: 20}}>
                {newDay && (
                  <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Typography
                      variant="caption" style={{
                      padding: '5px 10px',
                      borderRadius: 10,
                      backgroundColor: lightBlue["100"],
                    }}
                    >
                      {messageItem.date}
                    </Typography>
                  </Box>
                )}
                <Grid container spacing={3}>
                  {!userOwnsMessage && <Grid item xs={2}></Grid>}
                  <Grid
                    item xs={10} style={{
                    display: 'flex',
                    justifyContent: userOwnsMessage ? 'flex-start' : 'flex-end',
                  }}
                  >
                    {messageItem.displayType === 'text' && (
                      <Box
                        style={textTypeStyles}
                      >
                        {messageIsShort && (
                          infoBar
                        )}
                        <Typography>
                          {messageItem.message}
                        </Typography>
                        {messageIsLong && (
                          <Box>
                            <Divider style={{margin: '5px 0'}}/>
                            {infoBar}
                          </Box>
                        )}
                      </Box>
                    )}
                    {messageItem.displayType === 'image' && (
                      <a
                        href={messageItem.image}
                        data-fancybox="mediaMessage"
                        style={{
                          position: 'relative',
                          width: '100%',
                          display: 'flex',
                          borderRadius: 20,
                          borderBottomLeftRadius: userOwnsMessage ? 20 : 0,
                          borderBottomRightRadius: userOwnsMessage ? 0 : 20,
                          overflow: 'hidden',
                          border: '2px solid',
                          borderColor: userOwnsMessage ? lightGreen["200"] : '#ffffff'
                        }}
                      >
                        <img src={messageItem.image} alt={messageItem.id} style={{width: '100%'}}/>
                        <Box
                          style={{
                            position: 'absolute',
                            bottom: 5,
                            right: 5,
                            padding: '5px 10px',
                            borderRadius: 10,
                            backgroundColor: 'rgb(0,0,0,0.5)',
                            color: '#ffffff',
                            pointerEvents: 'none'
                          }}
                        >
                          {infoBar}
                        </Box>
                      </a>
                    )}
                    {messageItem.displayType === 'video' && (
                      <a
                        href={messageItem.video}
                        data-fancybox="mediaMessage"
                        style={{
                          position: 'relative',
                          width: '100%',
                          display: 'flex',
                          borderRadius: 20,
                          borderBottomLeftRadius: userOwnsMessage ? 0 : 20,
                          borderBottomRightRadius: userOwnsMessage ? 20 : 0,
                          overflow: 'hidden',
                          border: '2px solid',
                          borderColor: userOwnsMessage ? lightGreen["200"] : '#ffffff'
                        }}
                      >
                        <Box
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#ffffff',
                            pointerEvents: 'none'
                          }}
                        >
                          <PlayArrow style={{fontSize: 60}} color="inherit"/>
                        </Box>
                        <Box
                          style={{
                            position: 'absolute',
                            bottom: 5,
                            right: 5,
                            padding: '5px 10px',
                            borderRadius: 10,
                            backgroundColor: 'rgb(0,0,0,0.5)',
                            color: '#ffffff',
                            pointerEvents: 'none'
                          }}
                        >
                          {infoBar}
                        </Box>
                        <video src={messageItem.video} style={{width: '100%'}}/>
                      </a>
                    )}
                  </Grid>
                  {userOwnsMessage && <Grid item xs={2}></Grid>}
                </Grid>
              </Box>
            )
          })}
        </Box>
        <Box style={{height: 60}}>
          <Box
            style={{
              position: 'fixed',
              width: '100%',
              height: 'auto',
              bottom: 0,
              right: 0,
              zIndex: 100000,
              backgroundColor: '#ffffff',
            }}
          >
            <Box style={{padding: 10}}>
              <Grid container spacing={3}>
                <Grid item xs={2}>
                  <Zoom
                    in={message}
                    style={{
                      display: message ? 'flex' : 'none'
                    }}
                  >
                    <Fab color="primary" size="medium" onClick={sendMessage}>
                      {btnLoading && (
                        <CircularProgress size={24} color={"inherit"}/>
                      )}
                      {!btnLoading && (
                        <Send
                          style={{
                            position: 'relative',
                            left: '2.5px'
                          }}
                        />
                      )}
                    </Fab>
                  </Zoom>
                  <Zoom
                    in={!message} style={{
                    display: !message ? 'flex' : 'none'
                  }}
                  >
                    <Fab id="dz-clickable" color="primary" size="medium">
                      {btnLoading && (
                        <CircularProgress size={24} color={"inherit"}/>
                      )}
                      {!btnLoading && (
                        <AttachFile/>
                      )}
                    </Fab>
                  </Zoom>
                </Grid>
                <Grid
                  item xs={10} style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                >
                  <TextField
                    multiline
                    fullWidth
                    placeholder={translate('پیام خود را بنویسید')}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                    }}
                    style={{
                      maxHeight: 200,
                      overflowY: 'auto'
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Slide>
  )
}

export default connect(mapStateToProps)(Chat)