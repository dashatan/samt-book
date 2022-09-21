import React from "react";
import {connect} from "react-redux";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  LinearProgress,
  Paper,
  Slide,
  Snackbar,
  TextField,
  Toolbar
} from "@material-ui/core";
import translate from "../../../../../translate";
import Typography from "@material-ui/core/Typography";
import {ArrowBack, Close} from "@material-ui/icons";
import Store from "../../../../../redux/store";
import Dropzone from "dropzone";
import CardMedia from "@material-ui/core/CardMedia";
import {green, red} from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import 'jquery.scrollto';
import $ from 'jquery';

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    data: state.dataStoreOfAddNewItem,
    classes: state.classesOfAddingNewItem,
    userToken: state.userToken,
  };
};
let setImage;

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      loading: false,
      titleError: false,
      titleHelperText: '',
      dscError: false,
      dscHelperText: translate("توضیح مختصری بنویسید"),
      imageHelperText: '',
      imageAdded: false,
      errorSnackBar: false,
      textFieldFocused: false,
      focusedTextFieldId: '',
      focusedTextFieldOffset: 0,
      virtualKeyboardVisible: false,
      scrollElementHeight: 'calc(100vh - 60px)',
      initialWindowHeight: window.innerHeight,
    };
  }

  componentDidMount() {
    let _this = this;
    let params = {};
    this.props.data.map(item => {
      params[item.name] = item.value;
    });
    setImage = new Dropzone("#image", {
      url: this.props.baseUrl + "/api/profile/storeCollectionImage",
      clickable: "#image-clickable",
      paramName: 'image',
      params,
      previewTemplate: document.getElementById("tpl").innerHTML,
      resizeWidth: 600,
      maxFilesize: 20,
      maxFiles: 1,
      addRemoveLinks: true,
      dictRemoveFile: '',
      dictCancelUpload: '',
      autoProcessQueue: false,
      init: function () {
        document.querySelector('.dz-hidden-input').setAttribute('accept', 'image/*');
      }
    });
    setImage.on('addedfile', function () {
      document.getElementById('image-clickable').style.display = 'none';
      document.getElementById('progress-bar').style.display = 'none';
      _this.setState({
        imageAdded: true,
        imageHelperText: '',
      })
    });
    setImage.on('removedfile', function () {
      document.getElementById('image-clickable').style.display = 'block';
      _this.setState({
        imageAdded: false,
      })
    });
    setImage.on("uploadprogress", function (file, progress) {
      document.getElementById('progress-bar').style.display = 'flex';
      _this.setState({progress: Math.round(progress)});
      if (progress === 100) {
        document.getElementById('progress-bar').style.display = 'none';
      }
    });
    document.body.onresize = () => {
      if (this.state.initialWindowHeight - window.innerHeight > 150) {
        this.setState({
          virtualKeyboardVisible: true,
          scrollElementHeight: window.innerHeight,
        })
      } else {
        document.querySelectorAll('input').forEach((input)=>{
          input.blur();
        })
        this.setState({
          virtualKeyboardVisible: false,
          scrollElementHeight:'calc(100vh - 60px)',
        })
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let scrollElement = $("#add-new-collection-step-3");
    if (this.state.textFieldFocused) {
      let anchorElement = $(`#${this.state.focusedTextFieldId}`);
      scrollElement.scrollTo(anchorElement, {offset: this.state.focusedTextFieldOffset});
    }
  }

  nextStep = () => {
    let error = false;
    let title = this.props.data.find(x => x.name === "title").value;
    let dsc = this.props.data.find(x => x.name === "dsc").value;
    this.setState({
      titleError: false,
      titleHelperText: '',
      dscError: false,
      dscHelperText: '',
    });
    if (!this.state.imageAdded) {
      error = true;
      this.setState({
        imageError: true,
        imageHelperText: translate('لطفا یک تصویر انتخاب کنید'),
      })
    }
    if (title.length < 10) {
      error = true;
      this.setState({
        titleError: true,
        titleHelperText: translate('حداقل 10 حرف وارد کنید'),
      })
    }
    if (title.length > 80) {
      error = true;
      this.setState({
        titleError: true,
        titleHelperText: translate('حداکثر 80 حرف مجاز میباشد'),
      })
    }
    if (dsc.length < 20) {
      error = true;
      this.setState({
        dscError: true,
        dscHelperText: translate('حداقل 20 حرف وارد کنید'),
      })
    }
    if (!error) {
      this.setState({loading: true});
      const data = this.props.data;
      data.find(x => x.name === 'userToken').value = this.props.userToken;
      let formData = {};
      data.map(item => {
        formData[item.name] = item.value;
      });
      const url = this.props.baseUrl + "/api/profile/storeCollection";
      Axios.post(url, formData).then(e => {
        this.setImage(e.data.token);
      }).catch(e => {
        this.setState({
          loading: false,
          errorSnackBar: true
        });
        console.log(e);
      })

    }
  };

  setImage = (token) => {
    let _this = this;
    this.setState({loading: true});
    setImage.processQueue();
    setImage.on('sending', function (file, xhr, formData) {
      formData.append('token', token);
    });
    setImage.on('success', function (file, response) {
      _this.setState({loading: false});
      _this.props.history.push('/profile');
      Store.dispatch({
        type: 'propsUpdated',
        payload: true
      });
    });
    setImage.on('error', function (file, response) {
      _this.setState({
        loading: false,
        errorSnackBar: true
      });
      console.log(response);
    });
  };

  setTextData = e => {
    let name = e.target.name;
    let value = e.target.value;
    let data = this.props.data;
    data.find(x => x.name === name).value = value;
    Store.dispatch({
      type: "dataStoreOfAddNewItem",
      payload: data
    });
    this.setState({
      [name]: value,
      [name + 'HelperText']: '',
      [name + 'Error']: false,
    });
  };

  handleFocus(id, offset) {
    this.setState({
      textFieldFocused: true,
      focusedTextFieldId: id,
      focusedTextFieldOffset: offset,
    })
  }

  handleBlur = () => {
    this.setState({
      textFieldFocused: false,
    })
  }

  render() {
    let title = this.props.data.find(x => x.name === "title").value;
    let dsc = this.props.data.find(x => x.name === "dsc").value;
    const tpl = (
      <Box id="tpl" style={{display: 'none'}}>
        <Box
          style={{
            position: 'relative',
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <Box
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Paper
              elevation={3} style={{
              width: 80,
              height: 80,
              borderRadius: 80,
              overflow: "hidden",
              position: "relative"
            }}
            >
              <img
                data-dz-thumbnail=""
                style={{width: "100%"}}
                src={window.location.origin + "/icons/special-flat/add.svg"}
                alt=""
              />
            </Paper>
            <Fab
              size="small" style={{
              minWidth: 23,
              width: 23,
              minHeight: 23,
              height: 23,
              position: 'absolute',
              right: -3,
              top: -3,
              border: '2px solid white',
              boxShadow: 'none',
            }} color="secondary"
              className="dz-remove"
              data-dz-remove
            >
              <Close style={{fontSize: 14}}/>
            </Fab>
          </Box>
        </Box>
      </Box>
    );
    return (
      <Box
        id="add-new-collection-step-3"
        style={{
          backgroundColor: "#f0f8ff",
          height: this.state.scrollElementHeight,
          padding: 10,
          overflowY: "auto",
        }}
      >
        {tpl}
        {!this.state.virtualKeyboardVisible && (
          <AppBar color="inherit" position="fixed">
            <Toolbar
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 10,
                paddingLeft: 10
              }}
            >
              <Typography>
                {translate("مشخصات")}
              </Typography>
              <Fab
                size="small"
                focusRipple
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none"
                }}
              >
                <ArrowBack
                  onClick={this.props.history.goBack}
                />
              </Fab>
            </Toolbar>
          </AppBar>
        )}
        {!this.state.virtualKeyboardVisible && (
          <Box style={{height: 60}}/>
        )}

        <Box style={{padding: 10}}>
          <Slide
            in={true}
            direction="down"
            style={{transitionDelay: "10ms"}}
          >
            <Paper
              elevation={6}
              style={{
                padding: 20,
                borderRadius: 20,
                display: 'flex',
              }}
            >
              <Grid container spacing={3}>
                <Grid
                  item xs={4}
                  style={{textAlign: 'center'}}
                >
                  <Box id="image">
                    <Paper
                      id="image-clickable"
                      elevation={3}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 80,
                        overflow: "hidden",
                        position: "relative",
                        margin: 'auto'
                      }}
                    >
                      <CardMedia
                        image={window.location.origin + "/icons/special-flat/add.svg"}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundSize: 60
                        }}
                      />
                    </Paper>

                  </Box>
                  <Grid
                    container
                    id="progress-bar"
                    style={{display: 'none'}}
                  >
                    <Grid
                      item
                      xs={3}
                    >
                      <Typography
                        style={{
                          textAlign: 'center',
                          direction: "ltr",
                          fontSize: 10
                        }}
                      >
                        {this.state.progress}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <LinearProgress
                        style={{width: this.state.progress + '%'}}
                        variant="determinate"
                        value={this.state.progress}
                        color="secondary"
                      />
                    </Grid>
                  </Grid>
                  <Typography
                    color="error"
                    variant="caption"
                  >
                    {this.state.imageHelperText}
                  </Typography>
                </Grid>
                <Grid
                  item xs={8}
                  style={{
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <TextField
                    id="title-text-field"
                    value={title}
                    variant="standard"
                    onChange={this.setTextData}
                    name="title"
                    label={translate("عنوان")}
                    fullWidth
                    error={this.state.titleError}
                    helperText={this.state.titleHelperText}
                    onFocus={this.handleFocus.bind(this, 'title-text-field', -30)}
                    onBlur={this.handleBlur}
                  />
                  <Typography
                    style={{
                      display: 'flex',
                      justifyContent: "flex-end"
                    }}
                  >
                    <span>10 / </span>
                    <span
                      style={{color: title.length < 10 ? red.A200 : green.A400}}
                    >{title.length}</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="dsc-text-field"
                    value={dsc}
                    variant="outlined"
                    multiline
                    rows={5}
                    onChange={this.setTextData}
                    name="dsc"
                    label={translate("توضیحات")}
                    fullWidth
                    error={this.state.dscError}
                    helperText={this.state.dscHelperText}
                    onFocus={this.handleFocus.bind(this, 'dsc-text-field', -10)}
                    onBlur={this.handleBlur}
                  />
                  <Typography
                    style={{
                      display: 'flex',
                      justifyContent: "flex-end"
                    }}
                  >
                    <span>20 / </span>
                    <span
                      style={{color: dsc.length < 20 ? red.A200 : green.A400}}
                    >{dsc.length}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Slide>
        </Box>
        <Snackbar
          open={this.state.errorSnackBar}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({errorSnackBar: false});
          }}
          style={{bottom: 70}}
        >
          <Alert
            elevation={6}
            severity="error"
            variant="filled"
          >
            {translate('لطفا موارد ضروری را تکمیل کنید')}
          </Alert>
        </Snackbar>
        {!this.state.virtualKeyboardVisible && (
          <Box style={{height: 60}}/>
        )}
        {!this.state.virtualKeyboardVisible && (
          <AppBar
            color="inherit"
            position="fixed"
            style={{
              top: "auto",
              bottom: 0,
              width: "100%",
              height: 60
            }}
          >
            <Toolbar
              style={{
                padding: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Slide in={true} direction="up">
                <Button
                  // id='next-step'
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: 100,
                    width: "90%"
                  }}
                  onClick={this.nextStep}
                >

                  {this.state.loading ?
                    <CircularProgress
                      size={24}
                      color="inherit"
                    /> :
                    translate("مرحله بعدی")
                  }
                </Button>
              </Slide>
            </Toolbar>
          </AppBar>
        )}
      </Box>
    );
  }
}

export default connect(mapStateToProps)(Step3);
