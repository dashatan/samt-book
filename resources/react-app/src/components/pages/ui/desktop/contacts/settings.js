import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {AppBar, Box, Fab, Toolbar} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";
import translate from "../../../../translate";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import Store from "../../../../redux/store";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import RelationButton from "../side-components/relation/button";
import {Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import List from "../side-components/relation/list";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
    myApp: state.myApp,
  }
}

const Settings = (props) => {

  let {goBack} = useHistory();
  let {path} = useRouteMatch()
  let [myApp, setMyApp] = useState(props.myApp || []);
  let [dsc, setDsc] = useState(props.myApp ? props.myApp.dsc : '');
  let [alert, setAlert] = useState(false);
  let [loading, setLoading] = useState(false);

  //compDidMount
  useEffect(() => {
    !props.myApp && getApp();
  }, [])

  const getApp = () => {
    const url = props.baseUrl + '/api/getMyApp';
    Axios.post(url).then(e => {
      Store.dispatch({
        type: 'myApp',
        payload: e.data
      });
      setMyApp(e.data)
    }).catch(e => {
      console.log(e);
    })
  }

  if (!myApp) {
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

  let relations = [
    {
      name: 'phones',
      label: 'تلفن ها',
      icon: `${props.baseUrl}/icons/special-flat/telephone.svg`,
      imageBackGroundSize: 60,
    },
    {
      name: 'addresses',
      label: 'آدرس ها',
      icon: `${props.baseUrl}/icons/special-flat/location.svg`,
      imageBackGroundSize: 60,
    },
    {
      name: 'socialMedias',
      label: 'شبکه های اجتماعی',
      icon: `${props.baseUrl}/icons/special-flat/social-media.svg`,
      imageBackGroundSize: 60,
    },
    {
      name: 'slides',
      label: 'اسلایدها',
      icon: `${props.baseUrl}/icons/special-flat/slider.svg`,
      imageBackGroundSize: 'cover',
    },
  ]

  const store = () => {
    setLoading(true);
    const url = props.baseUrl + '/api/updateMyApp';
    Axios.post(url, {
      userToken: props.userToken,
      dsc
    }).then(() => {
      setAlert(true);
      setLoading(false);
    }).catch(e => {
      setLoading(false);
      console.log(e);
    })
  }

  return (
    <Slide in={true} direction="left">
      <Box
        style={{
          height: "100vh",
          position: "fixed",
          width: "100%",
          top: 0,
          right: 0,
          zIndex: 10000,
          backgroundColor: "#ffffff",
        }}
      >
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
              <Typography>{translate('تنظیمات')}</Typography>
            </Box>
            <Fab
              size="small"
              focusRipple
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              <ArrowBack
                onClick={goBack}
              />
            </Fab>
          </Toolbar>
        </AppBar>
        <Box style={{height: 60}}/>
        <Box style={{padding: 10}}>
          <Box>
            <TextField
              value={dsc}
              variant="outlined"
              label={translate('توضیحات')}
              onChange={(e) => {
                setDsc(e.target.value)
              }}
              rows={4}
              multiline
              fullWidth
            />
            <Box style={{height: 10}}/>
            <Button variant={"contained"} color={"primary"} onClick={store} fullWidth>
              {loading
                ? <CircularProgress size={24} color={"inherit"}/>
                : translate('دخیره توضیحات')
              }
            </Button>
          </Box>
          <Grid
            container
            spacing={2}
            style={{
              marginTop: 20,
              justifyContent: 'center'
            }}
          >
            {relations.map((relation, key) => {
              return (
                <Grid key={key} item xs={4}>
                  <RelationButton
                    name={relation.name}
                    icon={relation.icon}
                    label={translate(relation.label)}
                    caption={translate('صمت بوک')}
                    parentModelName="MyApp"
                    parentModelId={1}
                    imageBackGroundSize={relation.imageBackGroundSize}
                  />
                </Grid>
              )
            })}
          </Grid>
        </Box>
        <Switch>
          <Route path={path + '/relations/:name'} component={List}/>
        </Switch>
        <Snackbar
          open={alert}
          autoHideDuration={4000}
          onClose={() => {
            setAlert(false);
          }}
          style={{bottom: 50}}
        >
          <Alert severity={"success"} variant={"filled"} style={{width: '100%'}}>
            {translate('ذخیره شد')}
          </Alert>
        </Snackbar>
      </Box>
    </Slide>
  )
}

export default connect(mapStateToProps)(Settings);