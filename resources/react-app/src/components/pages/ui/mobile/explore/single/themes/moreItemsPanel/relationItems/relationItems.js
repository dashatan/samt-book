import React from "react";
import {Box, ButtonBase, CardMedia, CircularProgress, Paper, Slide, Toolbar} from "@material-ui/core";
import {Route, Switch, useHistory, useLocation, useParams, useRouteMatch} from "react-router-dom";
import RelationItem from "./relationItem";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../../../translate";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Single from "../../../index";

export default function RelationItems(props) {
  let {state} = useLocation();
  let {push,goBack} = useHistory();
  let {path,url} = useRouteMatch();
  let {relation} = useParams();
  function relationPage(relationItem) {
    if (['wtd', 'nws', 'agt'].includes(relationItem.class)) {
      push({
        pathname:`${url}/${relationItem.class}/${relationItem.id}`,
        state:{
          ...state,
          collection:relationItem,
        }
      });
    } else {
      push({
        pathname:`${url}/${relationItem.id}`,
        state:{
          ...state,
          relationItem,
        }
      });
    }
  }

  let collection = state.collection;
  if (!collection) {
    return (
      <Box
        style={{
          position: 'fixed',
          height: '100vh',
          width: '100%',
          top: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: "center",
          backgroundColor: '#ffffff'
        }}
      >
        <CircularProgress/>
      </Box>
    )
  }
  let relations = collection[relation];
  return (
    <Slide direction="left" in={true}>
      <Box
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100vh",
          zIndex: 10000,
          backgroundColor: "#ffffff"
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
            <Box>
              <Typography>{translate(relation)}</Typography>
              <Typography variant="caption">{collection ? collection.label : ''}</Typography>
            </Box>
            <Fab
              size="small"
              focusRipple
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              <ArrowBack
                onClick={goBack}
              />
            </Fab>
          </Toolbar>
        </AppBar>
        <Box style={{height: 60}}/>
        <Box
          style={{
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
            padding: 10,
          }}
        >
          {relations && relations.length === 0 && (
            <Alert severity="error" variant="filled">
              {translate('نتیجه ای یافت نشد')}
            </Alert>
          )}
          {relations && relations.length > 0 && (
            relations.map((relationItem, key) => {
              return (
                <Paper
                  key={key}
                  elevation={3}
                  style={{
                    position: "relative",
                    height: 100,
                    borderRadius: 20,
                    display: "flex",
                    marginBottom: 20,
                  }}
                >
                  <ButtonBase
                    style={{
                      width: "100%",
                      borderRadius: 20,
                    }}
                    onClick={()=>{
                      relationPage(relationItem)
                    }}
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardMedia
                          image={state.baseUrl + '/' + relationItem.icon}
                          title={relationItem.label}
                          style={{
                            borderRadius: "50%",
                            width: 80,
                            height: 80,
                            backgroundSize: "cover",
                          }}
                        />

                      </Grid>
                      <Grid
                        item
                        xs={8}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography>
                            {translate(relationItem.label)}
                          </Typography>
                          {relationItem.caption && (
                            <Typography variant="caption">
                              {translate(relationItem.caption)}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </ButtonBase>
                </Paper>
              )
            })
          )}
        </Box>
        <Switch>
          <Route component={RelationItem} path={`${path}/:id`} exact/>
          <Route component={Single} path={`${path}/:class/:id`}/>
        </Switch>
      </Box>
    </Slide>
  )
}