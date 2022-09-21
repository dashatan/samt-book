import React from "react";
import {connect} from "react-redux";
import Axios from "axios";
import Store from "../../../../redux/store";
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
  MenuItem, TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import translate from "../../../../translate";
import {Add, Delete, MoreVert} from "@material-ui/icons";
import {pink} from "@material-ui/core/colors";
import CardMedia from "@material-ui/core/CardMedia";
import Alert from "@material-ui/lab/Alert";
import {Link, Route, Switch} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import AddNews from "./addNews";
import EditRelation from "../side-components/relation/edit";

const mapStateToProps = (state) => (
  {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    user: state.user,
    news: state.appNews,
    propsUpdated: state.propsUpdated,
  }
);
const StyledMenu = withStyles({
  paper: {minWidth: 150},
  list: {padding: 0},
})((props) => <Menu {...props} />);

class News extends React.Component {

  constructor(props) {
    Store.dispatch({
      type: "navTabValue",
      payload: 1,
    });
    super(props);
    this.state = {
      news: props.news ? props.news : [],
      deletingNews: [],
      noResults: '',
      deleteNewsDialog: false,
      openMenu: false,
      menuKey: '',
      menuAnchor: null,
      entirePageLoading: false,
      modifyingDialog: false,
      modifyingItemName: '',
      modifyingItemLabel: '',
      modifyingItemValue: '',
      modifyingCollection: [],
    }
  }

