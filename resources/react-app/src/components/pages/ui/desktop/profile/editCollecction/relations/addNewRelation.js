import React from "react";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {Box, Button, CircularProgress, Switch, TextField, Toolbar, Zoom} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../translate";
import Pluralize from 'pluralize';
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import Select from "../../../explore/filterComponents/Select";
import Slide from "@material-ui/core/Slide";
import {green, red} from "@material-ui/core/colors";
import Upload from "../../../../../../extra-components/dropZoneImageUploader";
import Divider from "@material-ui/core/Divider";
import VideoUpload from "../../../../../../extra-components/videoUploader";
import Map from "../../../../../../extra-components/locationMap";
import Axios from "axios";
import camelToSnake from "../../../../../../camelToSnake";
import Store from "../../../../../../redux/store";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    EditingCollection: state.EditingCollection,
    categories: state.categories,
    socialMedias: state.socialMedias,
    types: state.types,
    userToken: state.userToken,
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

class AddNewRelation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: {
        value: '',
        label: ''
      },
      typeError: false,
      typeHelperText: '',
      categoryId: {
        value: '',
        label: ''
      },
      categoryIdError: false,
      categoryIdHelperText: '',
      socialMediaTitle: {
        value: '',
        label: ''
      },
      socialMediaTitleError: false,
      socialMediaTitleHelperText: '',
      title: '',
      titleError: false,
      titleHelperText: '',
      dsc: '',
      dscError: false,
      dscHelperText: '',
      name: '',
      nameError: false,
      nameHelperText: '',
      role: '',
      roleError: false,
      roleHelperText: '',
      location: '35.69299,51.38525',
      locationCodeError: false,
      locationHelperText: '',
      postalCode: '',
      postalCodeError: false,
      postalCodeHelperText: '',
      address: '',
      addressError: false,
      addressHelperText: '',
      phoneNumber: '',
      phoneNumberError: false,
      phoneNumberHelperText: '',
      link: '',
      linkError: false,
      linkHelperText: translate('به صورت کامل و با http(s):// در ابتدای لینک وارد کنید'),
      fileAdded: false,
      fileRemoved: false,
      setImage: false,
      storedRelationId: 0,
      slideTypeIsVideo: false,
      imageFile: '',
      processQueue: false,
      imageHelperText: '',
      videoHelperText: '',
      dzObject: '',
      videoFile: '',
      lat: 35.69299,
      lng: 51.38525,
      loading: false,
      progress: 0,
    }

    this.textFieldRef = null;
    this.setTextFieldRef = (element) => {
      this.textFieldRef = element;
    }
  }

  storeRelation = () => {
    this.setState({loading: true});
    let data = this.dataStore();
    let error = false;
    let errors = [];
    for (let i in data) {
      this.setState({
        [i + 'Error']: false,
        [i + 'HelperText']: '',
      })
      if (!data[i]) {
        error = true;
        errors.push({[i]: data[i]})
        this.setState({
          [i + 'Error']: true,
          [i + 'HelperText']: translate(i) + ' ' + translate('الزامی است'),
        })
      }
    }
    if (error) {
      console.log(errors)
      this.setState({loading: false});
    } else {
      if (data.image) {
        this.state.dzObject.processQueue();
      } else {
        let formData = new FormData();
        formData.append('userToken', this.props.userToken);
        formData.append('parentModelName', 'Collection');
        formData.append('parentId', this.props.EditingCollection.id);
        formData.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(this.props.match.params.relation)));
        formData.append('relation', this.props.match.params.relation);
        for (let i in data) {
          formData.append(camelToSnake(i), data[i]);
        }
        const url = this.props.baseUrl + '/api/profile/storeRelation';
        Axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            let percentCompleted = Math.floor((
              progressEvent.loaded * 100
            ) / progressEvent.total);
            this.setState({progress: percentCompleted});
          }
        }).then(e => {
          this.setState({loading: false});
          this.props.history.goBack();
          Store.dispatch({
            type: 'propsUpdated',
            payload: true
          });
        }).catch(e => {
          this.setState({loading: false});
          console.log(e);
        })
      }
    }
  }

  dataStore = () => {
    let relation = this.props.match.params.relation;
    let data = {};
    switch (relation) {
      case 'products':
      case 'participants':
        data = {
          categoryId: this.state.categoryId.value,
          title: this.state.title,
          dsc: this.state.dsc,
          image: this.state.fileAdded,
        }
        break;
      case 'wantads':
        data = {
          type: this.state.type.value,
          categoryId: this.state.categoryId.value,
          title: this.state.title,
          dsc: this.state.dsc,
          image: this.state.fileAdded,
        }
        break;
      case 'news':
        data = {
          title: this.state.title,
          dsc: this.state.dsc,
          image: this.state.fileAdded,
        }
        break;
      case 'boards':
        data = {
          name: this.state.name,
          role: this.state.role,
          dsc: this.state.dsc,
          image: this.state.fileAdded,
        }
        break;
      case 'slides':
        data = {
          link: this.state.link,
        }
        if (this.state.slideTypeIsVideo) {
          data['file'] = this.state.videoFile;
          data['video'] = this.state.videoFile;
          data['mime_type'] = 'video';
        } else {
          data['image'] = this.state.fileAdded;
          data['mime_type'] = 'image';
        }
        break;
      case 'addresses':
        data = {
          title: this.state.title,
          postalCode: this.state.postalCode,
          address: this.state.address,
          location: this.state.location,
        }
        break;
      case 'phones':
        data = {
          title: this.state.title,
          phoneNumber: this.state.phoneNumber,
        }
        break;
      case 'socialMedias':
        data = {
          title: this.state.socialMediaTitle.value,
          url: this.state.link,
        }
        break;
      case 'agents':
        data = {
          title: this.state.title,
          phoneNumber: this.state.phoneNumber,
          address: this.state.address,
          location: this.state.location,
          image: this.state.fileAdded,
        }
        break;
      case 'catalogs':
        data = {
          catalog: this.state.catalog,
        }
        break;
    }
    return data;
  }

  handleFocus = (e) => {
    let offsetTop = e.target.closest('.MuiTextField-root').offsetTop - 70;
    const scrollElement = document.getElementById('add-new-relation-scroll-box');
    scrollElement.scrollTop = offsetTop;
  }

  render() {
    if (!this.props.EditingCollection) {
      return (
        <Box
          style={{
            paddingTop: 80,
            height: "calc(100vh - 60px)",
            textAlign: 'center',
          }}
        >
          <CircularProgress color="primary"/>
        </Box>
      )
    }
    let showItems = {
      type: false,
      categoryId: false,
      title: false,
      dsc: false,
      name: false,
      role: false,
      location: false,
      postalCode: false,
      socialMediaTitle: false,
      address: false,
      phone: false,
      link: false,
      slideType: false,
      image: false,
      video: false,
      catalog: false,
    }
    let relation = this.props.match.params.relation;
    showItems.type = ['wantads'].includes(relation);
    showItems.categoryId = ['products', 'participants', 'wantads'].includes(relation);
    showItems.title = [
      'products',
      'participants',
      'wantads',
      'news',
      'addresses',
      'phones',
      'agents'
    ].includes(relation);
    showItems.name = ['boards'].includes(relation);
    showItems.role = ['boards'].includes(relation);
    showItems.dsc = ['products', 'participants', 'wantads', 'news', 'boards'].includes(relation);
    showItems.phone = ['phones', 'agents'].includes(relation);
    showItems.address = ['addresses', 'agents'].includes(relation);
    showItems.location = ['addresses', 'agents'].includes(relation);
    showItems.postalCode = ['addresses'].includes(relation);
    showItems.link = ['slides', 'socialMedias'].includes(relation);
    showItems.slideType = ['slides'].includes(relation);
    showItems.video = ['slides'].includes(relation) && this.state.slideTypeIsVideo;
    showItems.image = [
      'products',
      'participants',
      'wantads',
      'news',
      'slides',
      'agents',
      'boards'
    ].includes(relation) && !this.state.slideTypeIsVideo;
    showItems.socialMediaTitle = ['socialMedias'].includes(relation)
    showItems.catalog = ['catalogs'].includes(relation)

    let types = this.props.types.filter(x => x.class === 'wtd');
    let categories = this.props.categories;
    let categoryIdSelectVariant = 'linearNested';
    if (relation === 'products') {
      categories = this.props.categories.filter(x => x.class === 'prd');
    }
    if (relation === 'wantads') {
      categories = this.props.categories.filter(x => x.class === 'wtd');
    }
    if (relation === 'participants') {
      let parentCategory = this.props.categories.find(x => x.value === this.props.EditingCollection.category_id);
      categories = parentCategory ? parentCategory.children : [];
      categoryIdSelectVariant = 'linear';
      if (this.props.EditingCollection.category_id === 0) {
        categories = this.props.categories.filter(x => x.class === 'prd');
        categoryIdSelectVariant = 'linearNested';
      }
    }
    return (
      <Box
        style={{
          position: 'fixed',
          height: '100vh',
          width: '100%',
          top: 0,
          right: 0,
          backgroundColor: '#ffffff',
          zIndex: 100000,
        }} id="addNewRelation"
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
              <Typography>
                {translate('ثبت') +
                ' ' +
                translate(Pluralize.singular(this.props.match.params.relation)) +
                ' ' +
                translate('جدید')}
              </Typography>
              <Typography variant="caption">{this.props.EditingCollection.label}</Typography>
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
          id="add-new-relation-scroll-box" style={{
          paddingTop: 80,
          paddingBottom: 80,
          overflowY: 'auto',
          height: 'calc(100vh - 160px)'
        }}
        >
          {showItems.type && (
            <Slide in={true} direction="down" style={{transitionDelay: 10}}>
              <Box style={styles.inputBox}>
                <Select
                  // key={categoryId}
                  variant="linear"
                  btnVariant="outlined"
                  withSearch={false}
                  withIcon={false}
                  withAllOption={false}
                  options={types}
                  title={translate("طبقه بندی")}
                  required={true}
                  name="type"
                  match={this.props.match}
                  label={this.state.type.label}
                  icon={"images/icons/special-flat/documents.svg"}
                  response={(name, value, label) => {
                    this.setState({
                      type: {
                        value: value,
                        label: label
                      }
                    });
                  }}
                  error={this.state.typeError}
                  helperText={this.state.typeHelperText}
                />
                <input type="hidden" name="type" id="type" value={this.state.type.value}/>
              </Box>
            </Slide>
          )}
          {showItems.categoryId && (
            <Slide in={true} direction="down" style={{transitionDelay: 10}}>
              <Box style={styles.inputBox}>
                <Select
                  // key={categoryId}
                  variant={categoryIdSelectVariant}
                  btnVariant="outlined"
                  withSearch={true}
                  withIcon={false}
                  withAllOption={false}
                  options={categories}
                  title={translate("دسته بندی")}
                  required={true}
                  name="categoryId"
                  match={this.props.match}
                  label={this.state.categoryId.label}
                  icon={"images/icons/special-flat/checklist.svg"}
                  response={(name, value, label) => {
                    this.setState({
                      categoryId: {
                        value: value,
                        label: label
                      }
                    });
                  }}
                  error={this.state.categoryIdError}
                  helperText={this.state.categoryIdHelperText}
                />
                <input type="hidden" name="categoryId" id="categoryId" value={this.state.categoryId.value}/>
              </Box>
            </Slide>
          )}

          {showItems.title && (
            <Slide in={true} direction="down" style={{transitionDelay: 20}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.title}
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    this.setState({title: e.target.value})
                  }}
                  name="title"
                  label={translate("عنوان")}
                  fullWidth
                  error={this.state.titleError}
                  helperText={this.state.titleHelperText}
                  onFocus={this.handleFocus}
                />
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}
                >
                  <span>10 / </span>
                  <span
                    style={{
                      color: this.state.title.length < 10
                        ? red.A200
                        : green.A400
                    }}
                  >{this.state.title.length}</span>
                </Box>
              </Box>
            </Slide>
          )}

          {showItems.name && (
            <Slide in={true} direction="down" style={{transitionDelay: 30}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.name}
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    this.setState({name: e.target.value})
                  }}
                  name="name"
                  label={translate("نام و نام خانوادگی")}
                  fullWidth
                  error={this.state.nameError}
                  helperText={this.state.nameHelperText}
                  onFocus={this.handleFocus}
                />
              </Box>
            </Slide>
          )}
          {showItems.role && (
            <Slide in={true} direction="down" style={{transitionDelay: 30}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.role}
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    this.setState({role: e.target.value})
                  }}
                  name="role"
                  label={translate("سمت شغلی")}
                  fullWidth
                  error={this.state.roleError}
                  helperText={this.state.roleHelperText}
                />
              </Box>
            </Slide>
          )}

          {showItems.phone && (
            <Slide in={true} direction="down" style={{transitionDelay: 40}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.phoneNumber}
                  variant="outlined"
                  size="small"
                  type="number"
                  onChange={(e) => {
                    if (e.target.value.length <= 11) {
                      this.setState({phoneNumber: e.target.value})
                    }
                  }}
                  name="phoneNumber"
                  label={translate("شماره تلفن")}
                  fullWidth
                  error={this.state.phoneNumberError}
                  helperText={this.state.phoneNumberHelperText}
                  onFocus={this.handleFocus}
                />
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}
                >
                  <span>11 / </span>
                  <span
                    style={{
                      color: this.state.phoneNumber.length < 11
                        ? red.A200
                        : green.A400
                    }}
                  >{this.state.phoneNumber.length}</span>
                </Box>
              </Box>
            </Slide>
          )}

          {showItems.dsc && (
            <Slide in={true} direction="down" style={{transitionDelay: 50}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.dsc}
                  variant="outlined"
                  multiline
                  rows={5}
                  onChange={(e) => {
                    this.setState({dsc: e.target.value})
                  }}
                  name="dsc"
                  label={translate("توضیحات")}
                  fullWidth
                  error={this.state.dscError}
                  helperText={this.state.dscHelperText}
                  onFocus={this.handleFocus}
                />
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}
                >
                  <span>20 / </span>
                  <span
                    style={{color: this.state.dsc.length < 20 ? red.A200 : green.A400}}
                  >{this.state.dsc.length}</span>
                </Box>
              </Box>
            </Slide>
          )}

          {showItems.postalCode && (
            <Slide in={true} direction="down" style={{transitionDelay: 40}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.postalCode}
                  variant="outlined"
                  size="small"
                  type="number"
                  onChange={(e) => {
                    this.setState({postalCode: e.target.value})
                  }}
                  name="postalCode"
                  label={translate("کد پستی")}
                  fullWidth
                  error={this.state.postalCodeError}
                  helperText={this.state.postalCodeHelperText}
                  onFocus={this.handleFocus}
                />
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}
                >
                  <span>10 / </span>
                  <span
                    style={{
                      color: this.state.postalCode.length < 10
                        ? red.A200
                        : green.A400
                    }}
                  >{this.state.postalCode.length}</span>
                </Box>
              </Box>
            </Slide>
          )}

          {showItems.address && (
            <Slide in={true} direction="down" style={{transitionDelay: 50}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.address}
                  variant="outlined"
                  multiline
                  rows={5}
                  onChange={(e) => {
                    this.setState({address: e.target.value})
                  }}
                  name="address"
                  label={translate("آدرس")}
                  fullWidth
                  error={this.state.addressError}
                  helperText={this.state.addressHelperText}
                  onFocus={this.handleFocus}
                />
              </Box>
            </Slide>
          )}

          {showItems.location && (
            <Slide in={true} direction="down" style={{transitionDelay: 50}}>
              <Box style={styles.inputBox}>
                <Map
                  lat={this.state.lat}
                  lng={this.state.lng}
                  onChange={(lat, lng) => {
                    this.setState({
                      lat,
                      lng,
                      location: `${lat},${lng}`,
                    });
                  }}
                />
              </Box>
            </Slide>
          )}

          {showItems.slideType && (
            <Slide in={true} direction="down" style={{transitionDelay: 60}}>
              <Box style={styles.inputBox}>
                <Typography style={{textAlign: 'center'}}>{translate('نوع اسلاید')}</Typography>
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    this.setState({slideTypeIsVideo: !this.state.slideTypeIsVideo});
                  }}
                >
                  {translate("تصویر")}
                  <span style={{margin: "0 15px"}}>
                    <Switch checked={this.state.slideTypeIsVideo}/>
                  </span>
                  {translate("ویدیو")}
                  <Divider style={{margin: "10px 0"}}/>
                </Box>
              </Box>
            </Slide>
          )}

          {showItems.image && (
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
                  url={this.props.baseUrl + '/api/profile/storeRelation'}
                  fileAdded={(file, value, dzObject) => {
                    this.setState({
                      fileAdded: value,
                      imageFile: file,
                      dzObject,
                    })
                  }}
                  onSending={(file, xhr, formData) => {
                    formData.append('userToken', this.props.userToken);
                    formData.append('parentModelName', 'Collection');
                    formData.append('parentId', this.props.EditingCollection.id);
                    formData.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(this.props.match.params.relation)));
                    formData.append('relation', this.props.match.params.relation);
                    let data = this.dataStore();
                    for (let i in data) {
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
          {showItems.video && (
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

          {showItems.socialMediaTitle && (
            <Slide in={true} direction="down" style={{transitionDelay: 10}}>
              <Box style={styles.inputBox}>
                <Select
                  variant="grid"
                  withSearch={true}
                  withIcon={true}
                  withAllOption={false}
                  options={this.props.socialMedias}
                  title={translate("عنوان شبکه اجتماعی")}
                  required={true}
                  name="title"
                  match={this.props.match}
                  label={this.state.socialMediaTitle.label}
                  icon={"images/icons/special-flat/checklist.svg"}
                  response={(name, value, label) => {
                    this.setState({
                      socialMediaTitle: {
                        value: value,
                        label: label
                      }
                    });
                  }}
                />
                <input type="hidden" name="categoryId" id="categoryId" value={this.state.categoryId.value}/>
              </Box>
            </Slide>
          )}

          {showItems.link && (
            <Slide in={true} direction="down" style={{transitionDelay: 20}}>
              <Box style={styles.inputBox}>
                <TextField
                  value={this.state.link}
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    this.setState({link: e.target.value})
                  }}
                  name="link"
                  label={translate("لینک")}
                  fullWidth
                  error={this.state.linkError}
                  helperText={this.state.linkHelperText}
                  onFocus={this.handleFocus}
                />
              </Box>
            </Slide>
          )}

          {showItems.catalog && (
            <Slide in={true} direction="down" style={{transitionDelay: 10}}>
              <Box style={styles.inputBox}>
                <input
                  type="file" name="catalog" onChange={(e) => {
                  this.setState({catalog: e.target.files[0]});
                }} accept="application/pdf"
                />
                <Typography variant="caption">{translate('تنها فایل pdf مجاز است')}</Typography>
              </Box>
            </Slide>
          )}

        </Box>
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
                color="secondary"
                style={{
                  borderRadius: 100,
                  width: "90%"
                }}
                onClick={this.storeRelation}
              >

                {this.state.loading
                  ? <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption" style={{
                      position: 'absolute',
                      top: 13,
                      fontSize: 10,
                      marginRight: 'auto',
                      marginLeft: 'auto',
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                    }}
                    >{this.state.progress}</Typography>
                    <CircularProgress
                      size={30}
                      color="inherit"
                      variant="determinate"
                      value={this.state.progress}
                    />
                  </Box>
                  : translate("ذخیره")}
              </Button>
            </Slide>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }
}

export default withRouter(connect(mapStateToProps)(AddNewRelation));