import React from "react";
import {
  AppBar,
  Button,
  ButtonBase,
  Card,
  CardMedia,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import translate from "../../../../../translate";
import {ArrowBack} from "@material-ui/icons";
import {Link, Route, Switch, withRouter} from "react-router-dom";
import Store from "../../../../../redux/store";
import {connect} from "react-redux";
import {red} from "@material-ui/core/colors";
import Fuse from 'fuse.js';

const JDate = require("jalali-date");
const jalaliDate = new JDate();
const baseUrl = Store.getState().baseUrl;
const mapStateToProps = (state) => {
  return {
    classChanged: state.classChanged,
    provinceChanged: state.provinceChanged,
    filterItems: state.filterItems,
  };
};

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState = () => {
    let options = this.props.options;
    return {
      icon: this.props.icon || "",
      label: this.props.label || translate("انتخاب کنید")+' ...',
      value: "",
      title: this.props.title,
      mainBranchTitle: this.props.title,
      firstBranchTitle: '',
      secondBranchTitle: '',
      thirdBranchTitle: '',
      optionsToShow: options,
      mainBranch: options,
      firstBranch: [],
      secondBranch: [],
      ThirdBranch: [],
      level: 0,
      searchText: "",
      allOption: {
        value: "",
        label: translate("همه موارد"),
      },
      mainBranchAllOption: {
        value: "",
        label: translate("همه موارد"),
      },
      firstBranchAllOption: {
        value: "",
        label: ""
      },
      secondBranchAllOption: {
        value: "",
        label: ""
      },
      thirdBranchAllOption: {
        value: "",
        label: ""
      },
      showSelectModal: false,
      dateValue: this.props.dateValue
        ? this.props.dateValue
        : {
          year: jalaliDate.getFullYear(),
          month: jalaliDate.getMonth(),
          day: jalaliDate.getDay(),
        },
      timeValue: this.props.timeValue ? this.props.timeValue : "12:25pm",
    };
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.name === "categoryId" && this.props.classChanged) {
      this.setState(this.initialState());
      this.setState({label: translate("انتخاب کنید")+' ...'});
      this.changeFilterItems("categoryId", "", "");
      Store.dispatch({
        type: "classChanged",
        payload: false,
      });
    }
    if (this.props.name === "cityId" && this.props.provinceChanged) {
      this.setState(this.initialState());
      this.setState({label: translate("انتخاب کنید")+' ...'});
      this.changeFilterItems("cityId", "", "");
      Store.dispatch({
        type: "provinceChanged",
        payload: false,
      });
    }
  }

  changeFilterItems = (name, value, label) => {
    let filterItems = this.props.filterItems;
    let filterItem = filterItems.find((x) => x.name === name);
    filterItem.value = value;
    filterItem.label = label;
    Store.dispatch({
      type: "filterItems",
      payload: filterItems,
    });
  };

  handleChoose(option) {
    this.setState({
      value: option.value,
      label: option.label,
      icon: option.icon ? option.icon : this.state.icon,
      showSelectModal: false,
    });
    if (this.props.response) {
      this.props.response(this.props.name, option.value, option.label);
    }
    if (this.props.onChange) {
      this.props.onChange(this.props.name, option.value, option.label);
    }
    // setTimeout(() => {
    window.history.back();
    // }, 500);
  }

  handleNestedChoose(option) {
    if (option.children && option.children.length > 0) {
      this.nextBranch(option);
    } else {
      this.handleChoose(option);
    }
  }

  nextBranch = (option) => {
    let optionsToShow = option.children;
    let level = this.state.level + 1;
    let prevBranch;
    let levelName;
    switch (level) {
      case 1:
        this.setState({firstBranch: optionsToShow});
        prevBranch = this.state.mainBranch;
        levelName = "first";
        break;
      case 2:
        this.setState({secondBranch: optionsToShow});
        prevBranch = this.state.firstBranch;
        levelName = "second";
        break;
      case 3:
        this.setState({thirdBranch: optionsToShow});
        prevBranch = this.state.secondBranch;
        levelName = "third";
        break;
      default:
        break;
    }
    this.setState({
      optionsToShow,
      level,
      allOption: {
        value: option.value,
        label: translate("همه موارد در") + ' "' + prevBranch.find((x) => x.value === option.value).label + '" ',
      },
      [levelName + "BranchAllOption"]: {
        value: option.value,
        label: translate("همه موارد در") + ' "' + prevBranch.find((x) => x.value === option.value).label + '" ',
      },
      searchText: "",
      [levelName + "BranchTitle"]: prevBranch.find((x) => x.value === option.value).label,
      title: prevBranch.find((x) => x.value === option.value).label,
    });
  };

  prevBranch = () => {
    let level = this.state.level - 1;
    this.setState({
      level,
      searchText: ""
    });
    if (level > -1) {
      switch (level) {
        case 0:
          this.setState({
            optionsToShow: this.state.mainBranch,
            allOption: this.state.mainBranchAllOption,
            title: this.state.mainBranchTitle,
          });
          break;
        case 1:
          this.setState({
            optionsToShow: this.state.firstBranch,
            allOption: this.state.firstBranchAllOption,
            title: this.state.firstBranchTitle,
          });
          break;
        case 2:
          this.setState({
            optionsToShow: this.state.secondBranch,
            allOption: this.state.secondBranchAllOption,
            title: this.state.secondBranchTitle,
          });
          break;
        default:
          break;
      }
    } else {
      this.setState({
        showSelectModal: false,
        level: 0
      });
      // setTimeout(() => {
      window.history.back();
      // }, 500);
    }
  };

  setDate = (e) => {
    let dateValue = {
      year: e.year,
      month: e.month,
      day: e.day,
    };
    this.props.response(this.props.name, dateValue);
    this.setState({
      dateValue,
      label: `${e.year}/${e.month}/${e.day}`,
      showSelectModal: false,
    });
    setTimeout((e) => {
      window.history.back();
    }, 300);
  };

  searchText = (e) => {
    let searchText = e.target.value;
    let optionsToShow = this.state.level > 0 ? this.state.optionsToShow : this.props.options;
    const fuseOptions = {keys: ["label"]};
    const fuse = new Fuse(optionsToShow, fuseOptions);
    let newOptions = [];
    for (let i in fuse.search(searchText)){
      newOptions.push(fuse.search(searchText)[i].item);
    }
    this.setState({
      searchText,
      optionsToShow: newOptions,
    });
  };

  render() {
    let options = [];
    if (this.props.constantOptions) {
      options = options.concat(this.props.constantOptions);
    }
    options = options.concat(this.props.options);
    let optionsToShow =
      this.state.level > 0 ? this.state.optionsToShow : this.state.searchText !== ""
        ? this.state.optionsToShow
        : options;
    let btn = (
      <div>
        <ButtonBase
          component={Link}
          to={{
            pathname: this.props.match.url + "/" + this.props.name,
            state: this.props.location.state,
          }}
          onClick={() => {
            this.setState({showSelectModal: true});
          }}
          style={{width: "100%"}}
        >
          <Grid container>
            {this.state.icon && (
              <Grid
                item
                xs={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card
                  elevation={3}
                  style={{
                    backgroundImage: `url('${baseUrl + "/" + this.state.icon}')`,
                    backgroundSize: this.props.btnIconBackgroundSize || 40,
                    borderRadius: '50%',
                    height: 60,
                    width: 60,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </Grid>
            )}
            <Grid
              item
              xs={this.state.icon ? 9 : 12}
              style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                top: 10
              }}
            >
              <div
                style={{
                  position: "relative",
                  top: -5,
                  fontSize: 13,
                }}
              >
                <Typography style={{fontSize: 13}}>
                  {translate(this.props.title)}
                  {this.props.required && <span style={{color: red.A200}}>*</span>}
                </Typography>
              </div>
              <Typography style={{fontSize: 16}}>{translate(this.state.label)}</Typography>
            </Grid>
          </Grid>
        </ButtonBase>
        {this.props.helperText && (
          <Typography style={{marginTop: 10}} variant={"caption"} color={this.props.error ? 'secondary' : 'inherit'}>
            {translate(this.props.helperText)}
          </Typography>
        )}
        <Divider style={{margin: "10px 0"}}/>
      </div>
    );
    if (this.props.btnVariant) {
      switch (this.props.btnVariant) {
        case "outlined":
          btn = (
            <ButtonBase
              component={Link}
              to={{
                pathname: this.props.match.url + "/" + this.props.name,
                state: this.props.location.state,
              }}
              onClick={() => {
                this.setState({showSelectModal: true});
              }}
              style={{width: "100%"}}
            >
              <TextField
                value={translate(this.state.label)}
                label={this.props.title}
                error={this.props.error}
                helperText={this.props.helperText}
                size="small"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </ButtonBase>
          );
          break;
        case "rounded-outlined":
          btn = (
            <ButtonBase
              component={Link}
              to={{
                pathname: this.props.match.url + "/" + this.props.name,
                state: this.props.location.state,
              }}
              onClick={() => {
                this.setState({showSelectModal: true});
              }}
              style={{width: "100%"}}
            >
              <TextField
                value={translate(this.state.label)}
                label={this.props.title}
                error={this.props.error}
                helperText={this.props.helperText}
                size="small"
                variant="outlined"
                className="rounded-text-field"
                style={{
                  margin: "10px 0",
                  width: "100%",
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </ButtonBase>
          );
          break;
        default:
          break;
      }
    }
    return (
      <div style={{width: "100%"}}>
        {btn}
        <Switch>
          <Route path={this.props.match.path + "/" + this.props.name}>
            <Slide direction="left" in={this.state.showSelectModal}>
              <div className="select-modal">
                <AppBar color="inherit" position="sticky">
                  <Toolbar
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{padding: 10}}>{translate(this.state.title)}</Typography>
                    <Fab
                      size="small"
                      focusRipple
                      style={{
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      }}
                    >
                      <ArrowBack onClick={this.prevBranch}/>
                    </Fab>
                  </Toolbar>
                </AppBar>
                <div
                  className="select-modal-body"
                  style={
                    this.props.variant === "time"
                      ? {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        direction: "ltr",
                      }
                      : {}
                  }
                >
                  {this.props.withAllOption && (
                    <Button
                      size="medium"
                      variant="contained"
                      style={{width: "100%"}}
                      onClick={this.handleChoose.bind(this, this.props.allOption
                        ? this.props.allOption
                        : this.state.allOption)}
                    >
                      {this.props.allOption ? translate(this.props.allOption.label) : translate(this.state.allOption.label)}
                    </Button>
                  )}
                  {this.props.variant === "grid" && (
                    <Grid container className="grid-container" spacing={1}>
                      {optionsToShow.map((option, key) => {
                        return (
                          <Grid item className="grid-item" xs={4} key={key}>
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              onClick={this.handleChoose.bind(this, option)}
                            >
                              <div className="block">
                                {this.props.withIcon && (
                                  <ButtonBase focusRipple style={{
                                    height: 70,
                                    width: 70,
                                    borderRadius: 100,
                                  }}>
                                    <CardMedia
                                      style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 100,
                                        backgroundSize: this.props.iconBackgroundSize || 50,
                                        boxShadow:
                                          "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
                                      }}
                                      image={baseUrl + "/" + option.icon}
                                      title={option.label}
                                    />
                                  </ButtonBase>
                                )}
                                <div style={{height:10}}/>
                                <Typography variant='caption'>{translate(option.label)}</Typography>
                              </div>
                            </div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                  {["linear", "linearNested"].includes(this.props.variant) && (
                    <div>
                      {this.props.withSearch && (
                        <TextField
                          value={this.state.searchText}
                          placeholder={translate("جستجو")}
                          onChange={this.searchText}
                          style={{
                            width: "100%",
                            margin: "15px 0",
                          }}
                        />
                      )}
                      <List>
                        {optionsToShow.map((option, key) => {
                          return (
                            <div key={key}>
                              <ListItem
                                button
                                onClick={
                                  this.props.variant === "linear"
                                    ? this.handleChoose.bind(this, option)
                                    : this.handleNestedChoose.bind(this, option)
                                }
                              >
                                <ListItemText id={this.props.name + option.value}>{translate(option.label)}</ListItemText>
                              </ListItem>
                              <Divider/>
                            </div>
                          );
                        })}
                        {this.props.withOthersOption && (
                          <ListItem
                            button
                            onClick={this.handleChoose.bind(this, {
                              value: 0,
                              label: 'سایر موارد'
                            })}
                          >
                            <ListItemText id="others">{translate('سایر موارد')}</ListItemText>
                          </ListItem>
                        )}
                      </List>
                    </div>
                  )}
                </div>
              </div>
            </Slide>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Select));
