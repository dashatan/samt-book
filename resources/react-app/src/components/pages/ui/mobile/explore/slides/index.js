import React from "react";
import {connect} from "react-redux";
import camelToSnake from "../../../../../camelToSnake";
import Axios from "axios";
import Store from "../../../../../redux/store";
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Slide,
  Toolbar,
  Typography
} from "@material-ui/core";
import translate from "../../../../../translate";
import {Add, Close, Delete, MoreVert} from "@material-ui/icons";
import {green, pink} from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Alert from "@material-ui/lab/Alert";
import AddNewSlide from "./addNewSlide";
import EditSlide from "./editSlide";
import {Link, Route, Switch} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

const mapStateToProps = (state) => (
  {
    baseUrl: state.baseUrl,
    filterItems: state.filterItems,
    propsUpdated: state.propsUpdated,
  }
);
const StyledMenu = withStyles({
  paper: {minWidth: 150},
  list: {padding: 0},
})((props) => <Menu {...props} />);

const lang = Store.getState().lang;

class Slides extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      deletingSlide: [],
      noResults: '',
      deleteSlideDialog: false,
      entirePageLoading: false,
      openMenu: false,
      menuKey: '',
      menuAnchor: null,
    }
  }

  componentDidMount() {
    this.getSlides();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.propsUpdated) {
      this.setState({
        noResults: false,
        slides: []
      })
      Store.dispatch({
        type: 'propsUpdated',
        payload: false
      });
      this.getSlides();
    }
  }

  getSlides = () => {
    const url = `${this.props.baseUrl}/api/explore/slides`;
    const data = {};
    let filterItems = this.props.filterItems;
    filterItems.map(item => {
      if (!['insideOfIdp', 'outsideOfIdp', 'insideOfFtz', 'outsideOfFtz'].includes(item.name)) {
        data[camelToSnake(item.name)] = item.value;
      }
    })
    data.is_in_idp = filterItems.find((x) => x.name === "insideOfIdp").value ? true
      : filterItems.find((x) => x.name === "outsideOfIdp").value ? false : null;
    data.is_in_ftz = filterItems.find((x) => x.name === "insideOfFtz").value ? true
      : filterItems.find((x) => x.name === "outsideOfFtz").value ? false : null;
    Axios.post(url, data).then(e => {
      this.setState({
        slides: e.data.slides,
        noResults: e.data.slides.length === 0,
      })
    }).catch(e => {
      console.log(e);
    })
  }

  deleteSlide(slide) {
    this.setState({
      entirePageLoading: true,
      openMenu: false,
      menuKey: null,
      deleteSlideDialog: false,
      deletingSlide: [],
    });
    const url = this.props.baseUrl + "/api/profile/deleteRelation";
    Axios.post(url, {
      id: slide.id,
      modelName: 'Slide'
    })
    .then(() => {
      let slides = this.props.slides;
      slides = slides.filter((x) => x.id !== slide.id);
      this.setState({
        entirePageLoading: false,
        slides,
      });
    })
    .catch((e) => {
      this.setState({entirePageLoading: false});
      console.log(e);
    });
  }

  render() {
    return (
      <Slide in={true} direction="left">
        <Box
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: "100vh",
            zIndex: 10000,
            backgroundColor: "#ffffff",
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
                <Typography>{translate('اسلایدها')}</Typography>
              </Box>
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
                    this.props.history.push("/explore");
                  }}
                />
              </Fab>
            </Toolbar>
          </AppBar>
          <Box style={{height: 60}}/>
          <Box
            style={{
              padding: 10,
              height: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            {this.state.slides && this.state.slides.map((slide, key) => {
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
                        menuAnchor: e.currentTarget,
                      });
                    }}
                    style={{
                      position: "absolute",
                      left: ['fa', 'ar', ''].includes(lang) ? 0 : 'auto',
                      right: ['fa', 'ar', ''].includes(lang) ? 'auto' : 0,
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      zIndex: 10,
                    }}
                  >
                    <MoreVert/>
                  </Fab>
                  <StyledMenu
                    style={{zIndex: 10000}}
                    anchorEl={this.state.menuAnchor}
                    open={this.state.openMenu && this.state.menuKey === key}
                    onClose={() => {
                      this.setState({
                        openMenu: false,
                        menuKey: null,
                        menuAnchor: null,
                      });
                    }}
                  >
                    <MenuItem
                      style={{
                        backgroundColor: pink.A400,
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        this.setState({
                          deletingSlide: slide,
                          deleteSlideDialog: true,
                          openMenu: false,
                          menuKey: null,
                          menuAnchor: null,
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
                    component={Link}
                    to={{
                      pathname: `${this.props.match.url}/edit/${slide.id}`,
                      state: {
                        ...this.props.location.state,
                        editingSlide: slide,
                      }
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
                        {slide.mime_type === 'image' && (
                          <CardMedia
                            image={slide.image}
                            title={slide.label}
                            style={{
                              borderRadius: "50%",
                              width: 80,
                              height: 80,
                              backgroundSize: "cover",
                            }}
                          />
                        )}
                        {slide.mime_type === 'video' && (
                          <Paper
                            elevation={3}
                            style={{
                              borderRadius: '50%',
                              width: 80,
                              height: 80,
                              overflow: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <video src={slide.video} style={{width: '100%'}}/>
                          </Paper>
                        )}

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
                            {translate(slide.label)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </ButtonBase>
                </Paper>
              );
            })}
            {this.state.slides && this.state.slides.length === 0 && !this.state.noResults && (
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
                <Alert variant="filled" severity="error">
                  {translate("نتیجه ای یافت نشد")}
                </Alert>
              </Box>
            )}
          </Box>
          <Box style={{height: 60}}/>
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
          <Dialog
            style={{zIndex:10000}}
            open={this.state.deleteSlideDialog}
            onClose={() => {
              this.setState({deleteSlideDialog: false});
            }}
          >
            <DialogTitle>
              <Typography style={{fontSize: 16}}>
                {translate("آیا از حذف این اسلاید اطمینان دارید ؟")}
              </Typography>
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={this.deleteSlide.bind(this, this.state.deletingSlide)}
                color="secondary"
              >
                {translate("بله،حذف شود")}
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    deleteSlideDialog: false,
                    deletingSlide: [],
                  });
                }}
                color="primary"
              >
                {translate("بازگشت")}
              </Button>
            </DialogActions>
          </Dialog>
          <Switch>
            <Route component={AddNewSlide} path={this.props.match.path + "/addNew"}/>
            <Route component={EditSlide} path={this.props.match.path + "/edit/:id"}/>
          </Switch>
          <Backdrop
            addEndListener={() => {
            }}
            open={this.state.entirePageLoading} style={{
            zIndex: 100000,
            color: "#ffffff"
          }}
          >
            <CircularProgress color="inherit"/>
          </Backdrop>
        </Box>
      </Slide>
    )
  }

}

export default connect(mapStateToProps)(Slides);