  componentDidMount() {
    this.getNews();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.propsUpdated) {
      this.setState({
        noResults: false,
        news: []
      })
      Store.dispatch({
        type: 'propsUpdated',
        payload: false
      });
      this.getNews();
    }
  }

  getNews = () => {
    const url = `${this.props.baseUrl}/api/news`;
    Axios.post(url, {userToken: this.props.userToken}).then(e => {
      Store.dispatch({
        type: 'appNews',
        payload: e.data.news.data
      })
      this.setState({
        news: e.data.news.data,
        noResults: e.data.news.data.length === 0,
      })
    }).catch(e => {
      console.log(e);
    })
  }

  deleteNews(news) {
    this.setState({
      entirePageLoading: true,
      openMenu: false,
      menuKey: null,
      deleteNewsDialog: false,
      deletingNews: [],
    });
    const url = this.props.baseUrl + "/api/profile/deleteCollection";
    Axios.post(url, {id: news.id})
    .then(() => {
      let news = this.props.news;
      news = news.filter((x) => x.id !== news.id);
      this.setState({
        entirePageLoading: false,
        news
      });
    })
    .catch((e) => {
      this.setState({entirePageLoading: false});
      console.log(e);
    });
  }

  editNews(news) {
    this.setState({
      openMenu: false,
      menuKey: null,
    });
    this.props.history.push({
      pathname: this.props.match.url + '/news/edit/' + news.id,
      state: {
        ...this.props.location.state,
        editingItem: news,
      }
    });
  }

  publish = (collection) => {
    this.setState({
      entirePageLoading: true,
      openMenu: false,
      menuKey: null,
    });
    const url = `${this.props.baseUrl}/api/profile/publish`;
    const data = {id: collection.id}
    Axios.post(url, data).then(e => {
      collection.published = e.data.published;
      let collections = this.props.news;
      let index = collections.findIndex(x => x.id === collection.id);
      collections[index] = collection;
      Store.dispatch({
        type: 'appNews',
        payload: collections
      });
      this.setState({
        entirePageLoading: false,
      });
    }).catch(e => {
      this.setState({
        entirePageLoading: false,
      });
      console.log(e);
    })
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
      let collections = this.props.news;
      let index = collections.findIndex(x => x.id === collection.id);
      collections[index] = collection;
      collections = collections.sort(function (a, b) {
        return a.sort - b.sort;
      })
      Store.dispatch({
        type: 'appNews',
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

  render() {
    return (
      <Box>
        {this.props.user && this.props.user.role === 'admin' && (
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
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Add/>}
                  component={Link}
                  to={this.props.match.url + "/addNew"}
                >
                  {translate("ثبت جدید")}
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
        )}
        {this.props.user && this.props.user.role === 'admin' && (
          <Box style={{height: 60}}/>
        )}
        <Box
          style={{
            padding: 10,
            height: this.props.user && this.props.user.role === 'admin' ? 'calc(100vh - 120px)' : 'calc(100vh - 60px)',
            overflowY: 'auto',
            backgroundColor: "#f0f8ff",
          }}
        >
          {this.state.news && this.state.news.map((news, key) => {
            return (
              <Card
                key={key}
                elevation={3}
                style={{
                  borderRadius: 20,
                  marginBottom: 40,
                  position: 'relative',
                }}
              >
                {this.props.user && this.props.user.role === 'admin' && (
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
                      left: 5,
                      top: 5,
                      boxShadow: "none",
                      backgroundColor: "rgba(255,255,255,0.5)",
                      zIndex: 10,
                    }}
                  >
                    <MoreVert/>
                  </Fab>
                )}
                {this.props.user && this.props.user.role === 'admin' && (
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
                    <MenuItem onClick={this.editNews.bind(this, news)}>
                      {/*<ListItemIcon><Edit/></ListItemIcon>*/}
                      <Typography>{translate("ویرایش")}</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.publish(news)
                      }}
                    >
                      {translate(news.published ? 'تعلیق' : "انتشار")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          modifyingDialog: true,
                          modifyingItemName: 'sort',
                          modifyingItemLabel: 'ترتیب نمایش',
                          modifyingItemValue: news.sort,
                          modifyingCollection: news,
                          openMenu: false,
                          menuKey: null,
                          menuAnchor: null,
                        })
                      }}
                    >
                      {translate('ترتیب نمایش')}
                      -
                      {news.sort}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          modifyingDialog: true,
                          modifyingItemName: 'page_view',
                          modifyingItemLabel: 'تعداد بازدید',
                          modifyingItemValue: news.page_view,
                          modifyingCollection: news,
                          openMenu: false,
                          menuKey: null,
                          menuAnchor: null,
                        })
                      }}
                    >
                      {translate("تعداد بازدید")}
                      -
                      {news.page_view}
                    </MenuItem>
                    <MenuItem
                      style={{
                        backgroundColor: pink.A400,
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        this.setState({
                          deletingNews: news,
                          deleteNewsDialog: true,
                          openMenu: false,
                          menuKey: null,
                        });
                      }}
                    >
                      <ListItemIcon style={{color: "#ffffff"}}><Delete/></ListItemIcon>
                      <Typography>{translate("حذف")}</Typography>
                    </MenuItem>
                  </StyledMenu>
                )}
                <ButtonBase
                  key={key}
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    flexFlow: 'column',
                  }}
                  component={Link}
                  onClick={() => {
                    Store.dispatch({
                      type: 'singleBlock',
                      payload: news
                    });
                  }}
                  to={`/s/nws/${news.id}`}
                >
                  <CardMedia
                    image={news.image}
                    title={news.label}
                    style={{
                      width: '100%',
                      height: 200,
                      backgroundSize: "cover",
                    }}
                  />
                  <Box style={{padding: 20}}>
                    {this.props.user.role === 'admin' && (
                      <Typography
                        variant="caption"
                        color={news.published ? 'primary' : 'secondary'}
                      >
                        {translate(news.published ? 'منتشر شده' : 'منتشر نشده')}
                      </Typography>
                    )}
                    <Typography
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: "right"
                      }}
                    >
                      {translate(news.label)}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: 14,
                        textAlign: "right"
                      }}
                    >
                      {translate(news.dsc.length > 300 ? news.dsc.substring(0, 300) + '...' : news.dsc)}
                    </Typography>
                  </Box>
                </ButtonBase>
              </Card>
            );
          })}
          {this.state.news && this.state.news.length === 0 && !this.state.noResults && (
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
        <Dialog
          open={this.state.deleteNewsDialog}
          onClose={() => {
            this.setState({deleteNewsDialog: false});
          }}
        >
          <DialogTitle>
            <Typography style={{fontSize: 16}}>
              {translate("آیا از حذف این خبر اطمینان دارید ؟")}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography color="error" style={{fontSize: 11}}>
              {this.state.deletingNews.label +
              " " +
              translate(
                "و تمام متعلقات آن حذف خواهند شد و دیگر قابل برگشت نخواهند بود"
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.deleteNews.bind(this, this.state.deletingNews)}
              color="secondary"
            >
              {translate("بله،حذف شود")}
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  deleteNewsDialog: false,
                  deletingNews: [],
                });
              }}
              color="primary"
            >
              {translate("بازگشت")}
            </Button>
          </DialogActions>
        </Dialog>
        <Switch>
          <Route component={AddNews} path={this.props.match.path + "/addNew"}/>
          <Route component={EditRelation} path={`${this.props.match.path}/:name/edit/:id`}/>
        </Switch>
        <Backdrop
          addEndListener={(e) => {
          }}
          open={this.state.entirePageLoading} style={{
          zIndex: 100000,
          color: "#ffffff"
        }}
        >
          <CircularProgress color="inherit"/>
        </Backdrop>
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
        <Box style={{height: 60}}/>
      </Box>
    )
  }

}

export default connect(mapStateToProps)(News);