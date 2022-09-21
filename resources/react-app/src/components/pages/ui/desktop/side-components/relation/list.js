import React, {useEffect, useState} from "react";
import {Link, useHistory, useLocation, useParams, useRouteMatch, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {
  AppBar,
  Backdrop,
  Box,
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
  Typography
} from "@material-ui/core";
import {Add, ArrowBack, Delete, MoreVert} from "@material-ui/icons";
import {withStyles} from "@material-ui/core/styles";
import translate from "../../../../../translate";
import Axios from "axios";
import pink from "@material-ui/core/colors/pink";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import ButtonBase from "@material-ui/core/ButtonBase";
import Button from "@material-ui/core/Button";
import {green} from "@material-ui/core/colors";
import {Route, Switch} from "react-router";
import AddNew from "./add-new";
import Store from "../../../../../redux/store";
import Slide from "@material-ui/core/Slide";
import Pluralize from "pluralize";
import capitalizeFirstLetter from "../../../../../extra-components/capitalizeFirstLetter";
import EditRelation from "./edit";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    deletingRelation: state.deletingRelation,
    relationProps: state.relationProps,
    propsUpdated: state.propsUpdated,
  }
}

const StyledMenu = withStyles({
  paper: {minWidth: 150},
  list: {padding: 0},
})((props) => <Menu {...props} />);

const lang = Store.getState().lang;

