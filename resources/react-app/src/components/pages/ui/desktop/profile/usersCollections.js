import React from "react";
import {
  Backdrop,
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  TextField,
} from "@material-ui/core";
import {green, pink, yellow} from "@material-ui/core/colors";
import {connect} from "react-redux";
import translate from "../../../../translate";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import {Skeleton} from "@material-ui/lab";
import Store from "../../../../redux/store";
import Button from "@material-ui/core/Button";
import {Add, Delete, MoreVert} from "@material-ui/icons";
import {Link, Route, Switch, withRouter} from "react-router-dom";
import AddNew from "./addNew";
import {withStyles} from "@material-ui/core/styles";
import editCollection from "./editCollection";
import Alert from "@material-ui/lab/Alert";
import {debounce} from "lodash";
import InputAdornment from "@material-ui/core/InputAdornment";
import $ from "jquery";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
    collections: state.collectionsOfCurrentUser,
    propsUpdated: state.propsUpdated,
    EditingCollection: state.EditingCollection,
    editingCollectionUpdated: state.editingCollectionUpdated,
    idps: state.idps,
    ftzs: state.ftzs,
    exbs: state.exbs,
  };
};

const StyledMenu = withStyles({
  paper: {minWidth: 150},
  list: {padding: 0},
})(props => <Menu {...props} />);

let lang = Store.getState().lang;

class UsersCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collectionsOfCurrentUser: [],
      noResult: false,
      searchNoResult: false,
      collectionsSkeleton: false,
      openMenu: false,
      menuKey: null,
      menuAnchor: null,
      entirePageLoading: false,
      deletingCollection: [],
      deleteCollectionDialog: false,
      searchText: '',
      searchInputLoading: false,
      page: 1,
      scroll: false,
      modifyingDialog: false,
      modifyingItemName: '',
      modifyingItemLabel: '',
      modifyingItemValue: '',
      modifyingCollection: [],
      textFieldFocused: false,
      focusedTextFieldId: '',
      focusedTextFieldOffset: 0,
    };

    this.searchTextOnChangeDebounced = debounce(this.searchTextOnChangeDebounced, 500)
  }

  componentDidMount() {
    !this.props.collections && this.getCollectionsOfCurrentUser();
    this.props.collections && this.props.collections.length === 0 && this.setState({noResult: true});
    !this.props.idps && this.getIdps();
    !this.props.ftzs && this.getFtzs();
    !this.props.exbs && this.getExbs();
    let scrollElement = document.getElementById('profile');
    scrollElement.onscroll = () => {
      this.infScroll();
    };
  }

  getIdps = () => {
    const url = this.props.baseUrl + "/api/idps";
    Axios.post(url)
    .then((e) => {
      Store.dispatch({
        type: "idps",
        payload: e.data
      });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  getFtzs = () => {
    const url = this.props.baseUrl + "/api/ftzs";
    Axios.post(url)
    .then((e) => {
      Store.dispatch({
        type: "ftzs",
        payload: e.data
      });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  getExbs = () => {
    const url = this.props.baseUrl + "/api/exbs";
    Axios.post(url)
    .then((e) => {
      Store.dispatch({
        type: "exbs",
        payload: e.data
      });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.propsUpdated) {
      Store.dispatch({
        type: 'collectionsOfCurrentUser',
        payload: []
      });
      this.getCollectionsOfCurrentUser('', 1);
      Store.dispatch({
        type: "propsUpdated",
        payload: false
      });
    }
    let scrollElement = $("#profile");
    if (this.state.textFieldFocused) {
      let anchorElement = $(`#${this.state.focusedTextFieldId}`);
      scrollElement.scrollTo(anchorElement, {offset: this.state.focusedTextFieldOffset});
    }
  }

  getCollectionsOfCurrentUser = (text, page) => {
    let searchText = text || '';
    page = page || this.state.page;
    let collections = this.props.collections ? this.props.collections : [];
    this.setState({collectionsSkeleton: true});
    const url = this.props.baseUrl + "/api/profile/collectionsOfCurrentUser";
    Axios.post(url, {
      userToken: this.props.userToken,
      searchText,
      page,
    })
    .then((e) => {
      collections = page > 1 ? collections.concat(e.data.data) : e.data.data;
      Store.dispatch({
        type: "collectionsOfCurrentUser",
        payload: collections
      });
      this.setState({
        noResult: collections.length === 0 && searchText.length === 0,
        searchNoResult: collections.length === 0 && searchText.length > 0,
        collectionsSkeleton: false,
        searchInputLoading: false,
        scroll: e.data.data.length >= e.data.per_page,
        page: e.data.data.length >= e.data.per_page ? page + 1 : page,
      });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  deleteCollection(collection) {
    this.setState({
      entirePageLoading: true,
      openMenu: false,
      menuKey: null,
      deleteCollectionDialog: false,
      deletingCollection: [],
    });
    const url = this.props.baseUrl + "/api/profile/deleteCollection";
    Axios.post(url, {id: collection.id})
    .then(() => {
      let collections = this.props.collections;
      collections = collections.filter((x) => x.id !== collection.id);
      Store.dispatch({
        type: "collectionsOfCurrentUser",
        payload: collections
      });
      this.setState({
        entirePageLoading: false,
        noResult: collections.length === 0 && this.state.searchText.length === 0,
        searchNoResult: collections.length === 0 && this.state.searchText.length > 0,
      });
    })
    .catch((e) => {
      this.setState({entirePageLoading: false});
      console.log(e);
    });
  }

  search = (e) => {
    let searchText = e.target.value;
    this.setState({searchText});
    this.searchTextOnChangeDebounced(searchText);
  }

  searchTextOnChangeDebounced = (searchText) => {
    if (searchText.length > 3 || searchText.length === 0) {
      this.setState({
        searchInputLoading: true,
      })
      this.getCollectionsOfCurrentUser(searchText, 1);
    }
  }

  publish(collection) {
    this.setState({
      entirePageLoading: true,
      openMenu: false,
      menuKey: null,
    });
    const url = `${this.props.baseUrl}/api/profile/publish`;
    const data = {id: collection.id}
    Axios.post(url, data).then(e => {
      collection.published = e.data.published;
      let collections = this.props.collections;
      let index = collections.findIndex(x => x.id === collection.id);
      collections[index] = collection;
      Store.dispatch({
        type: 'collectionsOfCurrentUser',
        payload: collections
      });
      this.setState({
        entirePageLoading: false,
      });
    }).catch(e => {
      console.log(e);
    })
  }

  display(collection) {
    this.props.history.push(`/s/${collection.class}/${collection.id}`);
    Store.dispatch({
      type: 'singleBlock',
      payload: collection,
    })
  }

  infScroll = () => {
    if (this.state.scroll) {
      let scrollElement = document.querySelector('#profile');
      let scrollHeight = scrollElement.scrollTop + scrollElement.clientHeight;
      let pageBottomHeight = scrollElement.scrollHeight;
      if (scrollHeight >= pageBottomHeight - 600) {
        this.setState({scroll: false});
        this.getCollectionsOfCurrentUser();
      }
    }
  };

  handleClick = (collection) => {
    if (this.canEdit(collection, this.props.user)) {
      let url = `${this.props.match.url}/edit/${collection.class}/${collection.id}`;
      Store.dispatch({
        type: "EditingCollection",
        payload: collection,
      });
      this.props.history.push({
        pathname: url,
        state: {
          editingItem: collection,
        }
      })
    }


  }

  canDelete = (collection, user) => {
    return ['admin'].includes(this.props.user.role)
      || collection.user_id === user.id
      || collection.created_by === user.id
  }

  canEdit = (collection, user) => {
    return ['admin', 'editor'].includes(this.props.user.role)
      || collection.user_id === user.id
      || collection.created_by === user.id
  }

  modify = () => {
    this.setState({
      entirePageLoading: true,
    });
    const url = `${this.props.baseUrl}/api/profile/modify`;
    const data = {
      modelName: 'Collection',
      modelId: this.state.modifyingCollection.id,
      itemName: this.state.modifyingItemName,
      itemValue: this.state.modifyingItemValue,
    }
    Axios.post(url, data).then(e => {
      let collection = this.state.modifyingCollection;
      let itemName = this.state.modifyingItemName;
      collection[itemName] = e.data[itemName];
      let collections = this.props.collections;
      let index = collections.findIndex(x => x.id === collection.id);
      collections[index] = collection;
      collections = collections.sort(function (a, b) {
        return a.sort - b.sort;
      })
      Store.dispatch({
        type: 'collectionsOfCurrentUser',
        payload: collections
      });
      this.setState({
        entirePageLoading: false,
        modifyingDialog: false,
        modifyingItemName: '',
        modifyingItemLabel: '',
        modifyingItemValue: '',
        modifyingCollection: [],
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        entirePageLoading: false,
        modifyingDialog: false,
        modifyingItemName: '',
        modifyingItemLabel: '',
        modifyingItemValue: '',
        modifyingCollection: [],
      });
    })
  }

  handleFocus(id, offset) {
    this.setState({
      textFieldFocused: true,
      focusedTextFieldId: id,
      focusedTextFieldOffset: offset,
    })
  }

  handleBlur = () => {
    this.setState({
      textFieldFocused: false,
      focusedTextFieldId: '',
      focusedTextFieldOffset: 0,
    })
  }

  render() {
    let canPublish = ['admin', 'editor'].includes(this.props.user.role);
    return (
      <Box style={{padding: 10, position: 'relative', top: -60}}>
        {!this.props.collections || !this.state.noResult && (
          <Box style={{padding: "10px 40px"}}>
            <TextField
              value={this.state.searchText}
              onChange={this.search}
              variant="standard"
              type="search"
              size="small"
              fullWidth
              placeholder={translate("جستجو")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {this.state.searchInputLoading
                      ? <CircularProgress size={14}/>
                      : ''
                    }
                  </InputAdornment>
                )
              }}
              id="search-text-field"
              onFocus={this.handleFocus.bind(this, 'search-text-field', -20)}
              onBlur={this.handleBlur}
            />
          </Box>
        )}
        {this.state.searchNoResult && (
          <Box style={{padding: 10}}>
            <Alert severity="error" variant="filled">
              {translate('نتیجه ای یافت نشد')}
            </Alert>
          </Box>
        )}
        {this.props.collections
        && this.props.collections.length > 0
        && !this.state.textFieldFocused
        && (
          <Box style={{padding: "10px 40px"}}>
            <Box
              style={{
                width: "100%",
                position: "fixed",
                left: 0,
                bottom: 65,
                zIndex: 100,
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
                to={this.props.match.path + "/addNew/step1"}
              >
                {translate("ثبت جدید")}
              </Button>
            </Box>
          </Box>
        )}
        <Box style={{marginTop: 20}}>
          {this.props.collections &&
          this.props.collections.map((collection, key) => {
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
                    left: ['fa', 'ar', ''].includes(lang) ? 0 : 'auto',
                    right: ['fa', 'ar', ''].includes(lang) ? 'auto' : 0,
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
                      menuKey: null
                    });
                  }}
                >
                  <MenuItem onClick={this.display.bind(this, collection)}>{translate("نمایش")}</MenuItem>
                  {canPublish && (
                    <MenuItem onClick={this.publish.bind(this, collection)}>
                      {translate(collection.published ? 'تعلیق' : "انتشار")}
                    </MenuItem>
                  )}
                  {this.props.user.role === 'admin' && (
                    <Box>
                      <MenuItem
                        onClick={() => {
                          this.setState({
                            modifyingDialog: true,
                            modifyingItemName: 'sort',
                            modifyingItemLabel: 'ترتیب نمایش',
                            modifyingItemValue: collection.sort,
                            modifyingCollection: collection,
                            openMenu: false,
                            menuKey: null,
                            menuAnchor: null,
                          })
                        }}
                      >
                        {translate('ترتیب نمایش')}
                        -
                        {collection.sort}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          this.setState({
                            modifyingDialog: true,
                            modifyingItemName: 'page_view',
                            modifyingItemLabel: 'تعداد بازدید',
                            modifyingItemValue: collection.page_view,
                            modifyingCollection: collection,
                            openMenu: false,
                            menuKey: null,
                            menuAnchor: null,
                          })
                        }}
                      >
                        {translate("تعداد بازدید")}
                        -
                        {collection.page_view}
                      </MenuItem>
                    </Box>
                  )}
                  {this.canDelete(collection, this.props.user) && (
                    <MenuItem
                      style={{
                        backgroundColor: pink.A400,
                        color: "#ffffff"
                      }}
                      onClick={() => {
                        this.setState({
                          deletingCollection: collection,
                          deleteCollectionDialog: true,
                          openMenu: false,
                          menuKey: null,
                        });
                      }}
                    >
                      <ListItemIcon style={{color: "#ffffff"}}>
                        <Delete/>
                      </ListItemIcon>
                      <Typography>{translate("حذف")}</Typography>
                    </MenuItem>
                  )}
                </StyledMenu>
                <ButtonBase
                  key={key}
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    textAlign: ['fa', 'ar', ''].includes(lang) ? 'right' : 'left',
                  }}
                  onClick={() => {
                    this.handleClick(collection);
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
                        image={collection.image}
                        title={collection.title}
                        style={{
                          borderRadius: "50%",
                          width: 80,
                          height: 80,
                          backgroundSize: "cover",
                        }}
                      />
                    </Grid>
                    <Grid
                      item xs={6} style={{
                      display: "flex",
                      flexFlow: "column",
                      justifyContent: "space-around",
                      alignItems: 'baseline',
                    }}
                    >
                      <Typography style={{fontSize: 14}}>{collection.title}</Typography>
                      <Chip
                        label={translate(collection.info.singular)}
                        color="primary"
                        style={{
                          height: 20,
                          fontSize: 10,
                          backgroundColor: collection.published ? green.A700 : pink.A400,
                        }}
                      />
                    </Grid>
                  </Grid>
                </ButtonBase>
              </Paper>
            );
          })}
        </Box>
        {this.state.noResult && (
          <Box
            style={{
              display: "flex",
              flexFlow: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={this.props.baseUrl + "/images/icons/special-flat/island.svg"} height={250} alt="no-collection"/>
            <Typography
              style={{
                color: yellow["900"],
                marginTop: 10
              }}
            >
              {translate("شما هنوز هیچ مجموعه ای ثبت نکرده اید")}!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{
                backgroundColor: green.A700,
                marginTop: 20,
                marginBottom: 20,
                width: "100%",
                borderRadius: 100,
              }}
              startIcon={<Add/>}
              component={Link}
              to={this.props.match.url + "/addNew/step1"}
            >
              {translate("ثبت اولین مجموعه")}
            </Button>
          </Box>
        )}
        {this.state.collectionsSkeleton &&
        [...Array(8)].map((x, i) => {
          return (
            <Skeleton
              key={i} variant="rect" height={100} style={{
              margin: "10px 0",
              borderRadius: 20
            }} animation="wave"
            />
          );
        })}
        <Switch>
          <Route path={this.props.match.path + "/addNew"} component={AddNew}/>
          <Route path={this.props.match.path + "/edit/:class/:id"} component={editCollection}/>
        </Switch>
        <Backdrop
          open={this.state.entirePageLoading} style={{
          zIndex: 1000,
          color: "#ffffff"
        }}
        >
          <CircularProgress color="inherit"/>
        </Backdrop>
        <Dialog
          open={this.state.deleteCollectionDialog}
          onClose={() => {
            this.setState({deleteCollectionDialog: false});
          }}
        >
          <DialogTitle>
            <Typography style={{fontSize: 16}}>{translate("آیا از حذف این مورد اطمینان دارید ؟")}</Typography>
          </DialogTitle>
          <DialogContent>
            <Typography color="error" style={{fontSize: 11}}>
              {this.state.deletingCollection.title +
              " " +
              translate("و تمام متعلقات آن حذف خواهند شد و دیگر قابل برگشت نخواهند بود")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteCollection.bind(this, this.state.deletingCollection)} color="secondary">
              {translate("بله،حذف شود")}
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  deleteCollectionDialog: false,
                  deletingCollection: []
                });
              }}
              color="primary"
            >
              {translate("بازگشت")}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.modifyingDialog}
          onClose={() => {
            this.setState({modifyingDialog: false});
          }}
        >
          <DialogTitle>
            <Typography style={{fontSize: 16}}>{translate(this.state.modifyingItemLabel)}</Typography>
            <Typography style={{fontSize: 11}}>
              {this.state.modifyingCollection.title}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.modifyingItemValue}
              name={this.state.modifyingItemName}
              label={this.state.modifyingItemLabel}
              type={'number'}
              onChange={(e) => {
                this.setState({modifyingItemValue: e.target.value})
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({
                  modifyingDialog: false,
                });
                this.modify();
              }} variant={'contained'} color="primary"
            >
              {translate("ذخیره")}
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  modifyingDialog: false,
                  modifyingItemName: '',
                  modifyingItemLabel: '',
                  modifyingItemValue: '',
                  modifyingCollection: [],
                });
              }}
              color="secondary"
            >
              {translate("بازگشت")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

export default withRouter(connect(mapStateToProps)(UsersCollections));
