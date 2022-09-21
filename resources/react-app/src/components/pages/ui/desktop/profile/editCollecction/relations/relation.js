import React from "react";
import {connect} from "react-redux";
import {
  AppBar,
  Backdrop,
  Box,
  ButtonBase,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom";
import {Add, ArrowBack, Delete, MoreVert} from "@material-ui/icons";
import translate from "../../../../../../translate";
import Axios from "axios";
import {green, pink} from "@material-ui/core/colors";
import Store from "../../../../../../redux/store";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import {withStyles} from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import {Route, Switch} from "react-router";
import AddNewRelation from "./addNewRelation";
import Pluralize from 'pluralize';
import EditRelation from "./editRelation";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    EditingCollection: state.EditingCollection,
    relations: state.relations,
    propsUpdated: state.propsUpdated,
  };
};

const StyledMenu = withStyles({
  paper: {minWidth: 150},
  list: {padding: 0},
})((props) => <Menu {...props} />);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Relation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EditingItemRelations: [],
      deletingRelation: [],
      deleteRelationDialog: false,
      openMenu: false,
      menuKey: null,
      menuAnchor: null,
      noResults: false,
      entirePageLoading: false,
    };
  }

  componentDidMount() {
    this.getRelationItems();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.propsUpdated) {
      this.getRelationItems();
      Store.dispatch({
        type: 'propsUpdated',
        payload: false
      });
    }
  }

  editRelation(relation) {
    if (relation.hasRelation){
      Store.dispatch({
        type: "EditingCollection",
        payload: relation,
      });
      Store.dispatch({
        type: "EditingCollectionChanged",
        payload: true,
      });
        this.props.history.push(`/profile/edit/${relation.class}/${relation.id}`)
    }else{
      Store.dispatch({
        type: "EditingRelation",
        payload: relation,
      });
      this.props.history.push(`${this.props.match.url}/edit/${relation.id}`)
    }

  }

  deleteRelation(relation) {
    this.setState({
      entirePageLoading: true,
      openMenu: false,
      menuKey: null,
      deleteRelationDialog: false,
      deletingRelation: [],
    });
    const url = this.props.baseUrl + "/api/profile/deleteRelation";
    Axios.post(url, {
      modelName: capitalizeFirstLetter(Pluralize.singular(this.props.match.params.relation)),
      id: relation.id,
    }).then((e) => {
      let relations = this.state.EditingItemRelations;
      relations = relations.filter((x) => x.id !== relation.id);
      this.setState({
        EditingItemRelations: relations,
        entirePageLoading: false,
      });
    }).catch((e) => {
      this.setState({entirePageLoading: false});
      console.log(e);
    });
  }

  getRelationItems = () => {
    const url = this.props.baseUrl + "/api/profile/getRelationItems";
    const data = {
      id: this.props.match.params.id,
      relation: this.props.match.params.relation,
    };
    Axios.post(url, data).then((e) => {
      this.setState({
        EditingItemRelations: e.data,
        noResults: e.data.length === 0,
      });
    }).catch((e) => {
      console.log(e);
    });
  };

  render() {
    if (!this.props.EditingCollection || this.props.propsUpdated) {
      return (
        <Box style={{
          paddingTop: 80,
          height: "calc(100vh - 60px)",
          textAlign: "center",
        }}>
          <CircularProgress color="primary"/>
        </Box>
      );
    }
    let relation = this.props.relations.find((x) => x.name === this.props.match.params.relation);
    return (
      <Box
        style={{
          height: "100vh",
          position: "fixed",
          width: "100%",
          top: 0,
          right: 0,
          zIndex: 10000,
          backgroundColor: "#ffffff",
        }}>
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
              <Typography>{translate(relation.label)}</Typography>
              <Typography variant="caption">
                {this.props.EditingCollection.label}
              </Typography>
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
        <Box style={{padding: '80px 10px 10px 10px'}}>
          {this.state.EditingItemRelations.map((collection, key) => {
            return (
              <Paper
                key={key}
                elevation={3}
                style={{
                  /* width: "100%",*/
                  position: "relative",
                  height: 100,
                  borderRadius: 20,
                  display: "flex",
                  marginBottom: 20,
                }}
              >
                <Fab
                  variant="round"
                  size="medium"
                  color="inherit"
                  onClick={(e) => {
                    this.setState({
                      openMenu: true,
                      menuKey: key,
                      menuAnchor: e.target,
                    });
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    zIndex: 10,
                  }}
                >
                  <MoreVert/>
                </Fab>
                <StyledMenu
                  anchorEl={this.state.menuAnchor}
                  open={this.state.openMenu && this.state.menuKey === key}
                  onClose={() => {
                    this.setState({
                      openMenu: false,
                      menuKey: null,
                    });
                  }}
                >
                  {["products", "wantads", "news"].includes(relation.name) && (
                    <MenuItem>
                      {translate("نمایش")}
                    </MenuItem>
                  )}
                  {["products", "wantads", "news"].includes(
                    relation.name
                  ) && (
                    <MenuItem>
                      {translate("انتشار")}
                    </MenuItem>
                  )}
                  <MenuItem
                    style={{
                      backgroundColor: pink.A400,
                      color: "#ffffff",
                    }}
                    onClick={() => {
                      this.setState({
                        deletingRelation: collection,
                        deleteRelationDialog: true,
                        openMenu: false,
                        menuKey: null,
                      });
                    }}
                  >
                    <ListItemIcon
                      style={{color: "#ffffff"}}
                    >
                      <Delete/>
                    </ListItemIcon>
                    <Typography>
                      {translate("حذف")}
                    </Typography>
                  </MenuItem>
                </StyledMenu>
                <ButtonBase
                  key={key}
                  style={{
                    width: "100%",
                    borderRadius: 20,
                  }}
                  onClick={this.editRelation.bind(this, collection)}
                  // component={Link}
                  // to={collection.hasRelation
                  //   ? `profile/edit/${collection.class}/${collection.id}`
                  //   : `${this.props.match.url}/edit/${collection.id}`
                  // }
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
                      {collection.type === 'video'
                        ? <Paper elevation={3}
                                 style={{
                                   borderRadius: '50%',
                                   width: 80,
                                   height: 80,
                                   overflow: 'hidden',
                                   display: 'flex',
                                   justifyContent: 'center',
                                   alignItems: 'center'
                                 }}>
                          <video src={collection.video} style={{width: '100%',}}/>
                        </Paper>
                        : <CardMedia
                          image={this.props.baseUrl + '/' + collection.icon}
                          title={collection.label}
                          style={{
                            borderRadius: "50%",
                            width: 80,
                            height: 80,
                            backgroundSize: "cover",
                          }}
                        />
                      }

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
                          {translate(collection.label)}
                        </Typography>
                        {collection.caption && (
                          <Typography variant='caption'>
                            {translate(collection.caption)}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </ButtonBase>
              </Paper>
            );
          })}
          {this.state.EditingItemRelations.length === 0 && !this.state.noResults && (
            <Container
              style={{
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              <CircularProgress/>
            </Container>
          )}
          {this.state.noResults && (
            <Box style={{padding: 10}}>
              {/*<img src={this.props.baseUrl + '/icons/special-flat/loupe.svg'} alt='no-results' style={{height: 200}}/>*/}
              <Alert variant="filled" severity="error">
                {translate("نتیجه ای یافت نشد")}
              </Alert>
            </Box>
          )}
        </Box>
        <Box
          style={{
            width: "100%",
            position: "fixed",
            left: 0,
            bottom: 10,
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{
              backgroundColor: green.A700,
              height: 40,
              width: 180,
              borderRadius: 100,
            }}
            startIcon={<Add/>}
            component={Link}
            to={this.props.match.url + "/addNew"}
          >
            {translate("ثبت جدید")}
          </Button>
        </Box>
        <Switch>
          <Route component={AddNewRelation} path={this.props.match.path + "/addNew"}/>
          <Route component={EditRelation} path={this.props.match.path + "/edit/:id"}/>
        </Switch>
        <Backdrop
          open={this.state.entirePageLoading}
          style={{
            zIndex: 100000,
            color: "#ffffff",
          }}
        >
          <CircularProgress color="inherit"/>
        </Backdrop>
        <Dialog
          open={this.state.deleteRelationDialog}
          onClose={() => {
            this.setState({deleteRelationDialog: false});
          }}
        >
          <DialogTitle>
            <Typography style={{fontSize: 16}}>
              {translate("آیا از حذف این مورد اطمینان دارید ؟")}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography color="error" style={{fontSize: 11}}>
              {this.state.deletingRelation.label +
              " " +
              translate(
                "و تمام متعلقات آن حذف خواهند شد و دیگر قابل برگشت نخواهند بود"
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.deleteRelation.bind(
                this,
                this.state.deletingRelation
              )}
              color="secondary"
            >
              {translate("بله،حذف شود")}
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  deleteRelationDialog: false,
                  deletingRelation: [],
                });
              }}
              color="primary"
            >
              {translate("بازگشت")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Relation));
