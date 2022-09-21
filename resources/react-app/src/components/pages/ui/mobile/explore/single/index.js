import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import Axios from 'axios';
import Store from "../../../../../redux/store";
import DefaultInteractionPanel from "./themes/interactionPanel/default";
import DefaultSlider from "./themes/slider/default";
import DefaultTitle from "./themes/title/default";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import DefaultMoreItemsPanel from "./themes/moreItemsPanel/index";
import {Route, Switch, useHistory, useLocation, useParams, useRouteMatch} from "react-router-dom";
import MoreItems from "./themes/moreItemsPanel/moreItems";
import Contact from "./themes/moreItemsPanel/contact";
import TitleWithLargeImage from "./themes/title/titleWithLargeImage";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Skeleton from "@material-ui/lab/Skeleton";
import Chat from "./themes/chat";
import Grid from "@material-ui/core/Grid";
import Comments from "./themes/moreItemsPanel/comments";
import Slide from "@material-ui/core/Slide";
import Glider from "./themes/glider/glider";
import CircularProgress from "@material-ui/core/CircularProgress";
import {ArrowBack} from "@material-ui/icons";
import Fab from "@material-ui/core/Fab";
import translate from "../../../../../translate";
import {AppBar, Toolbar} from "@material-ui/core";
import SearchButtonWithField from "../../side-components/search/searchButtonWithField";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    block: state.singleBlock,
    contacts: state.singleBlockContacts,
    slides: state.singleSlides,
    relations: state.singleBlockRelations,
    subset: state.singleBlockSubset,
    blockIsLoading: state.singleBlockIsLoading,
  }
};

const gliders = [
  {
    name: 'top20Subset'
  },
  {
    name: 'top20News'
  },
  {
    name: 'top20Wantads'
  },
]

const Single = (props) => {
  let {state} = useLocation();
  let {id} = useParams();
  let {path, url} = useRouteMatch();
  let {push, goBack} = useHistory();
  let [collection, setCollection] = useState(state && state.collection || []);
  let [loading, setLoading] = useState(false);
  let [ready, setReady] = useState(false);
  const baseUrl = Store.getState().baseUrl;
  let stateIsDefined = !!!state;

  useEffect(() => {
    getCollection();
  }, [])

  const getCollection = () => {
    setLoading(true);
    const url = baseUrl + '/api/single/getCollection';
    let data = {id}
    if (props.user) {
      data = {
        ...data,
        userId: props.user.id
      }
    }
    Axios.post(url, data).then(e => {
      setLoading(false);
      setReady(true);
      setCollection(e.data.collection);
      if (e.data.room) {
        Store.dispatch({
          type: 'room',
          payload: e.data.room,
        });
      }
    }).catch(e => {
      setLoading(false);
      setReady(false);
      console.log(e);
    })
  };

  const singleBlock = (block) => {
    push({
      pathname: `${url}/${block.class}/${block.id}`,
      state: {
        ...state,
        collection: block,
      }
    })
  }

  const filterBtn = () => {
    push({
      pathname: '/filter',
      state: {
        searchFieldAutoFocus: true,
      }
    })
  }

  if (props.blockIsLoading) {
    return (
      <Fade
        in={true} addEndListener={() => {
      }}
      >
        <Box
          style={{
            paddingBottom: 70,
            height: 'calc(100vh - 70px)',
            overflowY: 'auto',
          }}
        >
          <Skeleton variant="rect" height={200} width="100%"/>
          <Box style={{padding: 10}}>
            <Skeleton variant="text" height={40}/>
            <Divider style={{margin: '10px 0'}}/>
            <Skeleton variant="text" height={60}/>
            <Skeleton variant="text" height={60}/>
            <Divider style={{margin: '10px 0'}}/>
            <Skeleton variant="text" height={30}/>
            <Skeleton variant="text" height={30}/>
            <Skeleton variant="text" height={30}/>
            <Skeleton variant="text" height={30}/>
          </Box>
        </Box>
      </Fade>
    )
  }
  return (
    <Slide in={true} direction="left">
      <Box
        style={{
          height: '100vh',
          width: '100%',
          overflowY: 'auto',
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 10000,
          backgroundColor: '#ffffff',
        }}
      >
        <AppBar color="inherit" position="fixed" style={{
          zIndex:1000,
        }}>
          <Toolbar
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box style={{paddingLeft: 10}}>
              <SearchButtonWithField onClick={filterBtn}/>
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
        {collection.slides && collection.slides.length > 0
          ?
          <Box>
            <DefaultSlider slides={collection.slides} id={`${collection.id}-slider`}/>
            <DefaultTitle text={collection.label} image={collection.image}/>
          </Box>
          :
          <Box>
            <TitleWithLargeImage
              text={collection.label}
              image={collection.image}
              id={`${collection.label}-slider`}
            />
          </Box>
        }
        {collection.dsc && (
          <Box style={{padding: 10}}>
            <Typography style={{fontSize: 14}}>
              {collection.dsc}
            </Typography>
          </Box>
        )}
        <DefaultInteractionPanel collection={collection} baseUrl={baseUrl} ready={stateIsDefined ? ready : true}/>
        {ready && (
          <DefaultMoreItemsPanel collection={collection} baseUrl={baseUrl}/>
        )}
        {collection.metas && collection.metas.length > 0 && (
          <Box style={{padding: 10}}>
            <Typography>
              {translate('جزئیات و ویژگی ها')}
            </Typography>
            {collection.metas.map((meta, key) => {
              const backgroundColor = key % 2 === 0 ? '#ffffff' : '#ebebeb';
              return (
                <Box key={key} style={{padding: '0 16px', backgroundColor}}>
                  <Grid container style={{minHeight: 40}}>
                    <Grid
                      item xs={5} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 10,
                    }}
                    >
                      <Typography>
                        {meta.key}
                      </Typography>
                    </Grid>
                    <Grid
                      item xs={7} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 10,
                    }}
                    >
                      <Typography>
                        {meta.value}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )
            })}
          </Box>
        )}
        {gliders.map((glider, key) => {
          let glides = collection[glider.name];
          if (glides && glides.data.length > 0) {
            return (
              <Box style={{padding: 10}} key={key}>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography>
                    {translate(glides.label)}
                  </Typography>
                  <Fab
                    size="small"
                    focusRipple
                    style={{
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    }}
                  >
                    <ArrowBack/>
                  </Fab>
                </Box>
                <Box style={{height: 10}}/>
                <Glider
                  glides={glides.data}
                  id={glider.name}
                  onClick={(block) => {
                    singleBlock(block);
                  }}
                />
              </Box>
            )
          }
        })}
        {loading && (
          <Box
            style={{
              padding: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={24}/>
          </Box>
        )}
        <Switch>
          <Route path={`${path}/contact`} component={Contact}/>
          <Route path={`${path}/moreItems`} component={MoreItems}/>
          <Route path={`${path}/chat`} component={Chat}/>
          <Route path={`${path}/comments`} component={Comments}/>
          <Route path={`${path}/:class/:id`} component={Single}/>
        </Switch>
      </Box>
    </Slide>
  )
}

export default connect(mapStateToProps)(Single);
