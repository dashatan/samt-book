import React from "react";
import {connect} from "react-redux";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Fab,
  Slide,
  TextField,
  Toolbar,
  Typography,
  Zoom
} from "@material-ui/core";
import {ArrowBack, Close} from "@material-ui/icons";
import translate from "../../../../../translate";
import Select from "../../explore/filterComponents/Select";
import Upload from "../../../../../extra-components/dropZoneImageUploader";
import Axios from "axios";
import {green, red} from "@material-ui/core/colors";
import Store from "../../../../../redux/store";
import camelToSnake from "../../../../../camelToSnake";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    lang: state.lang,
    user: state.user,
    userToken: state.userToken,
    provinces: state.provinces,
    editingUser: state.editingUser,
  }
}


class EditNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingUser: props.editingUser ? props.editingUser : [],
      password: '',
      dzObject: '',
      avatarHelperText: '',
      mobileHelperText: '',
      passwordHelperText: '',
      roleHelperText: '',
      nameHelperText: '',
      melliCodeHelperText: '',
      nameError: false,
      mobileError: false,
      passwordError: false,
      roleError: false,
      melliCodeError: false,
      provinceHelperText: '',
      provinceError: false,
      loading: '',
      fileAdded: false,
    }
  }

  componentDidMount() {
    !this.props.editingUser && this.getEditingUser();
    if (this.props.editingUser) {
      this.setState({})
    }
  }

  getEditingUser = () => {
    const url = `${this.props.baseUrl}/api/profile/getEditingUser`;
    const data = {userId: this.props.match.params.id}
    Axios.post(url, data).then(e => {
      this.setState({
        editingUser: e.data,
      })
      Store.dispatch({
        type: 'editingUser',
        payload: e.data
      })
    }).catch(e => {
      console.log(e);
    })
  }

  update = () => {
    let error = false;
    if (this.state.editingUser.name === '') {
      error = true;
      this.setState({
        nameHelperText: 'لطفا نام کاربر را وارد کنید',
        nameError: true,
      })
    }
    if ([null, ''].includes(this.state.editingUser.province_id)) {
      error = true;
      this.setState({
        provinceHelperText: 'لطفا استان کاربر را وارد کنید',
        provinceError: true,
      })
    }
    if (this.state.editingUser.mobile === '' || this.state.editingUser.mobile.length < 11) {
      error = true;
      this.setState({
        mobileHelperText: 'لطفا شماره موبایل را به صورت صحیح وارد کنید',
        mobileError: true,
      })
    }
    if (this.state.editingUser.melli_code === '' || this.state.editingUser.melli_code.length < 10) {
      error = true;
      this.setState({
        melliCodeHelperText: 'لطفا کد ملی را به صورت صحیح وارد کنید',
        melliCodeError: true,
      })
    }
    if (this.state.password !== '' && this.state.password.length < 8) {
      error = true;
      this.setState({
        passwordHelperText: 'لطفا رمز عبور را به صورت صحیح وارد کنید',
        passwordError: true,
      })
    }
    if (!error) {
      this.setState({loading: true})
      if (this.state.fileAdded) {
        this.state.dzObject.processQueue();
      } else {
        const url = this.props.baseUrl + '/api/profile/editUser'
        let data = {
          editorToken: this.props.userToken,
          userToken: this.state.editingUser.api_token,
          province_id: this.state.editingUser.province_id,
          mobile: this.state.editingUser.mobile,
          password: this.state.password,
          role: this.state.editingUser.role,
          name: this.state.editingUser.name,
          melli_code: this.state.editingUser.melli_ode,
          email: this.state.editingUser.email,
          lang: this.state.editingUser.lang,
        }
        Axios.post(url, data).then(e => {
          this.updateSuccess(e.data);
        }).catch(e => {
          this.setState({loading: false})
          console.log(e);
        })
      }
    }
  }

  updateSuccess = (response) => {
    this.setState({loading: false})
    Store.dispatch({
      type: 'propsUpdated',
      payload: true
    });
    this.props.history.goBack();
  }

  handleChange = (e, param, value) => {
    let editingUser = this.state.editingUser;
    editingUser[camelToSnake(param)] = value ? value : e.target.value;
    this.setState({
      editingUser,
      [`${param}HelperText`]: '',
      [`${param}Error`]: false,
    })
  }

  render() {
    if (this.state.editingUser.length === 0) {
      return (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
          }}
        >
          <CircularProgress/>
        </Box>
      )
    }
    let lang = languages.find(x => x.value === this.state.editingUser.lang);
    let role = roles.find(x => x.value === this.state.editingUser.role);
    let province = this.props.provinces.find(x => x.value === this.state.editingUser.province_id);
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
                <Typography>{this.state.editingUser ? this.state.editingUser.name : ""}</Typography>
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
              padding: '80px 20px',
              height: 'calc(100vh - 180px)',
              overflowY: 'auto'
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
                  defaultImage={this.state.editingUser.avatar}
                  defaultImageSize="cover"
                  accept="image/*"
                  url={this.props.baseUrl + '/api/profile/editUser'}
                  fileAdded={(file, value, dzObject) => {
                    this.setState({
                      dzObject,
                      fileAdded: value,
                    })
                  }}
                  onSending={(file, xhr, formData) => {
                    formData.append('editorToken', this.props.userToken);
                    formData.append('userToken', this.state.editingUser.api_token);
                    formData.append('province_id', this.state.editingUser.province_id);
                    formData.append('lang', this.state.editingUser.lang);
                    formData.append('email', this.state.editingUser.email);
                    formData.append('mobile', this.state.editingUser.mobile);
                    formData.append('name', this.state.editingUser.name);
                    formData.append('melli_code', this.state.editingUser.melli_code);
                    formData.append('role', this.state.editingUser.role);
                    formData.append('password', this.state.password);
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
              <Box>
                <TextField
                  value={this.state.editingUser.name}
                  variant="outlined"
                  size="small"
                  label={translate('نام')}
                  onChange={(e) => {
                    this.handleChange(e, 'name')
                  }}
                  fullWidth
                  helperText={this.state.nameHelperText}
                  error={this.state.nameError}
                />
              </Box>
            </Slide>
            <Box style={{height: 30}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 30}}>
              <Box>
                <TextField
                  value={this.state.editingUser.melli_code}
                  variant="outlined"
                  size="small"
                  label={translate('کد ملی')}
                  onChange={(e) => {
                    this.handleChange(e, 'melli_code')
                  }}
                  fullWidth
                  helperText={this.state.melliCodeHelperText}
                  error={this.state.melliCodeError}
                />
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}
                >
                  <span>10 / </span>
                  <span
                    style={{color: this.state.editingUser.melli_code.length < 10 ? red.A200 : green.A400}}
                  >
                    {this.state.editingUser.melli_code.length}
                  </span>
                </Box>
              </Box>
            </Slide>
            <Box style={{height: 30}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 40}}>
              <Box>
                <TextField
                  value={this.state.editingUser.mobile}
                  variant="outlined"
                  size="small"
                  type="number"
                  label={translate('شماره موبایل')}
                  onChange={(e) => {
                    this.handleChange(e, 'mobile')
                  }}
                  fullWidth
                  helperText={this.state.mobileHelperText}
                  error={this.state.mobileError}
                />
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}
                >
                  <span>11 / </span>
                  <span
                    style={{color: this.state.editingUser.mobile.length < 11 ? red.A200 : green.A400}}
                  >
                    {this.state.editingUser.mobile.length}
                  </span>
                </Box>
              </Box>
            </Slide>
            <Box style={{height: 30}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 50}}>
              <Box>
                <TextField
                  value={this.state.password}
                  variant="outlined"
                  size="small"
                  label={translate('رمز عبور جدید')}
                  onChange={(e) => {
                    this.handleChange(e, 'password')
                  }}
                  fullWidth
                  helperText={this.state.passwordHelperText}
                  error={this.state.passwordError}
                />
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}
                >
                  <span>8 / </span>
                  <span
                    style={{color: this.state.password.length < 8 ? red.A200 : green.A400}}
                  >
                    {this.state.password.length}
                  </span>
                </Box>
              </Box>
            </Slide>
            <Box style={{height: 30}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 60}}>
              <Box>
                <TextField
                  value={this.state.editingUser.email ? this.state.editingUser.email : ''}
                  variant="outlined"
                  size="small"
                  label={translate('ایمیل')}
                  onChange={(e) => {
                    this.handleChange(e, 'email')
                  }}
                  fullWidth
                />
              </Box>
            </Slide>
            <Box style={{height: 30}}/>
            {this.props.user.role === 'admin' && (
              <Slide in={true} direction="down" style={{transitionDelay: 70}}>
                <div>
                  <Select
                    variant="linear"
                    btnVariant="outlined"
                    withSearch={true}
                    withIcon={false}
                    withAllOption={false}
                    options={this.props.provinces}
                    title={translate("استان")}
                    required={true}
                    name="provinceId"
                    match={this.props.match}
                    label={province ? province.label : ''}
                    icon={"images/icons/special-flat/documents.svg"}
                    response={(name, value) => {
                      this.handleChange('', name, value)
                    }}
                    helperText={this.state.provinceHelperText}
                    error={this.state.provinceError}
                  />
                </div>
              </Slide>
            )}
            <Box style={{height: 30}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 80}}>
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
                    this.handleChange('', name, value)
                  }}
                />
              </div>
            </Slide>
            <Box style={{height: 30}}/>
            <Slide in={true} direction="down" style={{transitionDelay: 90}}>
              <div>
                <Select
                  variant="linear"
                  btnVariant="outlined"
                  withSearch={false}
                  withIcon={false}
                  withAllOption={false}
                  options={roles.filter(x => x.show.includes(this.props.user.role))}
                  title={translate("نقش کاربری")}
                  required={true}
                  name="role"
                  match={this.props.match}
                  label={role.label}
                  icon={"images/icons/special-flat/documents.svg"}
                  response={(name, value) => {
                    this.handleChange('', name, value)
                  }}
                />
              </div>
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
                  color="secondary"
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
        </Box>
      </Slide>
    )
  }
}

export default connect(mapStateToProps)(EditNews);