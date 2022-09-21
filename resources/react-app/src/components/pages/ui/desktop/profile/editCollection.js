import React from "react";
import {AppBar, Box, Fab, Slide, Tab, Tabs, Toolbar, Typography} from "@material-ui/core";
import {connect} from "react-redux";
import {Route, Switch} from 'react-router-dom';
import {Close} from "@material-ui/icons";
import translate from "../../../../translate";
import Information from "./editCollecction/info";
import Store from "../../../../redux/store";
import Axios from "axios";
import Specifications from "./editCollecction/specs";
import Relations from "./editCollecction/relations";
import List from "../side-components/relation/list";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    dataStoreOfAddNewItem: state.dataStoreOfAddNewItem,
    userToken: state.userToken,
    EditingCollection: state.EditingCollection,
    EditingCollectionChanged: state.EditingCollectionChanged,
    virtualKeyboardVisible: state.virtualKeyboardVisible,
  };
};

function camelToSnake(string) {
  return string
  .replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + "_" + m[1];
  })
  .toLowerCase();
}

class EditCollection extends React.Component {
  constructor(props) {
    super(props);
    if (!props.EditingCollection) {
      this.getEditingCollection();
    } else {
      this.mapAddDataToEditData(props.EditingCollection);
    }
    this.state = {
      tabValue: 0,
      initialWindowHeight: window.innerHeight,
      virtualKeyboardVisible: false,
      scrollElementHeight: '100vh',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  componentDidMount() {
    this.props.history.listen(() => {
      if (this.props.EditingCollectionChanged) {
        this.getEditingCollection();
        this.setState({tabValue: 0});
        Store.dispatch({
          type: "EditingCollectionChanged",
          payload: false,
        });
      }
    })
    document.body.onresize = () => {
      if (this.state.initialWindowHeight - window.innerHeight > 150) {
        Store.dispatch({
          type: 'virtualKeyboardVisible',
          payload: true,
        })
        this.setState({
          virtualKeyboardVisible: true,
          scrollElementHeight: window.innerHeight,
        })
      } else {
        document.querySelectorAll('input').forEach((input) => {
          input.blur();
        })
        Store.dispatch({
          type: 'virtualKeyboardVisible',
          payload: false,
        })
        this.setState({
          virtualKeyboardVisible: false,
          scrollElementHeight: '100vh'
        });
      }
    }
  }

  getEditingCollection = () => {
    const url = this.props.baseUrl + '/api/profile/getCollection';
    Axios.post(url, {id: this.props.match.params.id}).then(e => {
      Store.dispatch({
        type: "EditingCollection",
        payload: e.data
      })
      this.mapAddDataToEditData(e.data);
    }).catch(e => {
      console.log(e);
    })
  }

  mapAddDataToEditData = (editingCollection) => {
    let data = this.props.dataStoreOfAddNewItem;
    data.map((item) => {
      let name = camelToSnake(item.name);
      if (["isInIdp", "isInFtz"].includes(item.name)) {
        return (
          item.value = editingCollection[name] !== 0
        );
      } else {
        item.value = editingCollection[name];
      }
    });
    Store.dispatch({
      type: "dataStoreOfEditingItem",
      payload: data
    });
  }

  render() {
    return (
      <Slide in={true} direction="left">
        <Box
          id="edit-collection-scroll-element"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: this.state.scrollElementHeight,
            zIndex: 1000,
            overflowY: 'auto',
            backgroundColor: "#f0f8ff"
          }}
        >
          {!this.state.virtualKeyboardVisible && (
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
                <Typography>{this.props.EditingCollection ? this.props.EditingCollection.title : ""}</Typography>
                <Fab
                  size="small"
                  focusRipple
                  style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  }}
                >
                  <Close
                    onClick={() => {
                      this.props.history.push("/profile");
                    }}
                  />
                </Fab>
              </Toolbar>
            </AppBar>
          )}
          {!this.state.virtualKeyboardVisible && (
            <Box style={{height: 60}}/>
          )}
          {!this.state.virtualKeyboardVisible && (
            <Tabs
              variant="fullWidth"
              value={this.state.tabValue}
              onChange={(event, newValue) => {
                this.setState({
                  tabValue: newValue,
                });
              }}
              indicatorColor='primary'
            >
              <Tab label={translate("اطلاعات")}/>
              <Tab label={translate("مشخصات")}/>
              <Tab label={translate("موارد دیگر")}/>
            </Tabs>
          )}
          {this.state.tabValue === 0 && <Information/>}
          {this.state.tabValue === 1 && <Specifications/>}
          {this.state.tabValue === 2 && <Relations/>}
          <Switch>
            <Route path={this.props.match.path + '/relations/:name'} component={List}/>
          </Switch>
        </Box>
      </Slide>
    );
  }
}

export default connect(mapStateToProps)(EditCollection);
