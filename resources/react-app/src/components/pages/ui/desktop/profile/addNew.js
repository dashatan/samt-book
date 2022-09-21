import React from "react";
import {Box, Slide} from "@material-ui/core";
import Step1 from "./addNew/step1";
import Step2 from "./addNew/step2";
import Step3 from "./addNew/step3";
import {Route, Switch, useRouteMatch} from "react-router-dom";

export default function AddNew() {
  let {path} = useRouteMatch();
  return (
    <Slide in={true} direction="left">
      <Box
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1000,
          backgroundColor: "#ffffff"
        }}
      >
        <Switch>
          <Route path={path + "/step1"} component={Step1}/>
          <Route path={path + "/step2"} component={Step2}/>
          <Route path={path + "/step3"} component={Step3}/>
        </Switch>
      </Box>
    </Slide>
  );
}