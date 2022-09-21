import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Route, Switch as RouterSwitch, useHistory, useLocation, useParams, useRouteMatch} from "react-router-dom";
import {socialMedias} from "../../../../../redux/reducers/data";
import translate from "../../../../../translate";
import capitalizeFirstLetter from "../../../../../extra-components/capitalizeFirstLetter";
import Pluralize from "pluralize";
import camelToSnake from "../../../../../camelToSnake";
import Axios from "axios";
import Store from "../../../../../redux/store";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import {Button, CircularProgress, Tab, Tabs, Toolbar, Zoom} from "@material-ui/core";
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
import Grid from "@material-ui/core/Grid";
import RelationButton from "./button";
import List from "./list";
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
    editingRelation: state.editingRelation,
  }
}

const EditRelation = (props) => {
  let {name} = useParams();
  let {state} = useLocation();
  let {goBack} = useHistory();
  let {path} = useRouteMatch();
  const {editingItem, caption} = state;
  let childCategories = [];
  props.categories.map((category) => {
    childCategories = childCategories.concat(category.children);
  });
  const allCategories = require('../../../../../redux/data/allCategories');
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
          label: socialMedias.find(x => x.value === editingItem.title).label,
          value: editingItem.title,
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
          value: editingItem.url,
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
          value: editingItem.title,
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
          value: editingItem.phone_number,
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
          value: editingItem.title,
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
          value: editingItem.postal_code,
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'address',
          id: 'address',
          title: 'آدرس',
          label: 'آدرس',
          value: editingItem.address,
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
          value: editingItem.location,
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
        },
      ]
      break;
    case 'products':
    case 'service':
      let category = childCategories.find(x => x.id === editingItem.category_id);
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          defaultImage: editingItem.icon,
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
        },
        {
          name: 'mimeType',
          value: '',
        },
        {
          type: 'select',
          name: 'categoryId',
          id: 'categoryId',
          title: 'دسته بندی',
          label: category && category.label,
          value: editingItem.category_id,
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
          value: editingItem.title,
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
          value: editingItem.dsc,
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
      let parentCategory = props.categories.find(x => x.value ===
        allCategories.find(x => x.value === editingItem.category_id).parent_id);
      let categories = parentCategory ? parentCategory.children : [];
      let variant = 'linear';
      if (props.EditingCollection && props.EditingCollection.category_id === 0) {
        categories = this.props.categories.filter(x => x.class === 'prd');
        variant = 'linearNested';
      }
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          defaultImage: editingItem.icon,
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
        },
        {
          name: 'mimeType',
          value: '',
        },
        {
          type: 'select',
          name: 'categoryId',
          id: 'categoryId',
          title: 'دسته بندی',
          label: allCategories.find(x => x.value === editingItem.category_id).label,
          value: editingItem.category_id,
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
          value: editingItem.title,
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
          value: editingItem.dsc,
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
          defaultImage: editingItem.icon,
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
        },
        {
          name: 'mimeType',
          value: '',
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'title',
          id: 'title',
          title: 'عنوان',
          label: 'عنوان',
          value: editingItem.title,
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
          value: editingItem.dsc,
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
      let type = props.types.find(x => x.value === editingItem.type);
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          defaultImage: editingItem.icon,
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
        },
        {
          name: 'mimeType',
          value: '',
        },
        {
          type: 'select',
          name: 'type',
          id: 'type',
          title: 'طبقه بندی',
          label: type ? type.label : '',
          value: editingItem.type,
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
          label: allCategories.find(x => x.value === editingItem.category_id).label,
          value: editingItem.category_id,
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
          value: editingItem.title,
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
          value: editingItem.dsc,
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
          defaultImage: editingItem.icon,
          value: false,
          title: 'تصویر پرسنلی',
          helperText: '',
        },
        {
          name: 'mimeType',
          value: '',
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'name',
          id: 'name',
          title: 'نام و نام خانوادگی',
          label: 'نام و نام خانوادگی',
          value: editingItem.name,
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
          value: editingItem.role,
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: editingItem.dsc,
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
        },
      ]
      break;
    case 'slides':
      initialInputs = [
        {
          type: 'dzFileAdded',
          name: 'dzFileAdded',
          value: false,
        },
        {
          type: 'mimeType',
          name: 'mimeType',
          value: editingItem.mime_type,
        },
        {
          type: 'file',
          name: 'file',
          preview: editingItem.icon,
          mimeType: editingItem.mime_type,
          title: editingItem.mime_type === 'image' ? 'تصویر' : 'ویدیو',
          label: editingItem.mime_type === 'image' ? 'تصویر' : 'ویدیو',
          value: '',
        },
        {
          type: 'text',
          inputType: 'text',
          name: 'link',
          id: 'link',
          title: 'لینک',
          label: 'لینک',
          value: editingItem.link,
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
          value: editingItem.sort,
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
      ]
      break;
    case 'agents':
      initialInputs = [
        {
          type: 'image',
          name: 'fileAdded',
          defaultImage: editingItem.icon,
          value: false,
          title: 'تصویر اصلی',
          helperText: '',
        },
        {
          name: 'mimeType',
          value: '',
        },
        {
          type: 'select',
          name: 'ProvinceId',
          id: 'ProvinceId',
          title: 'استان',
          label: props.provinces.find(x => x.value === editingItem.province_id).label,
          value: editingItem.province_id,
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
          value: editingItem.title,
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        },
        {
          type: 'text',
          inputType: 'textarea',
          rows: 4,
          name: 'dsc',
          id: 'dsc',
          title: 'توضیحات',
          label: 'توضیحات',
          value: editingItem.dsc,
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
    case 'metas':
      initialInputs = [
        {
          type: 'text',
          inputType: 'text',
          name: 'key',
          id: 'key',
          title: 'عنوان',
          label: 'عنوان',
          value: editingItem.key,
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
          value: editingItem.value,
          variant: 'outlined',
          error: false,
          helperText: '',
          scrollOffsetOnFocus: -10,
          required: true,
        }
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
          value: editingItem.text,
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
          label: editingItem.published ? 'منتشر شده' : 'منتشر نشده',
          value: editingItem.published,
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
  let [changed, setChanged] = useState(false);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  let [tabValue, setTabValue] = useState(0);
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
  let hasRelation = ['products', 'services', 'news', 'wantads', 'participants', 'agents'].includes(name);
  let relations;
  switch (name) {
    case 'products':
    case 'services':
      relations = [
        {
          name: 'slides',
          label: 'اسلاید ها',
          icon: `${props.baseUrl}/icons/special-flat/slider.svg`
        },
        {
          name: 'metas',
          label: 'اطلاعات تکمیلی',
          icon: `${props.baseUrl}/icons/special-flat/analysis.svg`
        },
        {
          name: 'comments',
          label: 'دیدگاه ها',
          icon: `${props.baseUrl}/icons/special-flat/comments.svg`
        },
      ]
      break;
    case 'news':
      relations = [
        {
          name: 'slides',
          label: 'اسلاید ها',
          icon: `${props.baseUrl}/icons/special-flat/slider.svg`
        },
      ]
      break;
    case 'wantads':
    case 'agents':
      relations = [
        {
          name: 'slides',
          label: 'اسلاید ها',
          icon: `${props.baseUrl}/icons/special-flat/slider.svg`
        },
        {
          name: 'addresses',
          label: 'آدرس ها',
          icon: `${props.baseUrl}/icons/special-flat/location.svg`
        },
        {
          name: 'phones',
          label: 'تلفن ها',
          icon: props.baseUrl + '/icons/special-flat/telephone.svg',
        },
        {
          name: 'socialMedias',
          label: 'شبکه های اجتماعی',
          icon: props.baseUrl + '/icons/special-flat/social-media.svg',
        },
      ]
      break;
    case 'participants':
      relations = [
        {
          name: 'products',
          label: 'محصولات',
          icon: `${props.baseUrl}/icons/special-flat/assembly.svg`
        },
        {
          name: 'news',
          label: 'اخبار',
          icon: `${props.baseUrl}/icons/special-flat/news.svg`
        },
        {
          name: 'slides',
          label: 'اسلاید ها',
          icon: `${props.baseUrl}/icons/special-flat/slider.svg`
        },
        {
          name: 'addresses',
          label: 'آدرس ها',
          icon: `${props.baseUrl}/icons/special-flat/location.svg`
        },
        {
          name: 'phones',
          label: 'تلفن ها',
          icon: props.baseUrl + '/icons/special-flat/telephone.svg',
        },
        {
          name: 'socialMedias',
          label: 'شبکه های اجتماعی',
          icon: props.baseUrl + '/icons/special-flat/social-media.svg',
        },
        {
          name: 'agents',
          label: 'نمایندگی ها',
          icon: props.baseUrl + '/icons/special-flat/marketing.svg',
        },
      ]
      break;
  }
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
        newInputs[key].helperText = translate(input.title) + ' ' + translate('الزامی است');
        setInputs(newInputs);
      }
    })
    if (!error) {
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
    formData.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(name)));
    formData.append('relationModelId', editingItem.id);
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
      id="add-new-relation-scroll-element"
      style={{
        position: 'fixed',
        width: '100%',
        top: 0,
        right: 0,
        zIndex: 100000,
        backgroundColor: "#f0f8ff",
        height: resize.scrollElementHeight,
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
                    {translate(editingItem.title)}
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
      {!resize.virtualKeyboardVisible && hasRelation && (
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={(event, newValue) => {
            setTabValue(newValue)
          }}
          indicatorColor="primary"

        >
          <Tab label={translate("اطلاعات")}/>
          <Tab label={translate("موارد بیشتر")}/>
        </Tabs>
      )}
      <Box style={{padding: 10,}}>
        {tabValue === 0 && (
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
                            formData.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(name)));
                            formData.append('relationModelId', editingItem.id);
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
                              let dzFileAddedKey = inputs.findIndex(x => x.name === 'dzFileAdded');
                              setDzObject(obj)
                              handleChange(dzFileAddedKey, value);
                            }}
                            onSending={(file, xhr, formData) => {
                              formData.append('relationModelName', capitalizeFirstLetter(Pluralize.singular(name)));
                              formData.append('relationModelId', editingItem.id);
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
        )}
        {tabValue === 1 && (
          <Grid container spacing={2} style={{justifyContent: "center"}}>
            {relations.map((relation, key) => {
              return (
                <Grid key={key} item xs={4}>
                  <RelationButton
                    name={relation.name}
                    icon={relation.icon}
                    label={translate(relation.label)}
                    caption={translate(editingItem.title)}
                    parentModelName="Collection"
                    parentModelId={editingItem.id}
                  />
                </Grid>
              )
            })}
            <RouterSwitch>
              <Route path={path + '/relations/:name'} component={List}/>
            </RouterSwitch>
          </Grid>
        )}
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

export default connect(mapStateToProps)(EditRelation);