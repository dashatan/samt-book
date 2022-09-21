import React from "react";
import {connect} from "react-redux";
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
  DialogContent,
  DialogTitle,
  Fab,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import translate from "../../../../../translate";
import {Add, Close, Delete, MoreVert} from "@material-ui/icons";
import {green, pink} from "@material-ui/core/colors";
import {Link, Route, Switch} from "react-router-dom";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import {withStyles} from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Store from "../../../../../redux/store";
import EditUser from "./editUser";
import AddNewUser from "./addNewUser";

const mapStateToProps = state => {
  return {
    propsUpdated: state.propsUpdated,
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    user: state.user
  };
};

const StyledMenu = withStyles({
  paper: {minWidth: 150},
  list: {padding: 0},
})((props) => <Menu {...props} />);

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersToShow: [],
      deletingUser: [],
      openMenu: false,
      menuKey: '',
      menuAnchor: null,
      noResults: '',
      searchText: '',
      deleteUserDialog: false,
      entirePageLoading: false,
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.propsUpdated) {
      this.setState({users: []});
      this.getUsers();
      Store.dispatch({
        type: 'propsUpdated',
        payload: false
      });
    }
  }

  getUsers = () => {
    const url = `${this.props.baseUrl}/api/profile/getUsers`;
    const data = {userToken: this.props.userToken};
    Axios.post(url, data).then(e => {
      let users = e.data;
      this.setState({
        users,
        usersToShow: users,
        noResults: users.length === 0,
      })
    }).catch(e => {
      console.log(e);
    })
  }

  deleteUser(user) {
    this.setState({
      entirePageLoading: true,
      openMenu: false,
      menuKey: null,
      deleteUserDialog: false,
      deletingUser: [],
    });
    const url = this.props.baseUrl + "/api/profile/deleteUser";
    Axios.post(url, {userId: user.id})
    .then(() => {
      let users = this.state.users;
      users = users.filter((x) => x.id !== user.id);
      this.setState({
        entirePageLoading: false,
        users,
        usersToShow: users,
      });
    })
    .catch((e) => {
      this.setState({entirePageLoading: false});
      console.log(e);
    });
  }

  editUser(user) {
    Store.dispatch({
      type: 'editingUser',
      payload: user
    });
    this.props.history.push(`${this.props.match.url}/edit/${user.id}`);
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
            zIndex: 1000,
            backgroundColor: "#ffffff",
            overflowY: 'auto',
            overflowX: 'hidden',
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
                <TextField
                  type="search"
                  value={this.state.searchText}
                  className="search-text"
                  placeholder={translate("جستجو")}
                  onChange={(e) => {
                    this.setState({
                      searchText: e.target.value,
                      usersToShow: this.state.users.filter(x => x.name.includes(e.target.value))
                    })
                    if (e.target.value.length === 0) {
                      this.setState({
                        usersToShow: this.state.users
                      })
                    }
                  }}
                />
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
                    this.props.history.push("/profile");
                  }}
                />
              </Fab>
            </Toolbar>
          </AppBar>
          <Box style={{height: 60}}/>
          <Box
            style={{padding: 10,}}
          >
            {this.state.usersToShow.map((user, key) => {
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
                    <MenuItem
                      style={{
                        backgroundColor: pink.A400,
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        this.setState({
                          deletingUser: user,
                          deleteUserDialog: true,
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
                    onClick={this.editUser.bind(this, user)}
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
                          image={user.avatar}
                          title={user.name}
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
                            {translate(user.name)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </ButtonBase>
                </Paper>
              );
            })}
            {this.state.users.length === 0 && !this.state.noResults && (
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
            {this.state.searchText.length > 0 && this.state.usersToShow.length === 0 && (
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
            open={this.state.deleteUserDialog}
            onClose={() => {
              this.setState({deleteUserDialog: false});
            }}
          >
            <DialogTitle>
              <Typography style={{fontSize: 16}}>
                {translate("آیا از حذف این کاربر اطمینان دارید ؟")}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography color="error" style={{fontSize: 11}}>
                {this.state.deletingUser.name +
                " " +
                translate(
                  "و تمام متعلقات آن حذف خواهند شد و دیگر قابل برگشت نخواهند بود"
                )}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.deleteUser.bind(this, this.state.deletingUser)}
                color="secondary"
              >
                {translate("بله،حذف شود")}
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    deleteUserDialog: false,
                    deletingUser: [],
                  });
                }}
                color="primary"
              >
                {translate("بازگشت")}
              </Button>
            </DialogActions>
          </Dialog>
          <Switch>
            <Route component={AddNewUser} path={this.props.match.path + "/addNew"}/>
            <Route component={EditUser} path={this.props.match.path + "/edit/:id"}/>
          </Switch>
          <Backdrop
            open={this.state.entirePageLoading} style={{
            zIndex: 100000,
            color: "#ffffff"
          }}
          >
            <CircularProgress color="inherit"/>
          </Backdrop>
        </Box>
      </Slide>
    );
  }
}

export default connect(mapStateToProps)(Users);
