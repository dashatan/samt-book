import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import translate from "../../../../../translate";
import camelToSnake from "../../../../../camelToSnake";
import Axios from "axios";
import Store from "../../../../../redux/store";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import {Button, CircularProgress, Toolbar, Zoom} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import Select from "../../explore/filterComponents/Select";
import TextField from "@material-ui/core/TextField";
import {green, red} from "@material-ui/core/colors";
import Map from "../../../../../extra-components/locationMap";
import Upload from "../../../../../extra-components/dropZoneImageUploader";
import VideoUpload from "../../../../../extra-components/videoUploader";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import $ from 'jquery';

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    relationProps: state.relationProps,
    categories: state.categories,
    types: state.types,
    EditingCollection: state.EditingCollection,
    editingRelation: state.editingRelation,
  }
}

const EditSlide = (props) => {
  let {state} = useLocation();
  let {goBack} = useHistory();
  const {editingSlide, caption} = state;
  let initialInputs = [
    {
      type: 'dzFileAdded',
      name: 'dzFileAdded',
      value: false,
    },
    {
      type: 'mimeType',
      name: 'mimeType',
      value: editingSlide.mime_type,
    },
    {
      type: 'file',
      name: 'file',
      preview: editingSlide.icon,
      mimeType: editingSlide.mime_type,
      title: editingSlide.mime_type === 'image' ? 'تصویر' : 'ویدیو',
      label: editingSlide.mime_type === 'image' ? 'تصویر' : 'ویدیو',
      value: '',
    },
    {
      type: 'text',
      inputType: 'text',
      name: 'link',
      id: 'link',
      title: 'لینک',
      label: 'لینک',
      value: editingSlide.link,
      caption: 'به صورت کامل و با http(s):// در ابتدای لینک وارد کنید',
      variant: 'outlined',
      error: false,
      helperText: '',
      scrollOffsetOnFocus: -10,
    },
    {
      type: 'text',
      inputType: 'number',
      name: 'sort',
      id: 'sort',
      title: 'ترتیب نمایش',
      label: 'ترتیب نمایش',
      value: editingSlide.sort,
      variant: 'outlined',
      error: false,
      helperText: '',
      scrollOffsetOnFocus: -10,
    },
  ]
  let [inputs, setInputs] = useState(initialInputs);
  let [changed, setChanged] = useState(false);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  let [progress, setProgress] = useState(0);
  let [dzObject, setDzObject] = useState(null);
  let [resize, setResize] = useState({
    scrollElementHeight: 'calc(100vh - 140px)',
    textFieldFocused: false,
    virtualKeyboardVisible: false,
    focusedTextFieldId: null,
    focusedTextFieldOffset: null,
  });
  useEffect(() => {
    let scrollElement = $("#add-new-relation-scroll-element");
    if (resize.textFieldFocused) {
      let anchorElement = $(`#${resize.focusedTextFieldId}`);
      scrollElement.scrollTo(anchorElement, {offset: resize.focusedTextFieldOffset});
    }
  })
  let delay = 0;
  const handleChange = (key, value, label) => {
    let newInputs = [...inputs];
    newInputs[key].value = value;
    newInputs[key].error = false;
    newInputs[key].helperText = '';
    if (label) {
      newInputs[key].label = label;
    }
    setInputs(newInputs);
    setChanged(true);
  }

  const handleFocus = (id, offset) => {
    setResize({
      ...resize,
      textFieldFocused: true,
      focusedTextFieldId: id,
      focusedTextFieldOffset: offset,
    })
  }

  const handleBlur = () => {
    setResize({
      ...resize,
      textFieldFocused: false,
      focusedTextFieldId: null,
      focusedTextFieldOffset: null,
    })
  }

  const store = () => {
    if (!changed) {
      goBack();
      return false;
    }
    let StoreError = false;
    inputs.map((input, key) => {
      let newInputs = [...inputs];
      newInputs[key].error = false;
      newInputs[key].helperText = '';
      setInputs(newInputs);
      if (input.withLength && input.value.length < input.requiredLength) {
        StoreError = true;
        let newInputs = [...inputs];
        newInputs[key].error = true;
        newInputs[key].helperText = translate('حداقل') +
          ' ' +
          input.requiredLength +
          ' ' +
          translate('حرف باید وارد کنید');
        setInputs(newInputs);
      }
      if (input.required && !input.value) {
        StoreError = true;
        let newInputs = [...inputs];
        newInputs[key].error = true;
        newInputs[key].helperText = input.title + ' ' + translate('الزامی است');
        setInputs(newInputs);
      }
    })
    if (!StoreError) {
      setLoading(true);
      let mimeType = inputs.find(x => x.name === 'mimeType');
      if (mimeType && mimeType.value === 'image') {
        let dzFileAdded = inputs.find(x => x.name === 'dzFileAdded');
        if (dzFileAdded && dzFileAdded.value) {
          return dzObject && dzObject.processQueue();
        }
      }
      return requestWithAxios();
    }

  }

  const requestWithAxios = () => {
    let formData = new FormData();
    formData.append('relationModelName', 'Slide');
    formData.append('relationModelId', editingSlide.id);
    inputs.map((input) => {
      formData.append(camelToSnake(input.name), input.value);
    })
    const url = props.baseUrl + '/api/profile/updateRelation';
    Axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.floor((
          progressEvent.loaded * 100
        ) / progressEvent.total);
        setProgress(percentCompleted);
      }
    }).then(e => {
      setLoading(false);
      goBack();
      Store.dispatch({
        type: 'propsUpdated',
        payload: true
      });
    }).catch(e => {
      setLoading(false);
      console.log(e);
    })
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
      }}
    >
      {!resize.virtualKeyboardVisible && (
        <Slide in={true} direction={"down"}>
          <Box>
            <AppBar color={"inherit"} position={"fixed"}>
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
                    {translate(editingSlide.title)}
                  </Typography>
                  <Typography variant="caption">{caption || ''}</Typography>
                </Box>
                <Fab
                  size="small"
                  focusRipple
                  style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  }}
                >
                  <ArrowBack onClick={goBack}/>
                </Fab>
              </Toolbar>
            </AppBar>
            <Box style={{height: 60}}/>
          </Box>
        </Slide>
      )}
      <Box
        id="add-new-relation-scroll-element"
        style={{
          backgroundColor: "#f0f8ff",
          height: resize.scrollElementHeight,
          padding: 10,
          overflowY: "auto",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: 10,
            paddingTop: 30,
            borderRadius: 10
          }}
        >
          {inputs.map((input, key) => {
            delay = delay + 10;
            switch (input.type) {
              case 'select':
                return (
                  <Slide key={key} in={true} direction="down" style={{transitionDelay: delay}}>
                    <Box
                      style={{
                        marginBottom: 20,
                      }}
                    >
                      <Select
                        id={input.id}
                        variant={input.variant}
                        btnVariant={input.btnVariant}
                        withSearch={input.withSearch}
                        withIcon={input.withIcon}
                        withAllOption={input.withAllOption}
                        withOthersOption={input.withOthersOption}
                        options={input.options}
                        title={translate(input.title)}
                        required={input.required}
                        name={input.name}
                        label={input.label}
                        icon={input.icon}
                        error={input.error}
                        helperText={input.helperText}
                        response={(name, value, label) => {
                          handleChange(key, value, label);
                        }}
                      />
                    </Box>
                  </Slide>
                )
              case 'text':
                return (
                  <Slide key={key} in={true} direction="down" style={{transitionDelay: delay}}>
                    <Box
                      style={{
                        marginBottom: 20,
                      }}
                    >
                      <TextField
                        id={input.id}
                        value={input.value}
                        variant={input.variant}
                        size="small"
                        type={input.inputType}
                        name={input.name}
                        label={translate(input.label)}
                        fullWidth
                        multiline={input.inputType === 'textarea'}
                        rows={input.rows}
                        error={input.error}
                        helperText={input.helperText}
                        required={input.required}
                        onChange={(e) => {
                          handleChange(key, e.target.value)
                        }}
                        onFocus={() => {
                          handleFocus(input.id, input.scrollOffsetOnFocus || 0)
                        }}
                        onBlur={handleBlur}
                      />
                      {input.withLength && (
                        <Typography
                          style={{
                            display: 'flex',
                            justifyContent: "flex-end"
                          }}
                        >
                          <span>{input.requiredLength} / </span>
                          <span
                            style={{
                              color: input.value ? input.value.length < input.requiredLength
                                ? red.A200
                                : green.A400
                                : green.A400
                            }}
                          >{input.value && input.value.length}</span>
                        </Typography>
                      )}
                    </Box>
                  </Slide>
                )
              case 'location':
                return (
                  <Slide key={key} in={true} direction="down" style={{transitionDelay: delay}}>
                    <Box>
                      <Map
                        lat={input.value.split(',')[0]}
                        lng={input.value.split(',')[1]}
                        onChange={(lat, lng) => {
                          handleChange(key, `${lat},${lng}`)
                        }}
                      />
                    </Box>
                  </Slide>
                )
              case 'image' :
                return (
                  <Zoom key={key} in={true} style={{transitionDelay: delay}}>
                    <Box
                      style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexFlow: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                      }}
                    >
                      <Upload
                        defaultImage={props.baseUrl + '/' + input.defaultImage}
                        defaultImageSize="cover"
                        accept="image/*"
                        url={props.baseUrl + '/api/profile/updateRelation'}
                        fileAdded={(file, value, obj) => {
                          let mimeTypeKey = inputs.findIndex(x => x.name === 'mimeType');
                          setDzObject(obj)
                          handleChange(key, value);
                          handleChange(mimeTypeKey, value ? 'image' : '')
                        }}
                        onSending={(file, xhr, formData) => {
                          formData.append('relationModelName', 'Slide');
                          formData.append('relationModelId', editingSlide.id);
                          inputs.filter(x => !['mimeType', 'fileAdded'].includes(x.name)).map((input) => {
                            formData.append(camelToSnake(input.name), input.value);
                          })
                        }}
                        onSuccess={() => {
                          setLoading(false);
                          goBack();
                          Store.dispatch({
                            type: 'propsUpdated',
                            payload: true
                          });
                        }}
                        onProgress={(prg) => {
                          setProgress(prg)
                        }}
                      />
                      <Typography
                        style={{
                          fontSize: 14,
                          marginTop: 7
                        }}
                      >
                        {translate(input.title)}
                        {input.required && (
                          <span>*</span>
                        )}
                      </Typography>
                      <Typography variant="caption" color="error">{input.helperText}</Typography>
                    </Box>
                  </Zoom>
                )
              case 'file' :
                let mimeType = inputs.find(x => x.name === 'mimeType');
                if (mimeType.value === 'image') {
                  return (
                    <Zoom key={key} in={true} style={{transitionDelay: delay}}>
                      <Box
                        style={{
                          textAlign: 'center',
                          display: 'flex',
                          flexFlow: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                        }}
                      >
                        <Upload
                          defaultImage={props.baseUrl + '/' + input.preview}
                          defaultImageSize="cover"
                          accept="image/*"
                          url={props.baseUrl + '/api/profile/updateRelation'}
                          fileAdded={(file, value, obj) => {
                            setDzObject(obj)
                            let dzFileAddedKey = inputs.findIndex(x => x.name === 'dzFileAdded');
                            handleChange(dzFileAddedKey, value);
                          }}
                          onSending={(file, xhr, formData) => {
                            formData.append('relationModelName', 'Slide');
                            formData.append('relationModelId', editingSlide.id);
                            inputs.filter(x => !['file'].includes(x.name)).map((input) => {
                              formData.append(camelToSnake(input.name), input.value);
                            })
                          }}
                          onSuccess={() => {
                            setLoading(false);
                            goBack();
                            Store.dispatch({
                              type: 'propsUpdated',
                              payload: true
                            });
                          }}
                          onProgress={(prg) => {
                            setProgress(prg)
                          }}
                        />
                        <Typography
                          style={{
                            fontSize: 14,
                            marginTop: 7
                          }}
                        >
                          {translate(input.label)}
                          {input.required && (
                            <span>*</span>
                          )}
                        </Typography>
                        <Typography variant="caption" color="error">{input.helperText}</Typography>
                      </Box>
                    </Zoom>
                  )
                } else if (mimeType.value === 'video') {
                  return (
                    <Zoom key={key} in={true} style={{transitionDelay: delay}}>
                      <Box
                        style={{
                          textAlign: 'center',
                          display: 'flex',
                          flexFlow: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                        }}
                      >
                        <VideoUpload
                          onChange={(file) => {
                            handleChange(key, file);
                          }}
                          defaultVideo={props.baseUrl + '/' + input.preview}
                        />
                        <Typography
                          style={{
                            fontSize: 14,
                            marginTop: 7
                          }}
                        >
                          {translate(input.label)}
                          {input.required && (
                            <span>*</span>
                          )}
                        </Typography>
                        <Typography variant="caption" color="error">{input.helperText}</Typography>
                      </Box>
                    </Zoom>
                  )
                }

            }
          })}
        </Paper>
      </Box>
      {!resize.virtualKeyboardVisible && (
        <Box>
          <Box style={{height: 60}}/>
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
                  color="primary"
                  style={{
                    borderRadius: 100,
                    width: "90%"
                  }}
                  onClick={store}
                >
                  {loading
                    ?
                    progress > 0 && progress < 100
                      ? <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            position: 'absolute',
                            top: 13,
                            fontSize: 10,
                            marginRight: 'auto',
                            marginLeft: 'auto',
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                          }}
                        >
                          {progress}
                        </Typography>
                        <CircularProgress
                          size={30}
                          color="inherit"
                          variant="determinate"
                          value={progress}
                        />
                      </Box>
                      : <CircularProgress size={24} color={"inherit"}/>
                    : translate("ذخیره")
                  }
                </Button>
              </Slide>
            </Toolbar>
          </AppBar>
        </Box>
      )}
      <Snackbar
        open={error}
        autoHideDuration={4000}
        onClose={() => {
          setError(false);
        }}
        style={{bottom: 70}}
      >
        <Alert severity={"error"} variant={"filled"}>
          {translate('گزینه های ستاره دار الزامی میباشند')}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default connect(mapStateToProps)(EditSlide);