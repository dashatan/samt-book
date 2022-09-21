import React from "react";
import {connect} from "react-redux";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Fab,
  Slide,
  Switch,
  TextField,
  Toolbar,
  Typography,
  Zoom
} from "@material-ui/core";
import {ArrowBack} from "@material-ui/icons";
import translate from "../../../../../translate";
import Upload from "../../../../../extra-components/dropZoneImageUploader";
import Axios from "axios";
import Store from "../../../../../redux/store";
import camelToSnake from "../../../../../camelToSnake";
import Divider from "@material-ui/core/Divider";
import VideoUpload from "../../../../../extra-components/videoUploader";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    filterItems: state.filterItems,
  }
}

let slide = {
  mimeType: 'image',
  link: '',
  countryId: '',
  provinceId: '',
  citId: '',
  categoryId: '',
  idpId: '',
  ftzId: '',
  isInIdp: '',
  isInItz: '',
  class: '',
  type: '',
}
const styles = {
  inputBox: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    margin: '20px 0',
    paddingLeft: 20,
    paddingRight: 20,
  }
}


class AddNewSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slide,
      dzObject: '',
      imageHelperText: '',
      videoHelperText: '',
      imageError: false,
      videoError: false,
      passwordError: false,
      loading: '',
      fileAdded: false,
      videoFile: '',
    }
  }

  componentDidMount() {
    let filterItems = this.props.filterItems;
    let slide = this.state.slide;
    for (let i in slide) {
      if (slide.hasOwnProperty(i)) {
        let item = filterItems.find(x => x.name === i);
        if (item) {
          slide[i] = item.value;
        }
      }
    }
    this.setState({slide});
  }

  store = () => {
    let rules = {};
    if (this.state.slide.mimeType === 'image') {
      rules.image = this.state.fileAdded;
    } else {
      rules.video = this.state.videoFile;
    }
    let error = false;
    for (let i in rules) {
      this.setState({
        [i + 'Error']: false,
        [i + 'HelperText']: '',
      })
      if (!rules[i]) {
        error = true;
        this.setState({
          [i + 'Error']: true,
          [i + 'HelperText']: translate(i) + ' ' + translate('الزامی است'),
        })
      }
    }
    if (!error) {
      this.setState({loading: true})
      if (this.state.fileAdded) {
        this.state.dzObject.processQueue();
      } else {
        const url = this.props.baseUrl + '/api/explore/storeNewSlide'
        let formData = new FormData();
        formData.append('file', this.state.videoFile);
        let slide = this.state.slide;
        for (let i in slide) {
          if (slide.hasOwnProperty(i))
            formData.append(camelToSnake(i), slide[i])

        }
        Axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(e => {
          this.updateSuccess(e.data);
        }).catch(e => {
          this.setState({loading: false})
          console.log(e);
        })
      }
    }
  }

  updateSuccess = () => {
    this.setState({loading: false})
    Store.dispatch({
      type: 'propsUpdated',
      payload: true
    });
    Store.dispatch({
      type: 'getBlocks',
      payload: true
    });

    this.props.history.goBack();
  }

  handleChange = (e, param, value) => {
    let slide = this.state.slide;
    slide[param] = value ? value : e.target.value;
    this.setState({
      slide,
      [`${param}HelperText`]: '',
      [`${param}Error`]: false,
    })
  }

  setMimeType = () => {
    let mimeType = this.state.slide.mimeType;
    if (mimeType === 'image') {
      mimeType = 'video';
    } else {
      mimeType = 'image'
    }
    let slide = this.state.slide;
    slide.mimeType = mimeType;
    this.setState({slide});
  }

  render() {
    return (
      <Slide in={true} direction="left">
        <Box
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: "100vh",
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
                <Typography>{translate('اسلاید جدید')}</Typography>
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
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                />
              </Fab>
            </Toolbar>
          </AppBar>
          <Box
            style={{
              padding: '60px 10px',
              height: 'calc(100vh - 120px)',
              overflowY: 'auto'
            }}
          >
            <Slide in={true} direction="down" style={{transitionDelay: 60}}>
              <Box style={styles.inputBox}>
                <Typography style={{textAlign: 'center'}}>{translate('نوع اسلاید')}</Typography>
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={this.setMimeType}
                >
                  {translate("تصویر")}
                  <span style={{margin: "0 15px"}}>
                    <Switch checked={this.state.slide.mimeType === 'video'}/>
                  </span>
                  {translate("ویدیو")}
                  <Divider style={{margin: "10px 0"}}/>
                </Box>
              </Box>
            </Slide>
            {this.state.slide.mimeType === 'image' && (
              <Zoom in={true} style={{transitionDelay: 60}}>
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
                    defaultImage={this.props.baseUrl + '/icons/special-flat/add.svg'}
                    defaultImageSize="60px"
                    accept="image/*"
                    processQueue={this.state.processQueue}
                    url={this.props.baseUrl + '/api/explore/storeNewSlide'}
                    fileAdded={(file, value, dzObject) => {
                      this.setState({
                        fileAdded: value,
                        imageFile: file,
                        dzObject,
                      })
                    }}
                    onSending={(file, xhr, formData) => {
                      let data = this.state.slide;
                      for (let i in data) {
                        if (data.hasOwnProperty(i))
                          formData.append(camelToSnake(i), data[i]);
                      }
                    }}
                    onSuccess={() => {
                      this.props.history.goBack();
                      this.setState({loading: false});
                      Store.dispatch({
                        type: 'propsUpdated',
                        payload: true
                      });
                    }}
                    onProgress={(progress) => {
                      this.setState({
                        progress
                      })
                    }}
                  />
                  <Typography>{translate('تصویر')}</Typography>
                  <Typography variant="caption" color="error">{this.state.imageHelperText}</Typography>
                </Box>
              </Zoom>
            )}
            {this.state.slide.mimeType === 'video' && (
              <Zoom in={true} style={{transitionDelay: 60}}>
                <Box
                  style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <VideoUpload
                    onChange={(file) => {
                      this.setState({videoFile: file});
                    }}
                  />
                  <Typography>{translate('ویدیو')}</Typography>
                  <Typography variant="caption" color="error">{this.state.videoHelperText}</Typography>
                </Box>
              </Zoom>
            )}
            {this.state.slide.mimeType === 'image' && (
              <Slide
                in={true}
                direction="down"
                style={{
                  transitionDelay: 20,
                  marginTop: 20
                }}
              >
                <Box style={styles.inputBox}>
                  <TextField
                    value={this.state.link}
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      this.handleChange(e, 'link')
                    }}
                    name="link"
                    label={translate("لینک")}
                    fullWidth
                    helperText={translate('به صورت کامل و با http(s):// در ابتدای لینک وارد کنید')}
                  />
                </Box>
              </Slide>
            )}
            <Divider style={{margin: '10px 0'}}/>
            <Typography>
              {translate('محل نمایش اسلاید')}
            </Typography>
            {this.props.filterItems.map(item => {
              if (item.value)
                return (
                  <Box>
                    <Typography variant="caption">
                      {translate(item.title)}{item.title !== item.label && ` : ${item.label}`}
                    </Typography>
                  </Box>
                )
            })}
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
                  color="secondary"
                  style={{
                    borderRadius: 100,
                    width: "90%",
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
        </Box>
      </Slide>
    )
  }
}

export default connect(mapStateToProps)(AddNewSlide);