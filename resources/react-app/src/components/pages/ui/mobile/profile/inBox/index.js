import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import Axios from "axios";
import Store from "../../../../../redux/store";
import translate from "../../../../../translate";
import Slide from "@material-ui/core/Slide";
import {AppBar, Box, Fab, Toolbar, Typography} from "@material-ui/core";
import {Add, ArrowBack} from "@material-ui/icons";
import {Route, Switch, useHistory} from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Card from "@material-ui/core/Card";
import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import {green} from "@material-ui/core/colors";
import {Link, useLocation, useRouteMatch} from "react-router-dom";
import Chat from "../../explore/single/themes/chat";
import BulkMessages from "./bulk-messages";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
    rooms: state.rooms,
  }
}

const Inbox = (props) => {
  let [rooms, setRooms] = useState(props.rooms || []);
  let {state} = useLocation();//داده های مورد نیازی که از طریق route باید فرستاده شود
  let {goBack, push} = useHistory();
  let {path, url} = useRouteMatch();
  let [noResults, setNoResults] = useState(false);
  let [loading, setLoading] = useState(false);


  const getRooms = () => {
    setLoading(true);
    const url = props.baseUrl + '/api/profile/getRooms';
    let data = {userToken: props.userToken}
    Axios.post(url, data).then(e => {
      setLoading(false);
      Store.dispatch({
        type: 'rooms',
        payload: e.data,
      })
      setRooms(e.data);
      setNoResults(e.data.length === 0);
    }).catch(e => {
      setLoading(false);
      console.log(e);
      alert(translate('خطا در دریافت پیام ها') + '!');
    })
  }

  useEffect(() => {
    getRooms();
  }, [])


  const chat = (room, opponentUser) => {
    let index = rooms.findIndex(x => x.id === room.id);
    let newRooms = rooms;
    room.unseenMessagesCount = 0;
    newRooms[index] = room;
    setRooms(newRooms);
    Store.dispatch({
      type: 'rooms',
      payload: newRooms,
    })
    push({
      pathname: url + '/chat/' + room.id,
      state: {
        ...state,
        room,
        opponentUser,
        opponentUserId: opponentUser.id,
      }
    });
  }

  return (
    <Slide in={true} direction="left">
      <Box
        id="inbox-scroll-element"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100vh",
          zIndex: 10000,
          backgroundColor: "#ffffff",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <AppBar color="inherit" position="fixed">
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>{translate('صندوق پیام')}</Typography>
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
        <Box style={{height: 60}}/>
        <Box style={{padding: 10}}>
          {loading && (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <CircularProgress/>
            </Box>
          )}
          {noResults && (
            <Alert severity="error" variant="filled">
              {translate('نتیجه ای یافت نشد')}
            </Alert>
          )}
          {!noResults && !loading && rooms.map((room, key) => {
            let opponentUser;
            switch (room.users.length) {
              case 1 :
                opponentUser = room.users[0];
                break;
              case 2:
                if (room.users[0].id === room.users[1].id) {
                  opponentUser = room.users[0];
                } else {
                  opponentUser = room.users.find(x => x.id !== props.user.id);
                }
                break;
              default:
                opponentUser = room.users.find(x => x.id !== props.user.id);
                break;
            }
            let lastMessage = '';
            if (room.lastMessage) {
              switch (room.lastMessage.displayType) {
                case 'image':
                  lastMessage = translate('تصویر');
                  break
                case 'video':
                  lastMessage = translate('ویدیو');
                  break;
                default:
                  lastMessage = room.lastMessage.message.substring(0, 40);
                  break;
              }
            }
            return (
              <Card
                key={key}
                elevation={3}
                style={{
                  overflow: 'unset',
                  position: "relative",
                  height: 100,
                  borderRadius: 20,
                  display: "flex",
                  marginBottom: 20,
                }}
              >
                <ButtonBase
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    textAlign: 'inherit'
                  }}
                  onClick={() => {
                    chat(room, opponentUser)
                  }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardMedia
                        image={opponentUser.avatar}
                        title={opponentUser.name}
                        style={{
                          borderRadius: "50%",
                          width: 80,
                          height: 80,
                          backgroundSize: "cover",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography>{opponentUser.name}</Typography>
                        <Typography variant="caption">{lastMessage}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </ButtonBase>
              </Card>
            )
          })}
          <Box style={{height: 60}}/>
          <Slide in={true} direction={"up"}>
            <Box
              style={{
                width: "100%",
                position: "fixed",
                left: 0,
                bottom: 10,
                zIndex: 10000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: green.A700,
                  height: 40,
                  borderRadius: 100,
                }}
                startIcon={<Add/>}
                component={Link}
                to={`${url}/bulk-messages`}
              >
                {translate("ارسال پیام انبوه")}
              </Button>
            </Box>
          </Slide>
          <Switch>
            <Route component={BulkMessages} path={`${path}/bulk-messages`}/>
            <Route component={Chat} path={`${path}/chat/:id`}/>
          </Switch>
        </Box>
      </Box>
    </Slide>
  )
}

export default connect(mapStateToProps)(Inbox);