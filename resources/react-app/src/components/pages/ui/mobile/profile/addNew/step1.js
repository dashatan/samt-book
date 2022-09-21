import React from "react";
import {connect} from "react-redux";
import {Box, ButtonBase, Card, CardMedia, Toolbar, Zoom} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import translate from "../../../../../translate";
import Typography from "@material-ui/core/Typography";
import Store from "../../../../../redux/store";
import Fab from "@material-ui/core/Fab";
import {Close} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import {useHistory, useRouteMatch} from "react-router";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    classesOfAddingNewItem: state.classesOfAddingNewItem,
    dataStoreOfAddNewItem: state.dataStoreOfAddNewItem,
    user: state.user,
    collections: state.collectionsOfCurrentUser,
  };
};

function Step1(props) {
  let {push} = useHistory();
  let {path} = useRouteMatch();
  if (!props.collections) {
    push("/profile");
  }

  function setClass(block) {
    let dataStoreOfAddNewItem = props.dataStoreOfAddNewItem;
    dataStoreOfAddNewItem.map((item) => {
      if (["isInIdp", "isInFtz"].includes(item.name)) {
        item.value = false;
      } else {
        item.value = "";
        item.label = "";
      }
    });
    dataStoreOfAddNewItem.find((x) => x.name === "class").value = block.value;
    dataStoreOfAddNewItem.find((x) => x.name === "countryId").value = 80;
    dataStoreOfAddNewItem.find((x) => x.name === "countryId").label = "Iran";
    Store.dispatch({
      type: "dataStoreOfAddNewItem",
      payload: dataStoreOfAddNewItem,
    });
    push(path.replace("step1", "step2"));
  }

  let delay = 0;
  return (
    <div>
      <Box
        style={{
          height: "100vh",
          backgroundColor: "#f0f8ff",
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
            <Typography>{translate("ثبت جدید")}</Typography>
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
                  push("/profile");
                }}
              />
            </Fab>
          </Toolbar>
        </AppBar>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 60,
          }}
        >
          <Grid
            container
            spacing={4}
            style={{
              justifyContent: "center",
            }}
            className="grid-container"
          >
            {props.classesOfAddingNewItem.map((block, key) => {
              delay = delay + 50;
              const template = (
                <Zoom
                  in={true}
                  key={key}
                  style={{
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  <Grid item xs={4}>
                    <ButtonBase
                      style={{
                        display: "flex",
                        flexFlow: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                      onClick={()=>{
                        setClass(block)
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          flexFlow: "column",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Card
                          elevation={3}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 80,
                          }}
                        >
                          <CardMedia
                            image={props.baseUrl + "/" + block.icon}
                            title={translate(block.label)}
                            style={{
                              width: 80,
                              height: 80,
                              backgroundSize: 50,
                            }}
                          />
                        </Card>
                        <Typography
                          style={{
                            fontSize: 13,
                            textAlign: "center",
                            marginTop: 10,
                          }}
                        >
                          {translate(block.label)}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  </Grid>
                </Zoom>
              );
              switch (block.value) {
                case "exb":
                  if (["admin", "executor"].includes(props.user.role)) {
                    return template;
                  }
                  break;
                default:
                  return template;
              }
            })}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default connect(mapStateToProps)(Step1);
