import React from "react";
import {connect} from "react-redux";
import {Box, Button, Snackbar, Switch, Toolbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import translate from "../../../../../translate";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import Select from "../../explore/filterComponents/Select";
import Store from "../../../../../redux/store";
import Divider from "@material-ui/core/Divider";
import Slide from "@material-ui/core/Slide";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    classes: state.classesOfAddingNewItem,
    data: state.dataStoreOfAddNewItem,
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
  };
};

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.data.find((x) => x.name === "class").value) {
      props.history.push(props.match.path.replace("step2", "step1"));
    }
    if (!props.collections) {
      props.history.push("/profile");
    }
    this.state = {
      requiredExists: false,
      snackBarOpen: false,
      snackBarMessage: <div/>,
      prtParentCategory: {
        value: "",
        label: ""
      },
      alreadyHaveCompany: false,
    };
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
      type: "dataStoreOfAddNewItem",
      payload: data,
    });
    this.setState({[name]: value});
  };

  nextStep = () => {
    let requiredExists = false;
    let data = document.querySelector("#required-items").querySelectorAll('input[type="hidden"]');
    data.forEach((input) => {
      if (!input.value) {
        requiredExists = true;
      }
    });
    if (requiredExists) {
      const requiredAlert = (
        <MuiAlert elevation={6} variant="filled" severity="error">
          {translate("انتخاب گزینه های ستاره دار ضروری میباشد")}
        </MuiAlert>
      );
      this.setState({
        snackBarOpen: true,
        snackBarMessage: requiredAlert,
      });
    } else {
      this.props.history.push(this.props.match.path.replace("step2", "step3"));
    }
  };

  render() {
    //Values
    let Class = this.props.data.find((x) => x.name === "class").value;
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
    let prtParentCategory = this.props.categories.find((x) => x.id === this.state.prtParentCategory.value);
    let prtCategories = prtParentCategory ? prtParentCategory.children : [];
    let prtCategoriesSelectVariant = 'linear';
    if (this.state.prtParentCategory.value === 0) {
      prtCategories = this.props.categories.filter(x => x.class === 'prd');
      prtCategoriesSelectVariant = 'linearNested';
    }
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
    showItems.categories = categories.length > 0;
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
      showItems.alreadyHaveCompany = exbId.value !== "" && myCompanies.length > 0;
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
      <div>
        <Box
          style={{
            height: "100vh",
            backgroundColor: "#f0f8ff",
            overflowY: "auto",
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
              {this.props.classes.find((x) => x.value === Class)
                ? <Typography>{translate(this.props.classes.find((x) => x.value === Class).label)}</Typography>
                : <Typography>{translate('ثبت جدید')}</Typography>
              }

              <Fab
                size="small"
                focusRipple
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              >
                <ArrowBack onClick={this.props.history.goBack}/>
              </Fab>
            </Toolbar>
          </AppBar>
          <Box
            id="required-items"
            style={{
              marginTop: 80,
              marginBottom: 130,
            }}
          >
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
                    label={type.label}
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
                    // key={categoryId}
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
                    label={categoryId.label}
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
                    label={categoryId.label}
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
                    label={countryId.label}
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
                    label={provinceId.label}
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
                    label={cityId.label}
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
                    label={idpId.label}
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
                    label={ftzId.label}
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
                    <Divider style={{margin: "10px 0"}}/>
                  </Typography>
                </div>
              </Slide>
            )}
            {showItems.prtParentCategories && (
              <Slide in={true} direction="left" style={{transitionDelay: 90}}>
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
              <Slide in={true} direction="left" style={{transitionDelay: 100}}>
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
                    label={exbId.label}
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                      this.setData('collectionableId', value);
                      this.setData('collectionableType', 'App\\Collection');
                    }}
                  />
                  <input type="hidden" name="exbId" id="exbId" value={exbId.value}/>
                </div>
              </Slide>
            )}
            {showItems.alreadyHaveCompany && (
              <Slide in={true} direction="left" style={{transitionDelay: 10}}>
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
              <Slide in={true} direction="left" style={{transitionDelay: 10}}>
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
                    label={companyId.label}
                    response={(name, value, label) => {
                      this.setData(name, value, label);
                    }}
                  />
                  <input type="hidden" name="companyId" id="companyId" value={companyId.value}/>
                </div>
              </Slide>
            )}
            {showItems.prtCategories && (
              <Slide in={true} direction="left" style={{transitionDelay: 90}}>
                <div>
                  <Select
                    key={this.state.prtParentCategory.value}
                    variant={prtCategoriesSelectVariant}
                    withSearch={true}
                    withIcon={false}
                    withAllOption={false}
                    options={prtCategories}
                    title={translate("دسته بندی")}
                    required={true}
                    name="categoryId"
                    match={this.props.match}
                    label={categoryId.label}
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
                  onClick={this.nextStep}
                >
                  {translate("مرحله بعدی")}
                </Button>
              </Slide>
            </Toolbar>
          </AppBar>
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
      </div>
    );
  }
}

export default connect(mapStateToProps)(Step2);
