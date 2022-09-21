import {
  Classes,
  ClassesOfAddingNewItem,
  DataStoreOfAddNewItem,
  FilterItems,
  HomeBlocks,
  Relations,
  socialMedias,
  Types
} from "./data";

const lang = localStorage.getItem('lang') || '';
const baseUrl = window.location.origin;
// const baseUrl = 'https://samtbook.ir';
const locale = lang ? require('../lang/' + lang) : {};
const userToken = localStorage.getItem('userToken') || false;
const user = false;
const countries = require('../data/countries');
const provinces = require('../data/provinces');
const cities = require('../data/cities');
const categories = require('../data/categories');

const PreloadedState = {
  lang,
  locale,
  userToken,
  user,
  countries,
  provinces,
  cities,
  categories,
  baseUrl,
  navTabValue: 2,
  showBottomNavTabs: true,
  virtualKeyboardVisible: false,
  filterItems: FilterItems,
  classes: Classes,
  types: Types,
  homeBlocks: HomeBlocks,
  classesOfAddingNewItem: ClassesOfAddingNewItem,
  dataStoreOfAddNewItem: DataStoreOfAddNewItem,
  relations: Relations,
  socialMedias,
};

const reducer = (state = PreloadedState, action) => {
  return Object.assign({}, state, {
    [action.type]: action.payload,
  });
};
export default reducer;
