import React, {useEffect} from "react";
import {AppBar, Box, Button, Toolbar} from "@material-ui/core";
import {Chat as ChatIcon, MyLocation, Settings as SettingsIcon} from "@material-ui/icons";
import {Link, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import translate from "../../../../translate";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import Store from "../../../../redux/store";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import Divider from "@material-ui/core/Divider";
import Settings from "./settings";
import Chat from "../explore/single/themes/chat/index";
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
    myApp: state.myApp,
    chatContacts: state.contactUsChatContacts,
  }
}

const Contacts = (props) => {
  let {url, path} = useRouteMatch();
  let {push} = useHistory();
  let {state} = useLocation();
  useEffect(() => {
    Store.dispatch({
      type: "navTabValue",
      payload: 4,
    });
    !props.myApp && getApp();
    !props.chatContacts && getChatContacts();
  }, [null])

  const getApp = () => {
    const url = props.baseUrl + '/api/getMyApp';
    Axios.post(url).then(e => {
      Store.dispatch({
        type: 'myApp',
        payload: e.data
      });
    }).catch(e => {
      console.log(e);
    })
  }

  const getChatContacts = () => {
    const url = props.baseUrl + '/api/contactUs/getChatContacts';
    Axios.post(url, {userToken: props.userToken}).then(e => {
      Store.dispatch({
        type: 'contactUsChatContacts',
        payload: e.data
      });
    }).catch(e => {
      console.log(e);
    })
  }

  const chat = (user) => {
    push({
      pathname: `${url}/chat`,
      state: {
        ...state,
        opponentUser: user,
      }
    })
  }

  let app = props.myApp;
  if (!app) {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200
        }}
      >
        <CircularProgress/>
      </Box>
    )
  }
  return (
    <Box
      style={{
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {props.user && props.user.role === 'admin' && (
        <Box>
          <AppBar color="inherit" position="fixed">
            <Toolbar
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 10,
                paddingLeft: 10,
              }}
            >
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SettingsIcon/>}
                  component={Link}
                  to={url + "/settings"}
                >
                  {translate("تنظیمات")}
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Box style={{height: 60}}/>
        </Box>
      )}
      <Box
        style={{
          padding: 10,
        }}
      >
        {app.dsc && (
          <Box style={{marginTop: 15}}>
            <Typography>{translate(app.dsc)}</Typography>
            <Divider style={{margin: '20px 0'}}/>
          </Box>
        )}
        {app.phones && app.phones.length > 0 && (
          app.phones.map((phone, key) => {
            return (
              <Typography
                key={key}
                style={{marginBottom: 10}}
              >{translate(phone.title)} : {phone.phone_number}</Typography>
            )
          })
        )}
        <Divider style={{margin: '30px 0'}}/>
        {app.addresses && app.addresses.length > 0 && (
          <Box>
            {app.addresses.map((address, key) => {
              return (
                <Box key={key} style={{marginBottom: 10}}>
                  <Typography>{translate(address.title)} : {translate(address.address)}</Typography>
                  {address.postal_code && (
                    <Typography>{translate('کد پستی')} : {address.postal_code}</Typography>
                  )}
                  {address.location && (
                    <Button
                      color="primary"
                      variant="outlined"
                      startIcon={<MyLocation/>}
                      href={`geo:${address.location}`}
                      style={{marginTop: 10}}
                    >{translate('مسیریابی')}</Button>
                  )}
                </Box>
              )
            })}
            <Divider style={{margin: '30px 0'}}/>
          </Box>
        )}

        <Grid container spacing={3}>
          {app.social_medias && app.social_medias.length > 0 && (
            app.social_medias.map((socialMedia, key) => {
              return (
                <Grid
                  key={key}
                  item
                  xs={3}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <a href={socialMedia.url} target="_blank" rel="noopener noreferrer">
                    <CardMedia
                      key={key}
                      image={socialMedia.icon}
                      style={{
                        width: 60,
                        height: 60,
                        backgroundSize: 'cover',
                        borderRadius: 100
                      }}
                    />
                  </a>
                </Grid>
              )
            })
          )}
        </Grid>
        {app && props.user && props.chatContacts && (
          <Box>
            <Box style={{height: 30}}/>
            <Typography style={{padding: '0 10px'}}>{translate('گفتگوی آنلاین با')}</Typography>
            <Divider style={{margin: '5px 0 10px 0'}}/>
            <Grid container spacing={1} style={{justifyContent: 'center'}}>
              {props.chatContacts.map((item, key) => {
                let style = {};
                if (item.name === 'editor') {
                  style = {
                    ...style,
                    backgroundColor: green["700"],
                  }
                }
                let color = item.name === 'management' ? 'secondary' : 'primary';
                return (
                  <Grid key={key} item xs={4}>
                    <Button
                      fullWidth
                      startIcon={<ChatIcon/>}
                      variant="contained"
                      color={color}
                      style={style}
                      onClick={() => {
                        chat(item.user)
                      }}
                    >{translate(item.label)}</Button>
                  </Grid>
                )
              })}
            </Grid>
            <Box style={{height: 30}}/>
          </Box>
        )}
        <Box style={{height: 30}}/>
        <Typography style={{padding: '0 10px'}}>{translate('نمادهای اعتماد')}</Typography>
        <Divider style={{margin: '5px 0 10px 0'}}/>
        <Grid container>
          <Grid
            item xs={6} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://trustseal.enamad.ir/?id=147494&amp;Code=4ZuOjxuvIwY92AYEKnqM"
            >
              <img
                src="https://Trustseal.eNamad.ir/logo.aspx?id=147494&amp;Code=4ZuOjxuvIwY92AYEKnqM"
                alt=""
                style={{
                  cursor: 'pointer'
                }}
                id="4ZuOjxuvIwY92AYEKnqM"
              />
            </a>
          </Grid>
          <Grid
            item xs={6} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <img
              id="jxlzesgtwlaoapfuesgtfukzwlao"
              style={{
                cursor:'pointer',
              }}
              onClick={()=>{
                window.open("https://logo.samandehi.ir/Verify.aspx?id=1045064&p=rfthobpdaodsdshwobpdgvkaaods", "Popup","toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30")
              }}
              alt="logo-samandehi"
              src="https://logo.samandehi.ir/logo.aspx?id=1045064&p=nbpdlymashwlujynlymawlbqshwl"
            />
          </Grid>
        </Grid>
      </Box>
      <Switch>
        <Route component={Settings} path={path + '/settings'}/>
        <Route component={Chat} path={path + '/chat'}/>
      </Switch>
    </Box>
  )

}

export default connect(mapStateToProps)(Contacts);