const List = (props) => {
  let {state} = useLocation();//داده های مورد نیازی که از طریق route باید فرستاده شود
  const {label, caption, imageBackGroundSize} = state;
  let {goBack, push} = useHistory();
  let {name} = useParams();
  let params = useParams();
  let {path, url} = useRouteMatch();
  let [noResults, setNoResults] = useState(false);
  let [list, setList] = useState([]);
  let [loading, setLoading] = useState(false);
  let [infScrollLoading, setInfScrollLoading] = useState(false);
  let [scroll, setScroll] = useState(false);
  let [page, setPage] = useState(1);
  let [entirePageLoading, setEntirePageLoading] = useState(false);
  let [menu, setMenu] = useState({
    open: false,
    anchor: null,
    key: 0,
    userId: 0
  });
  let [remove, setRemove] = useState({
    item: [],
    dialog: false
  });
  let role = props.user.role;
  let show = {
    showSinglePage: ["products", "wantads", "news"].includes(name),
    publish: ["products", "wantads", "news"].includes(name) && ['admin', 'editor'].includes(role),
    edit: menu.userId === props.user.id || role === 'admin',
    delete: menu.userId === props.user.id || role === 'admin',
  }
  let scrollElement = document.getElementById('relations-list-scroll-element');
  const currentUser = Store.getState().user;

  //mount
  useEffect(() => {
    fetchList();
  }, []);

  //update
  useEffect(() => {
    if (props.propsUpdated) {
      if (parseInt(params.id) === state.parentModelId || state.parentModelName === 'MyApp') {
        fetchList();
        Store.dispatch({
          type: 'propsUpdated',
          payload: false
        });
      }
    }
    if (scrollElement) {
      scrollElement.onscroll = () => {
        infScroll();
      };
    }
  })

  const infScroll = () => {
    if (scroll) {
      let scrollHeight = scrollElement.scrollTop + scrollElement.clientHeight;
      let pageBottomHeight = scrollElement.scrollHeight;
      if (scrollHeight >= pageBottomHeight - 600) {
        setScroll(false);
        fetchList();
      }
    }

  }

  const fetchList = (customPage) => {
    let dataPage = customPage || page;
    const url = state && state.fetchUrl || props.baseUrl + "/api/relations";
    const data = {
      parentModelName: state.parentModelName,
      parentModelId: state.parentModelId,
      relationName: name,
      page: dataPage,
    };
    if (dataPage > 1) {
      setInfScrollLoading(true);
    } else {
      setLoading(true);
    }
    Axios.post(url, data).then((e) => {
      setLoading(false);
      setInfScrollLoading(false);
      let newData;
      let perPage = null;
      if (e.data.data) {
        newData = e.data.data;
        perPage = e.data.per_page
      } else {
        newData = e.data;
      }
      let arr = [];
      if (!Array.isArray(newData)) {
        for (let i in newData) {
          if (newData.hasOwnProperty(i)) {
            arr.push(newData[i]);
          }
        }
        newData = arr
      }
      let data = dataPage > 1 ? list.concat(newData) : newData
      setList(data)
      setNoResults(data.length === 0)
      setScroll(perPage ? newData.length >= perPage : false)
      setPage(perPage ? newData.length >= perPage ? dataPage + 1 : dataPage : 1)
    }).catch((e) => {
      setLoading(false);
      setInfScrollLoading(false);
      console.log(e);
    })
  };

  const edit = (item) => {
    Store.dispatch({
      type: 'editingRelation',
      payload: item,
    })
    push({
      pathname: url + '/edit/' + item.id,
      state: {
        ...state,
        editingItem: item,
      }
    });
  }

  const deleteItem = () => {
    setEntirePageLoading(true);
    setMenu({
      open: false,
      key: null,
      anchor: null
    })
    setRemove({
      ...remove,
      dialog: false,
    })
    const url = props.baseUrl + "/api/profile/deleteRelation";
    Axios.post(url, {
      modelName: capitalizeFirstLetter(Pluralize.singular(name)),
      id: remove.item.id,
    }).then(() => {
      let newList = list.filter((x) => x.id !== remove.item.id);
      setEntirePageLoading(false);
      setList(newList);
    }).catch((e) => {
      setEntirePageLoading(false);
      console.log(e);
    });
  }

  function singleBlock(block) {
    push('/s/' + block.class + '/' + block.id)
  }

  function canPublish(block) {
    if (currentUser.role === 'admin'){
      return true;
    }
    return currentUser.id === block.user_id;
  }

  function publish(collection) {
    setEntirePageLoading(true);
    setMenu({
      open: false,
      key: null,
      anchor: null
    })
    const url = `${props.baseUrl}/api/profile/publish`;
    const data = {id: collection.id}
    Axios.post(url, data).then(e => {
      collection.published = e.data.published;
      let index = list.findIndex(x => x.id === collection.id);
      let newList = list;
      newList[index] = collection;
      setList(newList);
      setEntirePageLoading(false);
    }).catch(e => {
      setEntirePageLoading(false);
      console.log(e);
    })
  }

  return (
    <Box
      id="relations-list-scroll-element"
      style={{
        height: "100vh",
        position: "fixed",
        width: "100%",
        top: 0,
        right: 0,
        zIndex: 10000,
        backgroundColor: "#ffffff",
        overflowY: 'auto',
      }}
    >
      <Slide in={true} direction={"down"}>
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
              <Typography
                onClick={() => {
                  setLoading(!loading)
                }}
              >{translate(label)}</Typography>
              <Typography variant="caption">{caption || ''}</Typography>
            </Box>
            <Fab
              size="small"
              focusRipple
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              <ArrowBack onClick={goBack}/>
            </Fab>
          </Toolbar>
        </AppBar>
      </Slide>
      <Box style={{height: 60}}/>
      <Box style={{padding: 10}}>
        {/*{loading && (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <CircularProgress/>
          </Box>
        )}*/}
        {noResults && (
          <Alert severity="error" variant="filled">
            {translate('نتیجه ای یافت نشد')}
          </Alert>
        )}
        {!noResults && list.map((item, key) => {
          let label = item.label;
          let caption = item.caption;
          if (item.label && item.label.length > 100) {
            label = item.label.substring(0, 100) + '...';
          }
          if (item.caption && item.caption.length > 100) {
            caption = item.caption.substring(0, 100) + '...';
          }
          return (
            <Card
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
                  setMenu({
                    open: true,
                    anchor: e.currentTarget,
                    key: item.id,
                    userId: item.user_id,
                  })
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
                style={{zIndex: 100000}}
                anchorEl={menu.anchor}
                open={menu.open && menu.key === item.id}
                onClose={() => {
                  setMenu({
                    open: false,
                    anchor: null,
                    key: null,
                    userId: null,
                  })
                }}
              >
                {show.showSinglePage && (
                  <MenuItem
                    onClick={() => {
                      singleBlock(item)
                    }}
                  >
                    {translate("نمایش")}
                  </MenuItem>
                )}
                {show.publish && canPublish(item) && (
                  <MenuItem
                    onClick={() => {
                      publish(item)
                    }}
                  >
                    {translate(item.published ? 'تعلیق' : "انتشار")}
                  </MenuItem>
                )}
                {show.delete && (
                  <MenuItem
                    style={{
                      backgroundColor: pink.A400,
                      color: "#ffffff",
                    }}
                    onClick={() => {
                      setMenu({
                        open: false,
                        anchor: null,
                        key: null,
                        userId: null,
                      })
                      setRemove({
                        item: item,
                        dialog: true,
                      });
                    }}
                  >
                    <ListItemIcon style={{color: "#ffffff"}}><Delete/></ListItemIcon>
                    <Typography>{translate("حذف")}</Typography>
                  </MenuItem>
                )}
              </StyledMenu>
              <ButtonBase
                style={{
                  width: "100%",
                  borderRadius: 20,
                  textAlign: 'inherit'
                }}
                onClick={() => {
                  edit(item)
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
                    {item.mime_type && item.mime_type === 'video' && (
                      <Paper
                        elevation={3}
                        style={{
                          borderRadius: '50%',
                          width: 80,
                          height: 80,
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <video src={item.video} style={{width: '100%',}}/>
                      </Paper>
                    )}
                    {(
                      !item.mime_type || item.mime_type && item.mime_type === 'image'
                    ) && (
                      <CardMedia
                        image={props.baseUrl + '/' + item.icon}
                        title={item.label}
                        style={{
                          borderRadius: "50%",
                          width: 80,
                          height: 80,
                          backgroundSize: imageBackGroundSize || "cover",
                        }}
                      />
                    )}

                  </Grid>
                  <Grid
                    item
                    xs={6}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography>{translate(label)}</Typography>
                      <Typography variant="caption">{translate(caption || '')}</Typography>
                      {show.publish && canPublish(item) && (
                        <Typography
                          variant="caption"
                          color={item.published ? 'primary' : 'secondary'}>
                          {translate(item.published ? 'منتشر شده' : 'منتشر نشده')}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </ButtonBase>
            </Card>
          )
        })}
        {infScrollLoading && (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <CircularProgress/>
          </Box>
        )}
        <Box style={{height: 60}}/>
        <Slide in={true} direction={"up"}>
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
              to={{
                pathname: `${url}/addNew`,
                state
              }}
            >
              {translate("ثبت جدید")}
            </Button>
          </Box>
        </Slide>
        <Switch>
          <Route component={AddNew} path={`${path}/addNew`}/>
          <Route component={EditRelation} path={`${path}/edit/:id`}/>
        </Switch>
        <Backdrop
          open={entirePageLoading}
          style={{
            zIndex: 100000,
            color: "#ffffff",
          }}
        >
          <CircularProgress color="inherit"/>
        </Backdrop>
        <Dialog
          style={{zIndex: 100000}}
          open={remove.dialog}
          onClose={() => {
            setRemove({
              ...remove,
              dialog: false
            });
          }}
        >
          <DialogTitle>
            <Typography style={{fontSize: 16}}>
              {translate("آیا از حذف این مورد اطمینان دارید ؟")}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography color="error" style={{fontSize: 11}}>
              {remove.item.label || remove.item.caption}
              {' '}
              {translate("و تمام متعلقات آن حذف خواهند شد و دیگر قابل برگشت نخواهند بود")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={deleteItem}
              color="secondary"
            >
              {translate("بله،حذف شود")}
            </Button>
            <Button
              onClick={() => {
                setRemove({
                  dialog: false,
                  item: [],
                });
              }}
              color="primary"
            >
              {translate("بازگشت")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );

}

export default withRouter(connect(mapStateToProps)(List));