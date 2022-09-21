import React, {useState} from "react";
import translate from "../../../translate";
import {AppBar, Backdrop, CircularProgress, List, ListItem, ListItemText, Toolbar} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {useLocation} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  }
};

function Lang() {
  let {state} = useLocation();
  let [loading, setLoading] = useState(false);

  function handleClick(lang) {
    setLoading(true);
    localStorage.setItem('lang', lang.value);
    setLoading(false);

    if (state) {
      window.location.href = state.redirectPath;
    } else {
      window.location.href = window.location.origin;
    }
  }

  let languages = [
    {label: "فارسی", value: "fa"},
    {label: "English", value: "en"},
    {label: "türkçe", value: "tu"},
    {label: "中國人", value: "ch"},
    {label: "русский", value: "ru"},
    {label: "اردو", value: "ur"},
  ];
  return (
    <div>
      <AppBar color="inherit" position="static" style={{width: '100%'}}>
        <Toolbar>
          <Typography>{translate("لطفا زبان را انتخاب کنید")}</Typography>
        </Toolbar>
      </AppBar>
      <List>
        {languages.map((language, key) => {
          return (
            <div key={key}>
              <ListItem
                button onClick={() => {
                handleClick(language)
              }}
              >
                <ListItemText id={language.value}>
                  <Typography>
                    {language.label}
                  </Typography>
                </ListItemText>
              </ListItem>
              <Divider/>
            </div>
          );
        })}
      </List>
      <Backdrop open={loading}>
        <CircularProgress/>
      </Backdrop>
    </div>
  );
}

export default connect(mapStateToProps)(Lang);
