import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import Axios from 'axios';
import Store from "../../../../../redux/store";
import DefaultInteractionPanel from "./themes/interactionPanel/default";
import DefaultSubsetPanel from "./themes/relations/default";
import DefaultSlider from "./themes/slider/default";
import DefaultTitle from "./themes/title/default";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import DefaultMoreItemsPanel from "./themes/moreItemsPanel/index";
import {Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import MoreItems from "./themes/moreItemsPanel/moreItems";
import Contact from "./themes/moreItemsPanel/contact";
import TitleWithLargeImage from "./themes/title/titleWithLargeImage";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Skeleton from "@material-ui/lab/Skeleton";
import Chat from "./themes/chat";
import Grid from "@material-ui/core/Grid";
import Comments from "./themes/moreItemsPanel/comments";

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

const classesThatHaveSubset = ['prd', 'idp', 'gld', 'exb', 'prt', 'ofc', 'act', 'prv'];

const subsetOfClasses = {
  prd: 'products',
  prt: 'products',
  gld: 'products',
  prv: 'products',
  exb: 'participants',
  idp: 'idpSubsets',
  ftz: 'ftzSubsets',
  ofc: 'services',
  act: 'services',
}

const Single = (props) => {
  let Class = useParams().class;
  let {id} = useParams();
  let {path} = useRouteMatch();
  let [slides, setSlides] = useState(props.slides || []);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    Store.dispatch({
      type: 'navTabValue',
      payload: 5
    });
    getBlock();
    if (classesThatHaveSubset.includes(Class)) {
      getSubset();
    }
  }, [])

  useEffect(() => {
    let differentClasses = props.block && Class !== props.block.class;
    if (differentClasses && !loading) {
      Store.dispatch({
        type: 'singleBlockIsLoading',
        payload: true,
      });
      getBlock();
      if (classesThatHaveSubset.includes(Class)) {
        getSubset();
      }
    }
  })

  const getBlock = () => {
    setLoading(true);
    const url = props.baseUrl + '/api/single/getCollection';
    let data = {
      id,
      class: Class
    }
    if (props.user) {
      data = {
        ...data,
        userId: props.user.id
      }
    }
    Axios.post(url, data).then(e => {
      setLoading(false);
      setSlides(e.data.slides);
      if (e.data.room) {
        Store.dispatch({
          type: 'room',
          payload: e.data.room,
        });
      }
      Store.dispatch({
        type: 'singleBlock',
        payload: e.data.collection
      });
      Store.dispatch({
        type: 'singleSlides',
        payload: e.data.slides
      });
      Store.dispatch({
        type: 'singleBlockContacts',
        payload: e.data.contacts
      });
      Store.dispatch({
        type: 'singleBlockRelations',
        payload: e.data.relations
      });
      Store.dispatch({
        type: 'singleBlockIsLoading',
        payload: false,
      });
    }).catch(e => {
      console.log(e);
    })
  };

  const getSubset = () => {
    Store.dispatch({
      type: 'singleBlockSubsetIsLoading',
      payload: true,
    });
    const url = props.baseUrl + '/api/single/getSubset';
    const data = {
      id,
      class: Class,
      relation: subsetOfClasses[Class]
    }
    Axios.post(url, data).then(e => {
      let subset = e.data.subset;
      Store.dispatch({
        type: 'singleBlockSubset',
        payload: subset
      });
      Store.dispatch({
        type: 'singleBlockSubsetIsLoading',
        payload: false,
      });
    }).catch(e => {
      console.log(e);
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
  let slider = <DefaultSlider slides={slides}/>;
  let defaultTitle = <DefaultTitle/>;
  let titleWithLargeImage = <TitleWithLargeImage/>;
  let interactionPanel = <DefaultInteractionPanel history={props.history}/>;
  let subsetPanel = <DefaultSubsetPanel/>;
  let moreItemsPanel = <DefaultMoreItemsPanel/>;
  let lineKey = 0;
  return (
    <Fade in={true}>
      <Box
        style={{
          paddingBottom: 70,
          height: 'calc(100vh - 70px)',
          overflowY: 'auto'
        }}
      >
        {slides && slides.length > 0 && slider}
        {slides && slides.length > 0 && <Box style={{height: 10}}/>}
        {slides && slides.length === 0 && titleWithLargeImage}
        {slides && slides.length > 0 && defaultTitle}
        <Divider style={{margin: '10px 0'}}/>
        {interactionPanel}
        <Box style={{margin: '10px 0'}}/>
        {moreItemsPanel}
        {props.block && props.block.dsc && (
          <Box>
            <Divider style={{margin: '10px 0'}}/>
            <Typography
              style={{
                fontSize: 14,
                padding: '10px 16px'
              }}
            >
              {props.block.dsc}
            </Typography>
          </Box>
        )}
        {props.block && props.block.metas && (
          <Box>
            <Divider style={{margin: '10px 0'}}/>
            {props.block.metas.map((meta, key) => {
              const isEven = lineKey % 2 === 0;
              lineKey = lineKey + 1;
              return (
                <Box key={key} style={{padding: '0 16px', backgroundColor: isEven ? '#ffffff' : '#ebebeb'}}>
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
        {classesThatHaveSubset.includes(Class) && (
          <Box>
            <Divider style={{margin: '10px 0'}}/>
            {subsetPanel}
          </Box>
        )}
        <Switch>
          <Route path={`${path}/contact`} component={Contact}/>
          <Route path={`${path}/moreItems`} component={MoreItems}/>
          <Route path={`${path}/chat`} component={Chat}/>
          <Route path={`${path}/comments`} component={Comments}/>
        </Switch>
      </Box>
    </Fade>
  )
}

export default connect(mapStateToProps)(Single);
