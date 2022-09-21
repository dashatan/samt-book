import React from "react";
import {connect} from "react-redux";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  Slide,
  TextField,
  Toolbar,
  Typography,
  Zoom
} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import translate from "../../../../../translate";
import Select from "../../explore/filterComponents/Select";
import Upload from "../../../../../extra-components/dropZoneImageUploader";
import Store from "../../../../../redux/store";
import Axios from "axios";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    lang: state.lang,
    user: state.user,
    userToken: state.userToken,
  }
}

let languages = [
  {
    label: "فارسی",
    value: "fa"
  },
  {
    label: "English",
    value: "en"
  },
  {
    label: "türkçe",
    value: "tu"
  },
  {
    label: "中國人",
    value: "ch"
  },
  {
    label: "русский",
    value: "ru"
  },
  {
    label: "اردو",
    value: "ur"
  },
];

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      lang: props.lang,
      email: props.user.email,
      dzObject: '',
      avatarHelperText: '',
      loading: '',
      fileAdded: false,
      logoutDialog: false,
    }
  }

  update = () => {
    this.setState({loading: true})
    if (this.state.fileAdded) {
      this.state.dzObject.processQueue();
    } else {
      const url = this.props.baseUrl + '/api/profile/editProfile'
      let data = {
        userToken: this.props.userToken,
        email: this.state.email,
        lang: this.state.lang,
      }
      Axios.post(url, data).then(e => {
        this.updateSuccess(e.data);
      }).catch(e => {
        this.setState({loading: false})
        console.log(e);
      })
    }
  }

  updateSuccess = (response)=>{
    this.setState({loading: false})
    localStorage.setItem('lang', response.user.lang);
    Store.dispatch({
      type: 'user',
      payload: response.user
    })
    if (this.props.lang !== response.user.lang){
      return window.location.href = this.props.baseUrl + '/profile';
    }
    this.props.history.goBack();
  }

  logout = () => {
    const url = this.props.baseUrl + '/api/profile/logout';
    let data = {userToken: this.props.userToken}
    Axios.post(url, data).then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      window.location.href = this.props.baseUrl + '/login';
    }).catch(e => {
      console.log(e);
    })

  }

  render() {
    let lang = languages.find(x => x.value === this.state.lang);
    return (
      <Slide in={true} direction="left">
        <Box
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: "100vh",
            zIndex: 1000,
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
                <Typography>{this.props.user ? this.props.user.name : ""}</Typography>
                <Typography
                  variant="caption"
                  color="error"
                  onClick={() => {
                    this.setState({logoutDialog: true})
                  }}
                >
                  {translate('خروج')}
                </Typography>
              </Box>
              <Fab
                size="small"
                focusRipple
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              >
                <Close
                  onClick={() => {
                    this.props.history.push("/profile");
                  }}
                />
              </Fab>
            </Toolbar>
          </AppBar>
          <Box style={{height: 60}}/>
          <Box
            style={{
              padding: 20,

            }}
          >
            <Zoom in={true} style={{transitionDelay: 10}}>
              <Box
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexFlow: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Upload
                  defaultImage={this.props.user.avatar}
                  defaultImageSize="cover"
                  accept="image/*"
                  url={this.props.baseUrl + '/api/profile/editProfile'}
                  fileAdded={(file, value, dzObject) => {
                    this.setState({
                      dzObject,
                      fileAdded: true,
                    })
                  }}
                  onSending={(file, xhr, formData) => {
                    formData.append('userToken', this.props.userToken);
                    formData.append('lang', this.state.lang);
                    formData.append('email', this.state.email);
                  }}
                  onSuccess={(file, response) => {
                    this.updateSuccess(response);
                  }}
                  onProgress={(progress) => {
                    this.setState({progress})
                  }}
                />
                <Typography>{translate('تصویر')}</Typography>
                <Typography variant="caption" color="error">{this.state.avatarHelperText}</Typography>
              </Box>
            </Zoom>
            <Box style={{height: 20}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 20}}>
              <div>
                <Select
                  variant="linear"
                  btnVariant="outlined"
                  withSearch={false}
                  withIcon={false}
                  withAllOption={false}
                  options={languages}
                  title={translate("زبان")}
                  required={true}
                  name="lang"
                  match={this.props.match}
                  label={lang.label}
                  icon={"images/icons/special-flat/documents.svg"}
                  response={(name, value) => {
                    this.setState({
                      lang: value,
                    });
                  }}
                />
              </div>
            </Slide>
            <Box style={{height: 30}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 30}}>
              <Box>
                <TextField
                  value={this.state.email}
                  variant="outlined"
                  size="small"
                  label={translate('ایمیل')}
                  onChange={(e) => {
                    this.setState({email: e.target.value})
                  }}
                  fullWidth
                />
              </Box>
            </Slide>
          </Box>
          <AppBar
            color="inherit"
            position="fixed"
            style={{
              top: "auto",
              bottom: 0,
              width: "100%",
              height: 60,
            }}
          >
            <Toolbar
              style={{
                padding: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Slide in={true} direction="up">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: 100,
                    width: "90%",
                  }}
                  onClick={this.update}
                >
                  {this.state.loading
                    ? <CircularProgress size={24} color="inherit"/>
                    : translate("ذخیره")
                  }
                </Button>
              </Slide>
            </Toolbar>
          </AppBar>
          <Dialog
            open={this.state.logoutDialog}
            onClose={() => {
              this.setState({logoutDialog: false});
            }}
          >
            <DialogTitle>
              <Typography style={{fontSize: 16}}>
                {translate("آیا میخواهید از حساب کاربری خود خارج شوید ؟")}
              </Typography>
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={this.logout}
                color="secondary"
              >
                {translate("بله،میخواهم خارج شوم")}
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    logoutDialog: false,
                  });
                }}
                color="primary"
              >
                {translate("بازگشت")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Slide>
    )
  }
}

export default connect(mapStateToProps)(EditProfile);