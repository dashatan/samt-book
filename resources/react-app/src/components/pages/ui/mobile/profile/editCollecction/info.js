import React from "react";
import {connect} from "react-redux";
import {Box, Button, CircularProgress, Snackbar, Switch, Toolbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import translate from "../../../../../translate";
import AppBar from "@material-ui/core/AppBar";
import Select from "../../explore/filterComponents/Select";
import Store from "../../../../../redux/store";
import Divider from "@material-ui/core/Divider";
import Axios from "axios";
import Slide from "@material-ui/core/Slide";
import {withRouter} from "react-router-dom";
import camelToSnake from "../../../../../camelToSnake";
import Typography from "@material-ui/core/Typography";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    classes: state.classesOfAddingNewItem,
    data: state.dataStoreOfEditingItem,
    types: state.types,
    categories: state.categories,
    countries: state.countries,
    provinces: state.provinces,
    cities: state.cities,
    idps: state.idps,
    ftzs: state.ftzs,
    exbs: state.exbs,
    user: state.user,
    userToken: state.userToken,
    collections: state.collectionsOfCurrentUser,
    EditingCollection: state.EditingCollection,
  };
};

class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requiredExists: false,
      snackBarOpen: false,
      snackBarMessage: <div/>,
      prtParentCategory: {
        value: "",
        label: ""
      },
      alreadyHaveCompany: false,
      childCategories: [],
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.EditingCollection) {
      let Class = this.props.EditingCollection.class;
      let childCategories = [];
      this.props.categories.map((category) => {
        childCategories = childCategories.concat(category.children);
      });
      this.setState({childCategories});
      if (Class === "prt") {
        let Category = childCategories.find((x) => x.value === this.props.EditingCollection.category_id);
        let parentCategory;
        if (Category) {
          parentCategory = this.props.categories.find((x) => x.value === Category.parent_id);
        }
        if (parentCategory) {
          this.setState({
            prtParentCategory: {
              value: parentCategory.value,
              label: parentCategory.label,
            },
            alreadyHaveCompany: !!this.props.EditingCollection.company_id,
          });
        }
      }
    }
  }

  setData = (name, value, label) => {
    let data = this.props.data;
    let item = data.find((x) => x.name === name);
    let prevValue = data.find((x) => x.name === name).value;
    item.value = value;
    item.label = label;
    if (prevValue !== value) {
      if (name === "provinceId") {
        data.find((x) => x.name === "cityId").value = "";
        data.find((x) => x.name === "cityId").label = "";
        data.find((x) => x.name === "idpId").value = "";
        data.find((x) => x.name === "idpId").label = "";
      }
    }
    Store.dispatch({
      type: "dataStoreOfEditingItem",
      payload: data,
    });
    this.setState({[name]: value});
  };

  update = () => {
    let requiredExists = false;
    let requiredItems = document.querySelector("#required-items").querySelectorAll('input[type="hidden"]');
    requiredItems.forEach((input) => {
      if (!input.value) {
        requiredExists = true;
      }
    });
    if (requiredExists) {
      const requiredAlert = (
        <MuiAlert elevation={6} variant="filled" severity="error">
          {translate("گزینه های ستاره دار ضروری میباشد")}
        </MuiAlert>
      );
      this.setState({
        snackBarOpen: true,
        snackBarMessage: requiredAlert,
      });
    } else {
      this.setState({loading: true});
      const data = this.props.data;
      data.find((x) => x.name === "userToken").value = this.props.userToken;
      let formData = {};
      data.map((item) => {
        formData[camelToSnake(item.name)] = item.value;
      });
      formData['id'] = this.props.EditingCollection.id;
      const url = this.props.baseUrl + "/api/profile/updateCollection";
      Axios.post(url, formData)
      .then((e) => {
        this.props.history.push("/profile");
        Store.dispatch({
          type: 'propsUpdated',
          payload: true
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
          errorSnackBar: true,
        });
        console.log(e);
      });
    }

  };

  render() {
    if (!this.props.EditingCollection || !this.props.data) {
      return (
        <Box
          style={{
            paddingTop: 25,
            textAlign: 'center',
          }}
        >
          <CircularProgress color="primary"/>
        </Box>
      )
    }
    //Values
    let Class = this.props.EditingCollection.class;
    let type = this.props.data.find((x) => x.name === "type");
    let categoryId = this.props.data.find((x) => x.name === "categoryId");
    let countryId = this.props.data.find((x) => x.name === "countryId");
    let provinceId = this.props.data.find((x) => x.name === "provinceId");
    let cityId = this.props.data.find((x) => x.name === "cityId");
    let isInIdp = this.props.data.find((x) => x.name === "isInIdp");
    let idpId = this.props.data.find((x) => x.name === "idpId");
    let isInFtz = this.props.data.find((x) => x.name === "isInFtz");
    let ftzId = this.props.data.find((x) => x.name === "ftzId");
    let exbId = this.props.data.find((x) => x.name === "exbId");
    let companyId = this.props.data.find((x) => x.name === "companyId");
    //Arrays
    let types = this.props.types.filter((x) => x.class === Class);
    let categories = this.props.categories.filter((x) => x.class === Class);
    let childCategories = this.state.childCategories;
    let countries = this.props.countries;
    let provinces = this.props.provinces;
    let cities = this.props.cities.filter((x) => x.province_id === provinceId.value);
    let idps = this.props.idps ? this.props.idps.filter((x) => x.province_id === provinceId.value) : [];
    let ftzs = this.props.ftzs ? this.props.ftzs.filter((x) => x.province_id === provinceId.value) : [];
    let exbs = this.props.exbs
      ? this.props.exbs.filter((x) => x.category_id === this.state.prtParentCategory.value)
      : [];
    let myCompanies = this.props.collections
      ? this.props.collections.filter(
        (x) => x.category_id ===
          this.state.prtParentCategory.value &&
          ["prd", "gld", "act", "prv", "ofc"].includes(x.class)
      )
      : [];
    let prtParentCategory = this.props.categories.find((x) => x.value === this.state.prtParentCategory.value);
    let prtCategories = prtParentCategory ? prtParentCategory.children : [];
    let constantExbs = this.props.exbs ? this.props.exbs.filter((x) => x.category_id === 0) : [];
    //conditions
    let showItems = {
      type: false,
      categories: false,
      countries: false,
      provinces: false,
      cities: false,
      isInIdp: false,
      idps: false,
      isInFtz: false,
      ftzs: false,
      exbs: false,
      executors: false,
      exbCategories: false,
      prtParentCategories: false,
      alreadyHaveCompany: false,
      companies: false,
      prtCategoryId: false,
    };
    showItems.type = types.length > 0;
    showItems.categories = categories.length > 0 && childCategories.length > 0;
    showItems.countries = !["prt", "exb"].includes(Class);
    showItems.provinces = countryId.value === 80;
    showItems.isInIdp =
      !["prt", "exb", "idp"].includes(Class) && countryId.value === 80 && provinceId.value > 0 && idps.length > 0;
    showItems.isInFtz =
      !["prt", "exb", "idp"].includes(Class) && countryId.value === 80 && provinceId.value > 0 && ftzs.length > 0;
    showItems.cities = showItems.provinces && provinceId.value > 0 && !isInIdp.value && !isInFtz.value;
    showItems.idps = countryId.value === 80 && isInIdp.value;
    showItems.ftzs = countryId.value === 80 && isInFtz.value;
    if (Class === "exb") {
      showItems.exbCategories = true;
      switch (type.value) {
        case "state":
          showItems.countries = false;
          countryId.value = 80;
          countryId.label = "Iran";
          showItems.provinces = false;
          showItems.cities = false;
          break;
        case "global":
          showItems.countries = true;
          countryId.value = "";
          countryId.label = "";
          showItems.provinces = false;
          showItems.cities = false;
          break;
        case "local":
          showItems.countries = false;
          countryId.value = 80;
          countryId.label = "Iran";
          showItems.provinces = true;
          break;
        case "idp":
          showItems.countries = false;
          countryId.value = 80;
          countryId.label = "Iran";
          showItems.provinces = true;
          showItems.cities = false;
          showItems.idps = true;
          break;
        default:
          showItems.countries = false;
          showItems.provinces = false;
          break;
      }
    }
    if (Class === "prt") {
      showItems.prtParentCategories = true;
      showItems.exbs = this.state.prtParentCategory.value !== "";
      showItems.alreadyHaveCompany = exbId.value !== "" && myCompanies.length > 0 && categoryId.value;
      showItems.companies = this.state.alreadyHaveCompany;
      showItems.prtCategories = this.state.prtParentCategory.value !==
        "" &&
        exbId.value !==
        "" &&
        !this.state.alreadyHaveCompany;
      showItems.countries = false;
      showItems.provinces = false;
    }

    return (
      <Box>
        <Box
          style={{
            backgroundColor: "#f0f8ff",
            paddingTop: 25,
            height: "calc(100vh - 190px)",
            overflowY: 'auto'
          }}
        >
          <Box id="required-items">
            {showItems.type && (
              <Slide in={true} direction="left" style={{transitionDelay: 10}}>
                <div>
                  <Select
                    // key={type.value}
                    variant="linear"
                    withSearch={false}
                    withIcon={false}
                    withAllOption={false}
                    options={types}
                    title={translate("طبقه بندی")}
                    required={true}
                    name="type"
                    match={this.props.match}
                    label={type.label ? type.label : types.find((x) => x.value === type.value).label}
                    icon={"images/icons/special-flat/documents.svg"}
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="type" id="type" value={type.value}/>
                </div>
              </Slide>
            )}
            {showItems.categories > 0 && (
              <Slide in={true} direction="left" style={{transitionDelay: 20}}>
                <div>
                  <Select
                    key={categoryId}
                    variant="linearNested"
                    withSearch={true}
                    withIcon={false}
                    withAllOption={false}
                    withOthersOption={true}
                    options={categories}
                    title={translate("دسته بندی")}
                    required={true}
                    name="categoryId"
                    match={this.props.match}
                    label={
                      categoryId.label
                        ? categoryId.label
                        : childCategories.find((x) => x.value === categoryId.value)
                        ? childCategories.find((x) => x.value === categoryId.value).label
                        : ""
                    }
                    icon={"images/icons/special-flat/checklist.svg"}
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="categoryId" id="categoryId" value={categoryId.value}/>
                </div>
              </Slide>
            )}
            {showItems.exbCategories > 0 && (
              <Slide in={true} direction="left" style={{transitionDelay: 20}}>
                <div>
                  <Select
                    variant="linear"
                    withSearch={true}
                    withIcon={false}
                    withAllOption={true}
                    allOption={{
                      value: 0,
                      label: translate("همه دسته بندی ها"),
                    }}
                    options={this.props.categories.filter((x) => x.class === "prd")}
                    title={translate("دسته بندی")}
                    required={true}
                    name="categoryId"
                    match={this.props.match}
                    label={
                      categoryId.label
                        ? categoryId.label
                        : this.props.EditingCollection.category_id === 0
                        ? translate("همه دسته بندی ها")
                        : this.props.categories.find((x) => x.value === categoryId.value)
                          ? this.props.categories.find((x) => x.value === categoryId.value).label
                          : ""
                    }
                    icon={"images/icons/special-flat/checklist.svg"}
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="categoryId" id="categoryId" value={categoryId.value}/>
                </div>
              </Slide>
            )}
            {showItems.countries && (
              <Slide in={true} direction="left" style={{transitionDelay: 30}}>
                <div>
                  <Select
                    variant="linear"
                    withSearch={true}
                    withIcon={true}
                    icon={"images/icons/special-flat/globe.svg"}
                    withAllOption={false}
                    options={countries}
                    title={translate("کشور")}
                    required={true}
                    name="countryId"
                    match={this.props.match}
                    label={
                      countryId.label
                        ? countryId.label
                        : this.props.countries.find((x) => x.value === countryId.value)
                        ? this.props.countries.find((x) => x.value === countryId.value).label
                        : ""
                    }
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="countryId" id="countryId" value={countryId.value}/>
                </div>
              </Slide>
            )}
            {showItems.provinces && (
              <Slide in={true} direction="left" style={{transitionDelay: 40}}>
                <div>
                  <Select
                    variant="linear"
                    withSearch={true}
                    withIcon={true}
                    icon={"images/icons/special-flat/map.svg"}
                    withAllOption={false}
                    options={provinces}
                    title={translate("استان")}
                    required={true}
                    name="provinceId"
                    match={this.props.match}
                    label={
                      provinceId.label
                        ? provinceId.label
                        : this.props.provinces.find((x) => x.id === provinceId.value)
                        ? this.props.provinces.find((x) => x.id === provinceId.value).label
                        : ""
                    }
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="provinceId" id="provinceId" value={provinceId.value}/>
                </div>
              </Slide>
            )}
            {showItems.cities && (
              <Slide in={true} direction="left" style={{transitionDelay: 50}}>
                <div>
                  <Select
                    key={cityId.value}
                    variant="linear"
                    withSearch={true}
                    withIcon={true}
                    icon={"images/icons/special-flat/location.svg"}
                    withAllOption={false}
                    options={cities}
                    title={translate("شهر")}
                    required={true}
                    name="cityId"
                    match={this.props.match}
                    label={
                      cityId.label
                        ? cityId.label
                        : this.props.cities.find((x) => x.id === cityId.value)
                        ? this.props.cities.find((x) => x.id === cityId.value).label
                        : ""
                    }
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="cityId" id="cityId" value={cityId.value}/>
                </div>
              </Slide>
            )}
            {showItems.idps && (
              <Slide in={true} direction="left" style={{transitionDelay: 70}}>
                <div>
                  <Select
                    key={idpId.value}
                    variant="linear"
                    withSearch={true}
                    withIcon={true}
                    icon={"images/icons/special-flat/factory.svg"}
                    withAllOption={false}
                    options={idps}
                    title={translate("شهرک صنعتی")}
                    required={true}
                    name="idpId"
                    match={this.props.match}
                    label={
                      idpId.label
                        ? idpId.label
                        : this.props.idps
                        ? this.props.idps.find((x) => x.id === idpId.value)
                          ? this.props.idps.find((x) => x.id === idpId.value).label
                          : ""
                        : ""
                    }
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="idpId" id="idpId" value={idpId.value}/>
                </div>
              </Slide>
            )}
            {showItems.ftzs && (
              <Slide in={true} direction="left" style={{transitionDelay: 90}}>
                <div>
                  <Select
                    key={ftzId.value}
                    variant="linear"
                    withSearch={true}
                    withIcon={true}
                    icon={"images/icons/special-flat/airplane.svg"}
                    withAllOption={false}
                    options={ftzs}
                    title={translate("منطقه آزاد تجاری-صنعتی")}
                    required={true}
                    name="ftzId"
                    match={this.props.match}
                    label={
                      ftzId.label
                        ? ftzId.label
                        : this.props.ftzs
                        ? this.props.ftzs.find((x) => x.id === ftzId.value)
                          ? this.props.ftzs.find((x) => x.id === ftzId.value).label
                          : ""
                        : ""
                    }
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="ftzId" id="ftzId" value={ftzId.value}/>
                </div>
              </Slide>
            )}
            {showItems.isInIdp && (
              <Slide in={true} direction="left" style={{transitionDelay: 60}}>
                <div
                  onClick={() => {
                    this.setData("isInIdp", !isInIdp.value);
                  }}
                >
                  <Typography>
                    <span style={{margin: "0 15px"}}>
                    <Switch checked={isInIdp.value}/>
                  </span>
                    {translate("مستقر در شهرک صنعتی")}
                  </Typography>
                  <Divider style={{margin: "10px 0"}}/>
                </div>
              </Slide>
            )}
            {showItems.isInFtz && (
              <Slide in={true} direction="left" style={{transitionDelay: 80}}>
                <div
                  onClick={() => {
                    this.setData("isInFtz", !isInFtz.value);
                  }}
                >
                  <Typography>
                    <span style={{margin: "0 15px"}}>
                    <Switch checked={isInFtz.value}/>
                  </span>
                    {translate("مستقر در منطقه آزاد تجاری-صنعتی")}
                  </Typography>
                  <Divider style={{margin: "10px 0"}}/>
                </div>
              </Slide>
            )}
            {showItems.prtParentCategories && (
              <Slide in={true} direction="left" style={{transitionDelay: 10}}>
                <div>
                  <Select
                    key={this.state.prtParentCategory.value}
                    variant="linear"
                    withSearch={true}
                    withIcon={false}
                    withAllOption={true}
                    allOption={{
                      value: 0,
                      label: translate("همه دسته بندی ها"),
                    }}
                    options={this.props.categories.filter((x) => x.class === "prd")}
                    title={translate("دسته بندی نمایشگاه")}
                    required={true}
                    name="categoryId"
                    match={this.props.match}
                    label={this.state.prtParentCategory.label}
                    icon={"images/icons/special-flat/checklist.svg"}
                    response={(name, value, label) => {
                      if (this.state.prtParentCategory.value !== value) {
                        let data = this.props.data;
                        data.find((x) => x.name === "exbId").value = "";
                        data.find((x) => x.name === "exbId").label = "";
                        data.find((x) => x.name === "categoryId").value = "";
                        data.find((x) => x.name === "categoryId").label = "";
                        Store.dispatch({
                          type: "dataStoreOfAddNewItem",
                          payload: data,
                        });
                      }
                      this.setState({
                        prtParentCategory: {
                          value,
                          label,
                        },
                      });
                    }}
                  />
                  <input type="hidden" name="categoryId" id="categoryId" value={this.state.prtParentCategory.value}/>
                </div>
              </Slide>
            )}
            {showItems.exbs && (
              <Slide in={true} direction="left" style={{transitionDelay: 20}}>
                <div>
                  <Select
                    key={exbId.value}
                    variant="grid"
                    withSearch={true}
                    withIcon={true}
                    icon={"images/icons/special-flat/museum.svg"}
                    iconBackgroundSize="cover"
                    withAllOption={false}
                    options={exbs}
                    constantOptions={this.state.prtParentCategory.value !== 0 ? constantExbs : []}
                    title={translate("نمایشگاه")}
                    required={true}
                    name="exbId"
                    match={this.props.match}
                    label={
                      exbId.label
                        ? exbId.label
                        : this.props.exbs
                        ? this.props.exbs.find((x) => x.id === exbId.value)
                          ? this.props.exbs.find((x) => x.id === exbId.value).label
                          : ""
                        : ""
                    }
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="exbId" id="exbId" value={exbId.value}/>
                </div>
              </Slide>
            )}
            {showItems.alreadyHaveCompany && (
              <Slide in={true} direction="left" style={{transitionDelay: 30}}>
                <div
                  onClick={() => {
                    this.setState({
                      alreadyHaveCompany: !this.state.alreadyHaveCompany,
                    });
                  }}
                >
                  <span style={{margin: "0 15px"}}>
                    <Switch checked={this.state.alreadyHaveCompany}/>
                  </span>
                  {translate("قبلا در صمت بوک شرکت ثبت کرده ام")}
                  <Divider style={{margin: "10px 0"}}/>
                </div>
              </Slide>
            )}
            {showItems.companies && (
              <Slide in={true} direction="left" style={{transitionDelay: 40}}>
                <div>
                  <Select
                    key={companyId.value}
                    variant="grid"
                    withSearch={true}
                    withIcon={true}
                    icon={"images/icons/special-flat/manufacturing.svg"}
                    iconBackgroundSize="cover"
                    withAllOption={false}
                    options={myCompanies}
                    title={translate("شرکت")}
                    required={true}
                    name="companyId"
                    match={this.props.match}
                    label={
                      companyId.label
                        ? companyId.label
                        : this.props.companies.find((x) => x.id === companyId.value)
                        ? this.props.companies.find((x) => x.id === companyId.value).label
                        : ""
                    }
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="companyId" id="companyId" value={companyId.value}/>
                </div>
              </Slide>
            )}
            {showItems.prtCategories && (
              <Slide in={true} direction="left" style={{transitionDelay: 40}}>
                <div>
                  <Select
                    variant="linear"
                    withSearch={true}
                    withIcon={false}
                    withAllOption={false}
                    options={prtCategories}
                    title={translate("دسته بندی")}
                    required={true}
                    name="categoryId"
                    match={this.props.match}
                    label={
                      categoryId.label
                        ? categoryId.label
                        : childCategories.find((x) => x.value === this.props.EditingCollection.category_id)
                        ? childCategories.find((x) => x.value === this.props.EditingCollection.category_id).label
                        : ""
                    }
                    icon={"images/icons/special-flat/checklist.svg"}
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="categoryId" id="categoryId" value={categoryId.value}/>
                </div>
              </Slide>
            )}
          </Box>
        </Box>
        <Snackbar
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({snackBarOpen: false});
          }}
          style={{bottom: 70}}
        >
          {this.state.snackBarMessage}
        </Snackbar>
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
                color="primary"
                style={{
                  borderRadius: 100,
                  width: "90%",
                }}
                onClick={this.update}
              >
                {this.state.loading ? <CircularProgress color="inherit" size={24}/> : translate("ذخیره")}
              </Button>
            </Slide>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Information));
