import React, {useEffect, useState} from "react";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {socialMedias} from "../../../../../redux/reducers/data";
import Box from "@material-ui/core/Box";
import {Button, CircularProgress, Switch, Toolbar, Zoom} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../translate";
import Pluralize from "pluralize";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Select from "../../explore/filterComponents/Select";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import camelToSnake from "../../../../../camelToSnake";
import capitalizeFirstLetter from "../../../../../extra-components/capitalizeFirstLetter";
import Axios from "axios";
import Store from "../../../../../redux/store";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Map from "../../../../../extra-components/locationMap";
import Upload from "../../../../../extra-components/dropZoneImageUploader";
import {green, red} from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import VideoUpload from "../../../../../extra-components/videoUploader";
import $ from 'jquery';

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    relationProps: state.relationProps,
    provinces: state.provinces,
    categories: state.categories,
    types: state.types,
    EditingCollection: state.EditingCollection,
  }
}

const AddNew = (props) => {
  let {name} = useParams();
  let {state} = useLocation();
  let {goBack} = useHistory();
  const {parentModelName, parentModelId, caption} = state;
  let initialInputs = [];
  switch (name) {
    case 'socialMedias':
      initialInputs = [
        {
          type: 'select',
          name: 'title',
          id: 'socialMediaTitle',
          title: 'عنوان شبکه اجتماعی',
          icon: 'icons/special-flat/social-media.svg',
          label: '',
          value: '',
          variant: 'grid',
          options: socialMedias,
          withSearch: true,
          withIcon: true,
          withAllOption: false,
          withOthersOption: false,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'url',
          id: 'url',
          title: 'لینک',
          label: 'لینک',
          value: '',
          caption: 'به صورت کامل و با http(s):// در ابتدای لینک وارد کنید',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        }
      ]
      break;
    case 'phones':
      initialInputs = [
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
        {
          type: 'text',
          inputType: 'number',
          name: 'phoneNumber',
          id: 'phoneNumber',
          title: 'شماره تلفن',
          label: 'شماره تلفن',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        }

      ]
      break;
    case 'metas':
      initialInputs = [
        {
          type: 'text',
          inputType: 'text',
          name: 'key',
          id: 'key',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'value',
          id: 'value',
          title: 'مقدار',
          label: 'مقدار',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        }
      ]
      break;
    case 'addresses':
      initialInputs = [
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
        {
          type: 'text',
          inputType: 'number',
          name: 'postalCode',
          id: 'postalCode',
          title: 'کد پستی',
          label: 'کد پستی',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          // required: true,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'address',
          id: 'address',
          title: 'آدرس',
          label: 'آدرس',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
        {
          type: 'location',
          name: 'location',
          id: 'location',
          title: 'مختصات جغرافیایی',
          label: 'مختصات جغرافیایی',
          value: '',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          // required: true,
        },
      ]
      break;
    case 'products':
    case 'service':
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
          required: true,
        },
        {
          name: 'mimeType',
          value: 'image',
        },
        {
          type: 'select',
          name: 'categoryId',
          id: 'categoryId',
          title: 'دسته بندی',
          label: '',
          value: '',
          variant: 'linearNested',
          btnVariant: 'outlined',
          options: props.categories.filter(x => x.class === 'prd'),
          withSearch: true,
          withIcon: false,
          withAllOption: false,
          withOthersOption: true,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 10,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 20,
        },
      ]
      break;
    case 'participants':
      let parentCategory = props.categories.find(x => x.value === props.EditingCollection.category_id);
      let categories = parentCategory ? parentCategory.children : [];
      let variant = 'linear';
      if (props.EditingCollection.category_id === 0) {
        categories = this.props.categories.filter(x => x.class === 'prd');
        variant = 'linearNested';
      }
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
          required: true,
        },
        {
          name: 'mimeType',
          value: 'image',
        },
        {
          type: 'select',
          name: 'categoryId',
          id: 'categoryId',
          title: 'دسته بندی',
          label: '',
          value: '',
          variant: variant,
          btnVariant: 'outlined',
          options: categories,
          withSearch: true,
          withIcon: false,
          withAllOption: false,
          withOthersOption: true,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 10,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 20,
        },
      ]
      break;
    case 'news':
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
          required: true,
        },
        {
          name: 'mimeType',
          value: 'image',
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 10,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 20,
        },
      ]
      break;
    case 'wantads':
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
          required: true,
        },
        {
          name: 'mimeType',
          value: 'image',
        },
        {
          type: 'select',
          name: 'type',
          id: 'type',
          title: 'طبقه بندی',
          label: '',
          value: '',
          variant: 'linear',
          btnVariant: 'outlined',
          options: props.types.filter(x => x.class === 'wtd'),
          withSearch: false,
          withIcon: false,
          withAllOption: false,
          withOthersOption: false,
          required: true,
        },
        {
          type: 'select',
          name: 'categoryId',
          id: 'categoryId',
          title: 'دسته بندی',
          label: '',
          value: '',
          variant: 'linearNested',
          btnVariant: 'outlined',
          options: props.categories.filter(x => x.class === 'wtd'),
          withSearch: true,
          withIcon: false,
          withAllOption: false,
          withOthersOption: true,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 10,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 20,
        },
      ]
      break;
    case 'boards':
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          value: false,
          title: 'تصویر پرسنلی',
          helperText: '',
          required: true,
        },
        {
          name: 'mimeType',
          value: 'image',
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'name',
          id: 'name',
          title: 'نام و نام خانوادگی',
          label: 'نام و نام خانوادگی',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'role',
          id: 'role',
          title: 'سمت شغلی',
          label: 'سمت شغلی',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          // required: true,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          // required: true,
        },
      ]
      break;
    case 'slides':
      initialInputs = [
        {
          type: 'mimeType',
          name: 'mimeType',
          value: 'image',
        },
        {
          type: 'file',
          name: 'file',
          title: 'فایل',
          label: 'تصویر',
          value: null,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'link',
          id: 'link',
          title: 'لینک',
          label: 'لینک',
          value: '',
          caption: 'به صورت کامل و با http(s):// در ابتدای لینک وارد کنید',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          // required: true,
        },
      ]
      break;
    case 'agents':
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
          required: true,
        },
        {
          name: 'mimeType',
          value: 'image',
        },
        {
          type: 'select',
          name: 'ProvinceId',
          id: 'ProvinceId',
          title: 'استان',
          label: '',
          value: '',
          variant: 'linear',
          btnVariant: 'outlined',
          options: props.provinces,
          withSearch: true,
          withIcon: false,
          withAllOption: false,
          withOthersOption: false,
          required: true,
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 10,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: '',
          caption: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
          withLength: true,
          requiredLength: 20,
        },

      ]
      break;
    case 'comments':
      initialInputs = [
        {
          type: 'text',
          inputType: 'textarea',
          rows: 6,
          name: 'text',
          id: 'text',
          title: 'متن',
          label: 'متن',
          value: '',
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
        {
          type: 'select',
          name: 'published',
          id: 'published',
          title: 'وضعیت انتشار',
          label: 'منتشر شده',
          value: 1,
          variant: 'linear',
          btnVariant: 'outlined',
          options: [{label: 'منتشر شده', value: 1}, {label: 'منتشر نشده', value: 0}],
          withSearch: false,
          withIcon: false,
          withAllOption: false,
          withOthersOption: false,
          required: true,
        }
      ]
      break;
  }
  let [inputs, setInputs] = useState(initialInputs);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  let [progress, setProgress] = useState(0);
  let [dzObject, setDzObject] = useState(null);
  let [resize, setResize] = useState({
    scrollElementHeight: 'calc(100vh - 60px)',
    initialWindowHeight: window.innerHeight,
    textFieldFocused: false,
    virtualKeyboardVisible: false,
    focusedTextFieldId: null,
    focusedTextFieldOffset: null,
  });
  document.body.onresize = () => {
    if (resize.initialWindowHeight - window.innerHeight > 150) {//virtual keyboard coming up
      setResize({
        ...resize,
        virtualKeyboardVisible: true,
        scrollElementHeight: window.innerHeight,
      })
    } else {
      $('input').blur();
      setResize({
        ...resize,
        virtualKeyboardVisible: false,
        scrollElementHeight: 'calc(100vh - 60px)',
      })
    }
  }
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
    let error = false;
    setError(false);
    inputs.map((input, key) => {
      let newInputs = [...inputs];
      newInputs[key].error = false;
      newInputs[key].helperText = '';
      setInputs(newInputs);
      if (input.withLength && input.value.length < input.requiredLength) {
        error = true;
        setError(true);
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
        error = true;
        setError(true);
        let newInputs = [...inputs];
        newInputs[key].error = true;
        newInputs[key].helperText = input.title + ' ' + translate('الزامی است');
        setInputs(newInputs);
      }
    })
    if (!error) {
      setLoading(true);
      let mimeType = inputs.find(x => x.name === 'mimeType');
      if (mimeType && mimeType.value === 'image') {
        dzObject && dzObject.processQueue();
      } else {
        let data = new FormData();
        data.append('userToken', props.userToken);
        data.append('parentModelName', parentModelName);
        data.append('parentId', parentModelId);
        data.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(name)));
        data.append('relation', name);
        inputs.map((input) => {
          data.append(camelToSnake(input.name), input.value);
        })
        const url = props.baseUrl + '/api/profile/storeRelation';
        Axios.post(url, data, {
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
          Store.dispatch({
            type: 'propsUpdated',
            payload: true
          });
          goBack();
        }).catch(e => {
          setLoading(false);
          console.log(e);
        })
      }
    }

  }

  return (
    <Box
      id="add-new-relation-scroll-element"
      style={{
        position: 'fixed',
        height: resize.scrollElementHeight,
        width: '100%',
        top: 0,
        right: 0,
        backgroundColor: "#f0f8ff",
        zIndex: 100000,
        overflowY: "auto",
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
                    {translate('ثبت') +
                    ' ' +
                    translate(Pluralize.singular(name)) +
                    ' ' +
                    translate('جدید')}
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
      <Box style={{padding: 10,}}>
        <Paper
          elevation={3}
          style={{
            padding: 10,
            paddingTop: 30,
            borderRadius: 10
          }}
        >
          {inputs.map((input, key) => {
            delay = delay + 50;
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
              case 'location':
                return (
                  <Slide key={key} in={true} direction="down" style={{transitionDelay: delay}}>
                    <Box>
                      <Map
                        lat={35.69299}
                        lng={51.38525}
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
                        defaultImage={props.baseUrl + '/icons/special-flat/add.svg'}
                        defaultImageSize="60px"
                        accept="image/*"
                        url={props.baseUrl + '/api/profile/storeRelation'}
                        fileAdded={(file, value, obj) => {
                          setDzObject(obj)
                          handleChange(key, value);
                        }}
                        onSending={(file, xhr, formData) => {
                          formData.append('userToken', props.userToken);
                          formData.append('parentModelName', parentModelName);
                          formData.append('parentId', parentModelId);
                          formData.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(name)));
                          formData.append('relation', name);
                          inputs.filter(x => !['mimeType', 'fileAdded'].includes(x.name)).map((input) => {
                            formData.append(camelToSnake(input.name), input.value);
                          })
                        }}
                        onSuccess={() => {
                          setLoading(false);
                          Store.dispatch({
                            type: 'propsUpdated',
                            payload: true
                          });
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
              case 'mimeType' :
                return (
                  <Slide key={key} in={true} direction="down" style={{transitionDelay: 60}}>
                    <Box>
                      <Typography style={{textAlign: 'center'}}>{translate(input.title)}</Typography>
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => {
                          handleChange(key, input.value === 'image' ? 'video' : 'image')
                          let fileInput = inputs.find(x => x.name === 'file');
                          let fileInputIndex = inputs.findIndex(x => x.name === 'file');
                          let fileInputLabel = input.value === 'image' ? 'تصویر' : 'ویدیو';
                          handleChange(fileInputIndex, fileInput.value, fileInputLabel);
                        }}
                      >
                        <Typography>{translate("تصویر")}</Typography>
                        <span style={{margin: "0 15px"}}>
                    <Switch checked={input.value === 'video'}/>
                  </span>
                        <Typography>{translate("ویدیو")}</Typography>
                        <Divider style={{margin: "10px 0"}}/>
                      </Box>
                      <Box style={{height: 10}}/>


                    </Box>
                  </Slide>
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
                          defaultImage={props.baseUrl + '/icons/special-flat/add.svg'}
                          defaultImageSize="60px"
                          accept="image/*"
                          url={props.baseUrl + '/api/profile/storeRelation'}
                          fileAdded={(file, value, obj) => {
                            setDzObject(obj)
                            handleChange(key, value);
                          }}
                          onSending={(file, xhr, formData) => {
                            formData.append('userToken', props.userToken);
                            formData.append('parentModelName', parentModelName);
                            formData.append('parentId', parentModelId);
                            formData.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(name)));
                            formData.append('relation', name);
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

export default connect(mapStateToProps)(AddNew);