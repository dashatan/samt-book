import React from "react";
import {Box, ButtonBase, CardMedia, CircularProgress, Container, Paper, Slide, Toolbar} from "@material-ui/core";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import RelationItem from "./relationItem";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../../../translate";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    block: state.singleBlock,
  }
}

class RelationItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  relationPage(relation) {
    if (['wtd', 'nws','agt'].includes(relation.class)) {
      this.props.history.push(`/s/${relation.class}/${relation.id}`);
    }else{
      this.props.history.push(`${this.props.match.url}/${relation.id}`);
    }
  }

  render() {
    let collection = this.props.block
    if (!collection){
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
            alignItems: "center",
            backgroundColor: '#ffffff'
          }}
        >
          <CircularProgress/>
        </Box>
      )
    }
    let relationName = this.props.match.params.relation;
    let relations = collection[relationName];
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
                <Typography>{translate(relationName)}</Typography>
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
                  onClick={() => {
                    this.props.history.goBack();
                  }}
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
            {relations.length === 0 && (
              <Alert severity="error" variant='filled'>
                {translate('نتیجه ای یافت نشد')}
              </Alert>
            )}
            {relations.length > 0 && (
              relations.map((relation, key) => {
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
                      onClick={this.relationPage.bind(this, relation)}
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
                            image={this.props.baseUrl + '/' + relation.icon}
                            title={relation.label}
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
                              {translate(relation.label)}
                            </Typography>
                            {relation.caption && (
                              <Typography variant="caption">
                                {translate(relation.caption)}
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
            <Route component={RelationItem} path={`${this.props.match.path}/:id`}/>
          </Switch>
        </Box>
      </Slide>
    )
  }
}

export default connect(mapStateToProps)(RelationItems);