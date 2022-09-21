import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {AppBar, Box, Button, CircularProgress, Fab, Slide, Switch, Toolbar, Typography, Zoom} from "@material-ui/core";
import translate from "../../../../../translate";
import {ArrowBack} from "@material-ui/icons";
import {useHistory} from "react-router";
import Select from "../../explore/filterComponents/Select";
import Axios from "axios";
import Store from "../../../../../redux/store";
import TextField from "@material-ui/core/TextField";
import {green, red} from "@material-ui/core/colors";
import Upload from "../../../../../extra-components/dropZoneImageUploader";
import camelToSnake from "../../../../../camelToSnake";
import VideoUpload from "../../../../../extra-components/videoUploader";
import Divider from "@material-ui/core/Divider";
import $ from 'jquery';

function mapStateToProps(state) {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    classes: state.classes.filter(x => x.value !== 'wtd'),
    types: state.types,
    filterItems: state.filterItems,
    categories: state.categories,
    countries: state.countries,
    provinces: state.provinces,
    cities: state.cities,
    idps: state.idps,
    ftzs: state.ftzs,
  }
}

function BulkMessages(props) {
  let {goBack} = useHistory();
  let [loading, setLoading] = useState(false);
  let [progress, setProgress] = useState(0);
  let [dzObject, setDzObject] = useState(null);
  let [textFieldFocused, setTextFieldFocused] = useState(false);
  let [focusedTextFieldId, setFocusedTextFieldId] = useState('');
  let [inputs, setInputs] = useState({
    class: {
      type: 'select',
      name: 'class',
      id: 'class',
      title: 'نوع مجموعه',
      label: 'همه مجموعه ها',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: props.classes,
      withSearch: false,
      withIcon: false,
      withAllOption: true,
      withOthersOption: false,
      display: true,
    },
    type: {
      type: 'select',
      name: 'type',
      id: 'type',
      title: 'طبقه بندی',
      label: 'همه طبقه بندی ها',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: [],
      withSearch: false,
      withIcon: false,
      withAllOption: true,
      withOthersOption: false,
      display: true,
    },
    categoryId: {
      type: 'select',
      name: 'categoryId',
      id: 'categoryId',
      title: 'دسته بندی',
      label: 'همه دسته بندی ها',
      value: '',
      variant: 'linearNested',
      btnVariant: 'outlined',
      options: [],
      withSearch: true,
      withIcon: false,
      withAllOption: true,
      withOthersOption: true,
      display: true,
    },
    countryId: {
      type: 'select',
      name: 'countryId',
      id: 'countryId',
      title: 'کشور',
      label: 'همه کشور ها',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: props.countries,
      withSearch: true,
      withIcon: false,
      withAllOption: true,
      withOthersOption: false,
      display: true,
    },
    provinceId: {
      type: 'select',
      name: 'provinceId',
      id: 'provinceId',
      title: 'استان',
      label: 'همه استان ها',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: [],
      withSearch: true,
      withIcon: false,
      withAllOption: true,
      withOthersOption: false,
      display: true,
    },
    cityId: {
      type: 'select',
      name: 'cityId',
      id: 'cityId',
      title: 'شهر',
      label: 'همه شهر ها',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: [],
      withSearch: true,
      withIcon: false,
      withAllOption: true,
      withOthersOption: false,
      display: false,
    },
    idpId: {
      type: 'select',
      name: 'idpId',
      id: 'idpId',
      title: 'شهرک صنعتی',
      label: 'همه شهرک های صنعتی',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: [],
      withSearch: true,
      withIcon: false,
      withAllOption: true,
      withOthersOption: false,
      display: false,
    },
    ftzId: {
      type: 'select',
      name: 'ftzId',
      id: 'ftzId',
      title: 'منطقه آزاد تجاری-صنعتی',
      label: 'همه مناطق آزاد تجاری-صنعتی',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: [],
      withSearch: true,
      withIcon: false,
      withAllOption: true,
      withOthersOption: false,
      display: false,
    },
    isInIdp: {
      type: 'switch',
      name: 'isInIdp',
      id: 'isInIdp',
      title: 'مستقر در شهرک صنعتی',
      label: 'مستقر در شهرک صنعتی',
      value: false,
      display: false,
    },
    isInFtz: {
      type: 'switch',
      name: 'isInFtz',
      id: 'isInFtz',
      title: 'مستقر در منطقه آزاد تجاری-صنعتی',
      label: 'مستقر در منطقه آزاد تجاری-صنعتی',
      value: false,
      display: false,
    },
    divider: {
      type: 'divider'
    },
    messageType: {
      type: 'select',
      name: 'messageType',
      id: 'messageType',
      title: 'نوع پیام',
      label: '',
      value: '',
      variant: 'linear',
      btnVariant: 'outlined',
      options: [
        {value: 'text', label: 'متن'},
        {value: 'image', label: 'تصویر'},
        {value: 'video', label: 'ویدیو'},
      ],
      withSearch: false,
      withIcon: false,
      withAllOption: false,
      withOthersOption: false,
      required: true,
      display: true,
    },
    message: {
      type: 'text',
      inputType: 'textarea',
      rows: 4,
      name: 'message',
      id: 'message',
      title: 'متن پیام',
      label: 'متن پیام',
      value: '',
      caption: '',
      variant: 'outlined',
      error: false,
      helperText: '',
      scrollOffsetOnFocus: -10,
      required: true,
      display: false,
    },
    image: {
      type: 'image',
      name: 'file',
      id: 'image',
      title: 'تصویر',
      label: 'تصویر',
      value: '',
      caption: '',
      error: false,
      helperText: '',
      scrollOffsetOnFocus: -10,
      required: true,
      display: false,
    },
    video: {
      type: 'video',
      name: 'file',
      id: 'video',
      title: 'ویدیو',
      label: 'ویدیو',
      value: '',
      caption: '',
      error: false,
      helperText: '',
      scrollOffsetOnFocus: -10,
      required: true,
      display: false,
    },
  });
  useEffect(() => {
    handleChange('countryId', 80, 'iran')
    handleChange('messageType', 'text', 'متن')
    if (!props.idps) {
      getIdps();
    }
    if (!props.ftzs) {
      getFtzs();
    }
  }, [])

  useEffect(() => {
    let scrollElement = $("#bulk-messages-scroll-element");
    if (textFieldFocused) {
      let anchorElement = $(`#${focusedTextFieldId}`);
      scrollElement.scrollTo(anchorElement, {offset: -10});
      setTextFieldFocused(false);
    }
  }, [textFieldFocused])

  const getIdps = () => {
    const url = props.baseUrl + "/api/idps";
    Axios.post(url)
    .then((e) => {
      Store.dispatch({
        type: "idps",
        payload: e.data
      });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  const getFtzs = () => {
    const url = props.baseUrl + "/api/ftzs";
    Axios.post(url)
    .then((e) => {
      Store.dispatch({
        type: "ftzs",
        payload: e.data
      });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  const handleChange = (name, value, label) => {
    let changedInput = inputs[name];
    let prevValue = changedInput.value;
    changedInput.value = value;
    if (label) {
      changedInput.label = label;
    }
    let newInputs = inputs;
    newInputs[name] = changedInput;
    if (changedInput.value !== prevValue) {
      switch (name) {
        case 'class':
          newInputs.type.options = props.types.filter(x => x.class === value);
          newInputs.type.value = '';
          newInputs.type.label = 'همه طبقه بندی ها';
          newInputs.categoryId.options = props.categories.filter(x => x.class === value);
          newInputs.categoryId.value = '';
          newInputs.categoryId.label = 'همه دسته بندی ها';
          break;
        case 'countryId':
          newInputs.provinceId.options = props.provinces.filter(x => x.country_id === parseInt(value));
          newInputs.provinceId.value = '';
          newInputs.provinceId.label = 'همه استان ها';
          handleChange('provinceId', '', 'همه استان ها')
          break;
        case 'provinceId':
          newInputs.cityId.options = props.cities.filter(x => x.province_id === parseInt(value));
          newInputs.cityId.value = '';
          newInputs.cityId.label = 'همه شهر ها';
          newInputs.idpId.options = props.idps.filter(x => x.province_id === parseInt(value));
          newInputs.idpId.value = '';
          newInputs.idpId.label = 'همه شهرک های صنعتی';
          newInputs.ftzId.options = props.ftzs.filter(x => x.province_id === parseInt(value));
          newInputs.ftzId.value = '';
          newInputs.ftzId.label = 'همه مناطق آزاد تجاری-صنعتی';
          newInputs.isInIdp.display = props.idps && newInputs.idpId.options.length > 0;
          newInputs.isInIdp.value = false;
          newInputs.isInFtz.display = props.ftzs && newInputs.ftzId.options.length > 0;
          newInputs.isInFtz.value = false;
          newInputs.cityId.display = true;
          newInputs.idpId.display = false;
          break;
        case 'isInIdp':
          newInputs.cityId.display = !newInputs.isInIdp.value && !newInputs.isInFtz.value;
          newInputs.idpId.display = newInputs.isInIdp.value && !newInputs.isInFtz.value;
          newInputs.isInFtz.display = newInputs.ftzId.options.length > 0 && !newInputs.isInIdp.value;
          break;
        case 'isInFtz':
          newInputs.cityId.display = !newInputs.isInFtz.value && !newInputs.isInIdp.value;
          newInputs.ftzId.display = newInputs.isInFtz.value && !newInputs.isInIdp.value;
          newInputs.isInIdp.display = newInputs.idpId.options.length > 0 && !newInputs.isInFtz.value;
          break;
        case 'messageType':
          newInputs.message.display = changedInput.value === 'text'
          newInputs.image.display = changedInput.value === 'image'
          newInputs.video.display = changedInput.value === 'video'
          break;
      }
    }
    setInputs({...newInputs});
  }

  const handleFocus = (id) => {
    setTextFieldFocused(true)
    setFocusedTextFieldId(id)
  }

  const inputsArray = [];
  for (let i in inputs) {
    if (inputs.hasOwnProperty(i)) {
      inputsArray.push(inputs[i]);
    }
  }

  const store = () => {
    let error = false;
    for (let i in inputs) {
      if (inputs.hasOwnProperty(i)) {
        let input = inputs[i];
        if (input.display) {
          let newInputs = inputs;
          newInputs[i].error = false;
          newInputs[i].helperText = '';
          setInputs({...newInputs});
          if (input.withLength && input.value.length < input.requiredLength) {
            error = true;
            let newInputs = inputs;
            newInputs[i].error = true;
            newInputs[i].helperText = translate('حداقل') +
              ' ' +
              input.requiredLength +
              ' ' +
              translate('حرف باید وارد کنید');
            setInputs({...newInputs});
          }
          if (input.required && !input.value) {
            error = true;
            let newInputs = inputs;
            newInputs[i].error = true;
            newInputs[i].helperText = translate(input.title) + ' ' + translate('الزامی است');
            setInputs({...newInputs});
          }
        }
      }
    }
    if (!error) {
      setLoading(true);
      if (inputs.messageType.value === 'image') {
        dzObject && dzObject.processQueue();
      } else {
        let formData = new FormData();
        formData.append('userToken', props.userToken);
        let jsonInputs = {};
        for (let i in inputs) {
          if (inputs.hasOwnProperty(i)) {
            let input = inputs[i];
            if (!['file'].includes(input.name)) {
              if (input.display) {
                jsonInputs[camelToSnake(input.name)] = input.value;
              }
            } else {
              formData.append(camelToSnake(input.name), input.value)
            }
          }
        }
        formData.append('inputs', JSON.stringify(jsonInputs));
        const url = props.baseUrl + '/api/profile/sendBulkMessage';
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
        }).then(() => {
          setLoading(false);
          alert(translate('پیام با موفقیت ارسال شد'));
          goBack();
        }).catch(e => {
          setLoading(false);
          console.log(e);
        })
      }
    }

  }

  return (
    <Slide in={true} direction="left">
      <Box
        id="bulk-messages-scroll-element"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100vh",
          zIndex: 100000,
          backgroundColor: "#ffffff",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <AppBar color="inherit" position="fixed">
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>{translate('ارسال پیام انبوه')}</Typography>
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
        <Box style={{padding: 10}}>
          {inputsArray.map((input, key) => {
            let delay = key + 50;
            switch (input.type) {
              case 'select':
                if (input.options && input.options.length > 0 && input.display) {
                  return (
                    <Slide key={key} in={true} direction="left" style={{transitionDelay: delay}}>
                      <Box
                        style={{
                          marginBottom: 20,
                        }}
                      >
                        <Select
                          id={input.id}
                          key={input.label}
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
                          label={translate(input.label)}
                          icon={input.icon}
                          error={input.error}
                          helperText={translate(input.helperText)}
                          response={(name, value, label) => {
                            handleChange(name, value, label);
                          }}
                        />
                      </Box>
                    </Slide>
                  )
                }
                break;
              case 'switch' :
                if (input.display) {
                  return (
                    <Slide key={key} in={true} direction="left" style={{transitionDelay: delay}}>
                      <Box>
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onClick={() => {
                            handleChange(input.name, !input.value)
                          }}
                        >
                          <Box style={{paddingLeft: 15}}>
                            <Switch checked={input.value}/>
                          </Box>
                          <Typography>{translate(input.label)}</Typography>
                        </Box>
                        <Box style={{height: 10}}/>
                      </Box>
                    </Slide>
                  )
                }
                break;
              case 'text':
                if (input.display) {
                  return (
                    <Slide key={key} in={true} direction="left" style={{transitionDelay: delay}}>
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
                            handleChange(input.name, e.target.value)
                          }}
                          onFocus={() => {
                            handleFocus(input.id)
                          }}
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
                                color: input.value.length < input.requiredLength
                                  ? red.A200
                                  : green.A400
                              }}
                            >{input.value.length}</span>
                          </Typography>
                        )}
                      </Box>
                    </Slide>
                  )
                }
                break;
              case 'image' :
                if (input.display) {
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
                          defaultImage={props.baseUrl + '/icons/special-flat/add.svg'}
                          defaultImageSize="60px"
                          accept="image/*"
                          url={props.baseUrl + '/api/profile/sendBulkMessage'}
                          fileAdded={(file, value, obj) => {
                            setDzObject(obj)
                            handleChange('image', value);
                          }}
                          onSending={(file, xhr, formData) => {
                            formData.append('userToken', props.userToken);
                            for (let i in inputs) {
                              if (inputs.hasOwnProperty(i)) {
                                if (!['file'].includes(inputs[i].name)) {
                                  if (inputs[i].display) {
                                    formData.append(camelToSnake(inputs[i].name), inputs[i].value);
                                  }
                                }
                              }
                            }
                          }}
                          onSuccess={() => {
                            setLoading(false);
                            alert(translate('پیام با موفقیت ارسال شد'));
                            goBack();
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
                }
                break;
              case 'video' :
                if (input.display) {
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
                            handleChange(input.id, file);
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
                }
                break;
              case 'divider' :
                return (
                  <Divider style={{margin: '30px 0'}}/>
                )
            }
          })}
        </Box>
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
                  : translate("ارسال")
                }
              </Button>
            </Slide>
          </Toolbar>
        </AppBar>
      </Box>
    </Slide>
  )
}

export default connect(mapStateToProps)(BulkMessages);