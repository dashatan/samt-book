import React from "react";
import {connect} from "react-redux";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  Slide,
  Snackbar,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";
import translate from "../../../../translate";
import Upload from "../../../../extra-components/dropZoneImageUploader";
import Store from "../../../../redux/store";
import {green, red} from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";
import $ from 'jquery';

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
  }
}

class AddNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: false,
      titleHelperText: '',
      dsc: '',
      dscError: false,
      dscHelperText: translate("توضیح مختصری بنویسید"),
      fileAdded: false,
      dzObject: '',
      imageError: false,
      imageHelperText: '',
      progress: 0,
      errorSnackBar: false,
      loading: false,
      textFieldFocused: false,
      focusedTextFieldId: '',
      focusedTextFieldOffset: 0,
      virtualKeyboardVisible: false,
      scrollElementHeight: '100vh',
    }
  }

  componentDidMount() {
    let windowHeight = window.innerHeight;
    let scrollElementHeight = this.state.scrollElementHeight;
    document.body.onresize = () => {
      let windowNewHeight = window.innerHeight;
      if (windowHeight - windowNewHeight > 150) {
        this.setState({
          virtualKeyboardVisible: true,
          scrollElementHeight: windowNewHeight - 20,
        })
      } else {
        $('input').blur();
        this.setState({
          virtualKeyboardVisible: false,
          scrollElementHeight
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

  store = () => {
    let error = false;
    let title = this.state.title;
    let dsc = this.state.dsc;
    this.setState({
      titleError: false,
      titleHelperText: '',
      dscError: false,
      dscHelperText: '',
    });
    if (!this.state.fileAdded) {
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
      this.state.dzObject.processQueue();
    }
  };

  success = () => {
    this.setState({loading: false})
    Store.dispatch({
      type: 'propsUpdated',
      payload: true
    });
    this.props.history.goBack();
  }

  setTextData = e => {
    let name = e.target.name;
    let value = e.target.value;
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
    let title = this.state.title;
    let dsc = this.state.dsc;
    return (
      <Slide in={true} direction="left">
        <Box
          id="add-new-collection-step-3"
          style={{
            backgroundColor: "#f0f8ff",
            height: this.state.scrollElementHeight,
            width: '100%',
            overflowY: "auto",
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 10000,
          }}
        >
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
                  {translate("ثبت خبر جدید")}
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

          <Box style={{padding: 10,height:'calc(100vh - 120px)'}}>
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
                    <Upload
                      defaultImage={this.props.baseUrl + '/icons/special-flat/add.svg'}
                      defaultImageSize="60px"
                      accept="image/*"
                      processQueue={this.state.processQueue}
                      url={this.props.baseUrl + '/api/news/store'}
                      fileAdded={(file, value, dzObject) => {
                        this.setState({
                          fileAdded: value,
                          dzObject,
                        })
                      }}
                      onSending={(file, xhr, formData) => {
                        formData.append('userToken', this.props.userToken);
                        formData.append('title', this.state.title);
                        formData.append('dsc', this.state.dsc);
                      }}
                      onSuccess={this.success}
                      onError={(file,response)=>{
                        this.setState({loading: false})
                        this.state.dzObject.removeFile(file);
                        console.log(response);
                      }}
                      onProgress={(progress) => {
                        this.setState({
                          progress
                        })
                      }}
                    />
                    <Typography>{translate('تصویر')}</Typography>
                    <Typography variant="caption" color="error">{this.state.imageHelperText}</Typography>
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
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: "flex-end"
                      }}
                    >
                      <span>10 / </span>
                      <span
                        style={{color: title.length < 10 ? red.A200 : green.A400}}
                      >{title.length}</span>
                    </Box>
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
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: "flex-end"
                      }}
                    >
                      <span>20 / </span>
                      <span
                        style={{color: dsc.length < 20 ? red.A200 : green.A400}}
                      >{dsc.length}</span>
                    </Box>
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
                    variant="contained"
                    color="secondary"
                    style={{
                      borderRadius: 100,
                      width: "90%"
                    }}
                    onClick={this.store}
                  >
                    {this.state.loading
                      ? <CircularProgress size={24} color="inherit"/>
                      : translate("ذخیره")
                    }
                  </Button>
                </Slide>
              </Toolbar>
            </AppBar>
          )}
        </Box>
      </Slide>
    );
  }
}

export default connect(mapStateToProps)(AddNews);
