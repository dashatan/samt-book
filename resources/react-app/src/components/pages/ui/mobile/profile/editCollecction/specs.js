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
import {Close} from "@material-ui/icons";
import Store from "../../../../../redux/store";
import Dropzone from "dropzone";
import CardMedia from "@material-ui/core/CardMedia";
import {green, red} from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import camelToSnake from "../../../../../camelToSnake";
import {withRouter} from 'react-router-dom';
import $ from 'jquery';

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl,
    classes: state.classesOfAddingNewItem,
    userToken: state.userToken,
    data: state.dataStoreOfEditingItem,
    EditingCollection: state.EditingCollection,
    virtualKeyboardVisible: state.virtualKeyboardVisible,
  };
};
let setImage;

class Specifications extends React.Component {
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
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let scrollElement = $("#edit-collection-scroll-element");
    if (this.state.textFieldFocused) {
      let anchorElement = $(`#${this.state.focusedTextFieldId}`);
      scrollElement.scrollTo(anchorElement, {offset: this.state.focusedTextFieldOffset});
    }
  }

  update = () => {
    let error = false;
    let title = this.props.data.find(x => x.name === "title").value;
    let dsc = this.props.data.find(x => x.name === "dsc").value;
    this.setState({
      titleError: false,
      titleHelperText: '',
      dscError: false,
      dscHelperText: '',
    });

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
        formData[camelToSnake(item.name)] = item.value;
      });
      formData['id'] = this.props.EditingCollection.id;
      const url = this.props.baseUrl + "/api/profile/updateCollection";
      Axios.post(url, formData).then(e => {
        if (this.state.imageAdded) {
          this.updateImage(this.props.EditingCollection.token);
        } else {
          this.setState({loading: false});
          Store.dispatch({
            type: 'EditingCollection',
            payload: e.data.collection
          });
          Store.dispatch({
            type: 'propsUpdated',
            payload: true
          });
          this.props.history.push('/profile');
        }
      }).catch(e => {
        this.setState({
          loading: false,
          errorSnackBar: true
        });
        console.log(e);
      })
    }
  };

  updateImage = (token) => {
    let _this = this;
    this.setState({loading: true});
    setImage.processQueue();
    setImage.on('sending', function (file, xhr, formData) {
      formData.append('token', token);
    });
    setImage.on('success', function (file, response) {
      _this.setState({loading: false});
      Store.dispatch({
        type: 'EditingCollection',
        payload: response.collection
      });
      Store.dispatch({
        type: 'propsUpdated',
        payload: true
      });
      _this.props.history.push('/profile');
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
      type: "dataStoreOfEditingItem",
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
                src={this.props.EditingCollection.image}
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
      <Box style={{padding: "10px"}}>
        {tpl}
        <Box>
          <Slide
            in={true}
            direction="down"
            style={{transitionDelay: "10ms"}}
          >
            <Paper
              elevation={6}
              style={{
                marginTop: 20,
                marginBottom: 20,
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
                        image={this.props.EditingCollection.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundSize: 'cover'
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
                    value={title}
                    variant="standard"
                    onChange={this.setTextData}
                    name="title"
                    label={translate("عنوان")}
                    fullWidth
                    error={this.state.titleError}
                    helperText={this.state.titleHelperText}
                    id="title-text-field"
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
                    id="dsc-text-field"
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
                      style={{color: dsc ? dsc.length < 20 ? red.A200 : green.A400 : red.A200}}
                    >{dsc ? dsc.length : 0}</span>
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
        {!this.props.virtualKeyboardVisible && (
          <AppBar
            color="inherit"
            position="fixed"
            style={{
              top: "auto",
              bottom: 0,
              width: "100%",
              height: 60,
              justifyContent: 'center'
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
                  onClick={this.update}
                >

                  {this.state.loading ?
                    <CircularProgress
                      size={24}
                      color="inherit"
                    /> :
                    translate("ذخیره")
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

export default withRouter(connect(mapStateToProps)(Specifications));
