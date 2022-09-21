import {
   Button,
   CircularProgress,
   InputAdornment,
   Switch,
   TextField,
} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import translate from "../../../../translate";
import Select from "./filterComponents/Select";
import React from "react";
import Store from "../../../../redux/store";
import axios from "axios";
import {connect} from "react-redux";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import {withRouter} from "react-router-dom";

const baseUrl = Store.getState().baseUrl;
const mapStateToProps = (state) => {
   return {
      classes: state.classes,
      types: state.types,
      filterItems: state.filterItems,
      categories: state.categories,
      countries: state.countries,
      provinces: state.provinces,
      cities: state.cities,
      idps: state.idps,
      ftzs: state.ftzs,
   };
};

class FilterModal extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         classes: this.props.classes,
         types: this.props.types,
         categories: this.props.categories ? this.props.categories : [],
         countries: this.props.countries ? this.props.countries : [],
         provinces: this.props.provinces ? this.props.provinces : [],
         cities: this.props.cities ? this.props.cities : [],
         idps: this.props.idps ? this.props.idps : [],
         ftzs: this.props.ftzs ? this.props.ftzs : [],
         filters: this.props.filterItems,
         showFilterModal: true,
      };
   }

   componentDidMount() {
      this.state.categories.length === 0 && this.getCategories();
      !this.props.idps && this.getIDPs();
      !this.props.ftzs && this.getFTZs();
   }

   getCategories = () => {
      const url = baseUrl + "/api/categories";
      axios
         .post(url)
         .then((e) => {
            this.setState({categories: e.data});
            Store.dispatch({
               type: "categories",
               payload: e.data
            });
         })
         .catch((e) => {
            console.log(e);
         });
   };

   getCountries = () => {
      const url = baseUrl + "/api/countries";
      axios
         .post(url)
         .then((e) => {
            this.setState({countries: e.data});
            Store.dispatch({
               type: "countries",
               payload: e.data
            });
         })
         .catch((e) => {
            console.log(e);
         });
   };

   getProvinces = () => {
      const url = baseUrl + "/api/provinces";
      axios
         .post(url)
         .then((e) => {
            this.setState({provinces: e.data});
            Store.dispatch({
               type: "provinces",
               payload: e.data
            });
         })
         .catch((e) => {
            console.log(e);
         });
   };

   getCities = () => {
      const url = baseUrl + "/api/cities";
      axios
         .post(url)
         .then((e) => {
            this.setState({cities: e.data});
            Store.dispatch({
               type: "cities",
               payload: e.data
            });
         })
         .catch((e) => {
            console.log(e);
         });
   };

   getIDPs = () => {
      const url = baseUrl + "/api/idps";
      axios
         .post(url)
         .then((e) => {
            this.setState({idps: e.data});
            Store.dispatch({
               type: "idps",
               payload: e.data
            });
         })
         .catch((e) => {
            console.log(e);
         });
   };

   getFTZs = () => {
      const url = baseUrl + "/api/ftzs";
      axios
         .post(url)
         .then((e) => {
            this.setState({ftzs: e.data});
            Store.dispatch({
               type: "ftzs",
               payload: e.data
            });
         })
         .catch((e) => {
            console.log(e);
         });
   };

   //receives two argument and put them in both redux store and react state
   setFilter = (name, value, label) => {
      let filters = this.state.filters;
      let filter = filters.find((x) => x.name === name);
      filter.value = value;
      filter.label = label;
      this.setState({filters});
   };

   dispatchFilters = () => {
      Store.dispatch({
         type: "filterItems",
         payload: this.state.filters
      });
      Store.dispatch({
         type: "getBlocks",
         payload: true
      });
      this.setState({showFilterModal: false});
      setTimeout(() => {
         this.props.history.push('/explore');
      }, 100);
   };

   showFilterModal = () => {
      this.setState({showFilterModal: true});
   };

   hideFilterModal = () => {
      this.setState({showFilterModal: false});
   };

   render() {
      const classesDefaultIcon = "icons/special-flat/cabinet.svg";
      let searchText = this.state.filters.find((x) => x.name === "searchText");
      let Class = this.state.filters.find((x) => x.name === "class");
      let type = this.state.filters.find((x) => x.name === "type");
      let categoryId = this.state.filters.find((x) => x.name === "categoryId");
      let countryId = this.state.filters.find((x) => x.name === "countryId");
      let provinceId = this.state.filters.find((x) => x.name === "provinceId");
      let cityId = this.state.filters.find((x) => x.name === "cityId");
      let idpId = this.state.filters.find((x) => x.name === "idpId");
      let ftzId = this.state.filters.find((x) => x.name === "ftzId");
      let openDate = this.state.filters.find((x) => x.name === "openDate");
      let closeDate = this.state.filters.find((x) => x.name === "closeDate");
      let currentClass = this.state.classes.find((x) => x.value === Class.value);
      let types = this.state.types.filter((x) => x.class === Class.value);
      let categories = this.state.categories.filter((x) => x.class === Class.value);
      let countries = this.state.countries;
      let provinces = this.state.provinces;
      let cities = this.state.cities.filter((x) => x.province_id === provinceId.value);
      let idps = this.state.idps.filter((x) => x.province_id === provinceId.value);
      let ftzs = this.state.ftzs.filter((x) => x.province_id === provinceId.value);
      let insideOfIDP = this.state.filters.find((x) => x.name === "insideOfIdp");
      let outsideOfIDP = this.state.filters.find((x) => x.name === "outsideOfIdp");
      let insideOfFTZ = this.state.filters.find((x) => x.name === "insideOfFtz");
      let outsideOfFTZ = this.state.filters.find((x) => x.name === "outsideOfFtz");
      return (
         <div>
            <TextField
               type="search"
               variant='outlined'
               value={searchText.value}
               placeholder={translate("تایپ کنید و سپس دکمه نمایش نتایج را بزنید")}
               onChange={(e) => {
                  this.setFilter(searchText.name, e.target.value, searchText.label);
               }}
               fullWidth
               InputProps={{
                  startAdornment: (
                     <InputAdornment position="start">
                        <Search/>
                     </InputAdornment>
                  )
               }}
            />
            <Divider style={{margin: "10px 0"}}/>
            <div>
               <Select
                  variant="grid"
                  withSearch={false}
                  withIcon={true}
                  withAllOption={true}
                  options={this.state.classes}
                  title={translate("نوع مجموعه")}
                  name="class"
                  match={this.props.match}
                  label={Class.label}
                  icon={currentClass ? currentClass.icon : classesDefaultIcon}
                  response={(name, value, label) => {
                     this.setFilter(name, value, label);
                     if (this.state.types.filter((x) => x.class === value).length === 0) {
                        this.setFilter("type", null, "");
                     }
                     if (this.state.categories.filter((x) => x.class === value).length === 0) {
                        this.setFilter("categoryId", null, "");
                     }
                     Store.dispatch({
                        type: "classChanged",
                        payload: true
                     });
                  }}
               />
            </div>
            {types.length > 0 && (
               <div>
                  <Select
                     variant="linear"
                     withSearch={false}
                     withIcon={false}
                     withAllOption={true}
                     options={types}
                     title={translate("طبقه بندی")}
                     name="type"
                     match={this.props.match}
                     label={type.label}
                     icon={"icons/special-flat/documents.svg"}
                     response={(name, value, label) => {
                        this.setFilter(name, value, label);
                     }}
                  />
               </div>
            )}
            {this.state.categories.length > 0 && categories.length > 0 && (
               <div>
                  <Select
                     variant="linearNested"
                     withSearch={true}
                     withIcon={false}
                     withAllOption={true}
                     withOthersOption={true}
                     options={categories}
                     title={translate("دسته بندی")}
                     name="categoryId"
                     match={this.props.match}
                     label={categoryId.label}
                     icon={"icons/special-flat/checklist.svg"}
                     response={(name, value, label) => {
                        this.setFilter(name, value, label);
                     }}
                  />
               </div>
            )}
            <div>
               <Select
                  variant="linear"
                  withSearch={true}
                  withIcon={true}
                  icon={"icons/special-flat/globe.svg"}
                  withAllOption={true}
                  options={countries}
                  title={translate("کشور")}
                  name="countryId"
                  match={this.props.match}
                  label={countryId.label}
                  response={(name, value, label) => {
                     this.setFilter(name, value, label);
                     if (provinces.filter((x) => x.country_id === value).length === 0) {
                        this.setFilter("provinceId", null, "");
                     }
                  }}
               />
            </div>
            {countryId.value === 80 && (
               <div>
                  <Select
                     variant="linear"
                     withSearch={true}
                     withIcon={true}
                     icon={"icons/special-flat/map.svg"}
                     withAllOption={true}
                     options={provinces}
                     title={translate("استان")}
                     name="provinceId"
                     match={this.props.match}
                     label={provinceId.label}
                     response={(name, value, label) => {
                        this.setFilter(name, value, label);
                        Store.dispatch({
                           type: "provinceChanged",
                           payload: true
                        });
                     }}
                  />
               </div>
            )}
            {!["idp"].includes(Class.value) && provinceId.value > 0 && cities.length > 0 && (
               <div>
                  <Select
                     variant="linear"
                     withSearch={true}
                     withIcon={true}
                     icon={"icons/special-flat/location.svg"}
                     withAllOption={true}
                     options={cities}
                     title={translate("شهر")}
                     name="cityId"
                     match={this.props.match}
                     label={cityId.label}
                     response={(name, value, label) => {
                        this.setFilter(name, value, label);
                     }}
                  />
               </div>
            )}
            {Class.value === "evt" && (
               <div>
                  <Select
                     variant="date"
                     withIcon={true}
                     withAllOption={true}
                     icon={"icons/classes/yellow-shadow/schedule.svg"}
                     title={translate(openDate.title)}
                     name="openDate"
                     match={this.props.match}
                     dateValue={openDate.value}
                     label={openDate.value ? `${openDate.value.year}/${openDate.value.month}/${openDate.value.day}` : ""}
                     locale="fa"
                     response={(name, value) => {
                        this.setFilter(name, value, openDate.label);
                     }}
                  />
                  <Select
                     variant="date"
                     withIcon={true}
                     withAllOption={true}
                     icon={"icons/classes/yellow-shadow/schedule.svg"}
                     title={translate(closeDate.title)}
                     name="closeDate"
                     match={this.props.match}
                     dateValue={closeDate.value}
                     label={closeDate.value
                        ? `${closeDate.value.year}/${closeDate.value.month}/${closeDate.value.day}`
                        : ""}
                     locale="fa"
                     response={(name, value) => {
                        this.setFilter(name, value, closeDate.label);
                     }}
                  />
               </div>
            )}
            {!["idp", "ftz"].includes(Class.value) && (
               <div
                  onClick={() => {
                     if (outsideOfIDP.value === false) {
                        this.setFilter(insideOfIDP.name, !insideOfIDP.value, insideOfIDP.label);
                        this.setFilter(outsideOfIDP.name, false, outsideOfIDP.label);
                     }
                  }}
               >
                  <Typography style={{margin: "0 15px"}}>
                     <Switch checked={insideOfIDP.value} value={insideOfIDP.value} disabled={outsideOfIDP.value}/>
                     {translate(insideOfIDP.label)}
                  </Typography>
                  <Divider style={{margin: "10px 0"}}/>
               </div>
            )}
            {!["idp", "ftz"].includes(Class.value) && insideOfIDP.value && provinceId.value > 0 && idps.length > 0 && (
               <div>
                  <Select
                     variant="linear"
                     withSearch={true}
                     withIcon={true}
                     icon={"icons/special-flat/factory.svg"}
                     withAllOption={true}
                     options={idps}
                     title={translate(idpId.title)}
                     name={idpId.name}
                     match={this.props.match}
                     label={idpId.label}
                     response={(name, value, label) => {
                        this.setFilter(name, value, label);
                     }}
                  />
               </div>
            )}
            {!["idp", "ftz"].includes(Class.value) && (
               <div
                  onClick={() => {
                     if (insideOfIDP.value === false) {
                        this.setFilter(outsideOfIDP.name, !outsideOfIDP.value, outsideOfIDP.label);
                        this.setFilter(insideOfIDP.name, false, insideOfIDP.label);
                     }
                  }}
               >
                  <Typography style={{margin: "0 15px"}}>
                     <Switch checked={outsideOfIDP.value} value={outsideOfIDP.value} disabled={insideOfIDP.value}/>
                     {translate(outsideOfIDP.label)}
                  </Typography>
                  <Divider style={{margin: "10px 0"}}/>
               </div>
            )}
            {Class.value !== "ftz" && (
               <div
                  onClick={() => {
                     if (outsideOfFTZ.value === false) {
                        this.setFilter(insideOfFTZ.name, !insideOfFTZ.value, insideOfFTZ.label);
                        this.setFilter(outsideOfFTZ.name, false, outsideOfFTZ.label);
                     }
                  }}
               >
                  <Typography style={{margin: "0 15px"}}>
                     <Switch checked={insideOfFTZ.value} value={insideOfFTZ.value} disabled={outsideOfFTZ.value}/>
                     {translate(insideOfFTZ.label)}
                  </Typography>
                  <Divider style={{margin: "10px 0"}}/>
               </div>
            )}
            {Class.value !== "ftz" && insideOfFTZ.value && provinceId.value > 0 && ftzs.length > 0 && (
               <div>
                  <Select
                     variant="linear"
                     withSearch={true}
                     withIcon={true}
                     icon={"icons/special-flat/airplane.svg"}
                     withAllOption={true}
                     options={ftzs}
                     title={translate(ftzId.title)}
                     name={ftzId.name}
                     match={this.props.match}
                     label={ftzId.label}
                     response={(name, value, label) => {
                        this.setFilter(name, value, label);
                     }}
                  />
               </div>
            )}
            {Class.value !== "ftz" && (
               <div
                  onClick={() => {
                     if (insideOfFTZ.value === false) {
                        this.setFilter(outsideOfFTZ.name, !outsideOfFTZ.value, outsideOfFTZ.label);
                        this.setFilter(insideOfFTZ.name, false, insideOfFTZ.label);
                     }
                  }}
               >
                  <Typography style={{margin: "0 15px"}}>
                     <Switch checked={outsideOfFTZ.value} value={outsideOfFTZ.value} disabled={insideOfFTZ.value}/>
                     {translate(outsideOfFTZ.label)}
                  </Typography>
                  <Divider style={{margin: "10px 0"}}/>
               </div>
            )}
            <Button
               color="primary"
               variant="contained"
               onClick={this.dispatchFilters}
               fullWidth
            >
               {translate("نمایش نتایج")}
            </Button>
         </div>
      );
   }
}

export default withRouter(connect(mapStateToProps)(FilterModal));
