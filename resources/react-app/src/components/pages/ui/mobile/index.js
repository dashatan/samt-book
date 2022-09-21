import React, {useEffect, useState} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import Store from "../../../redux/store";
import axios from "axios";
import Home from "./home";
import Explore from "./explore";
import BottomNavTabs from "./bottomNavTabs";
import Single from "./explore/single";
import Import from "../../../import";
import Profile from "./profile/profile";
import Login from "./profile/Login";
import Lang from "./Lang";
import News from "./news";
import Contacts from "./contacts";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import translate from "../../../translate";
import Snackbar from "@material-ui/core/Snackbar";
import {connect} from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import {DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import * as serviceWorker from '../../../../myServiceWroker';
import Echo from "../../../echo";
import FilterModal from "./explore/filter-modal";
require('../../../../bootstrap');


const mapStateToProps = (state) => {
  return {
    lang: state.lang,
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
  }
}

const MobileApp = (props) => {
  let {push} = useHistory();
  let [newMessageSnackBar, setNewMessageSnackBar] = useState(false);
  let [echoInitialized, setEchoInitialized] = useState(false);
  let [fcmInitialized, setFcmInitialized] = useState(false);
  let [notificationPermission, setNotificationPermission] = useState(false);

  if (!props.lang) {
    push('/lang');
  }
  useEffect(() => {
    props.userToken && !props.user && getUser();
    if (Notification.permission !== 'granted' && props.userToken){
      setTimeout(()=>{
        setNotificationPermission(true);
      },2000);
    }
  }, [])

  //firebase cloud messaging push notification get token
  if (props.userToken && !fcmInitialized){
    setFcmInitialized(true);
    serviceWorker.getToken();
  }

  //laravelEcho initialize
  if (props.user && !echoInitialized) {
    console.log('echoInitialized');
    Echo().private(`newMessageForUser.${props.user.id}`)
    .listen('NewMessage', () => {
      console.log('NewMessage');
      getUser();
      setNewMessageSnackBar(true)
    });
    setEchoInitialized(true);
  }

  const getUser = () => {
    let url = props.baseUrl + '/api/profile/getUser';
    axios.post(url, {userToken: props.userToken}).then(e => {
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

  const allowNotifications = () => {
    serviceWorker.askPermission(props.userToken);
    setNotificationPermission(false);
  }

  return (
    <Box>
      <Switch>
        <Route path="/import" component={Import}/>
        <Route path="/explore" component={Explore}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/news" component={News}/>
        <Route path="/contacts" component={Contacts}/>
        <Route path="/login" component={Login}/>
        <Route path="/s/:class/:id" component={Single}/>
        <Route path="/filter" component={FilterModal}/>
        <Route exact path="/lang" component={Lang}/>
        <Route exact path="/" component={Home}/>
      </Switch>
      <BottomNavTabs/>
      <Snackbar
        open={newMessageSnackBar}
        autoHideDuration={10000}
        onClose={() => {
          setNewMessageSnackBar(false);
        }}
        style={{top: 0, bottom: 'auto'}}
      >
        <Alert severity={"success"} variant={"filled"}>
          {translate('پیام جدید دریافت شد')}
        </Alert>
      </Snackbar>
      <Dialog
        style={{zIndex: 100000}}
        open={notificationPermission}
        onClose={() => {
          setNotificationPermission(false);
        }}
      >
        <DialogTitle>
          <Typography style={{fontSize: 16}}>
            {translate("لطفا ارسال اعلان ها را فعال کنید")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="error" style={{fontSize: 11}}>
            {translate(
              "در صورت عدم فعال سازی ، پیام های جدیدی که دریافت میکنید برای شما اطلاع رسانی نخواهد شد"
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={allowNotifications}
            color="primary"
          >
            {translate("بسیار خب")}
          </Button>
          <Button
            onClick={() => {
              setNotificationPermission(false);
            }}
            color="secondary"
          >
            {translate("تمایل ندارم")+'!'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default connect(mapStateToProps)(MobileApp);
