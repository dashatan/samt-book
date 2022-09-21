import React from "react";
import Store from "../../../../redux/store";
import {Skeleton} from "@material-ui/lab";
import Slider from "../Slider";
import {AppBar, Box, ButtonBase, Card, CardMedia, Grid, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";
import translate from "../../../../translate";
import axios from "axios";
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import SearchButtonWithField from "../side-components/search/searchButtonWithField";

const mapStateToProps = (state) => {
  return {
    blocks: state.homeBlocks,
    slides: state.appSlides,
    filters: state.filterItems,
  };
};

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: this.props.filters,
      slides: this.props.slides ? this.props.slides : [],
    };
  }

  componentDidMount() {
    Store.dispatch({
      type: "navTabValue",
      payload: 2,
    });
    this.state.slides.length === 0 && this.getAppSlides();
  }

  getAppSlides = () => {
    const url = `${Store.getState().baseUrl}/api/appSlides`;
    axios
    .post(url)
    .then((e) => {
      this.setState({slides: e.data});
      Store.dispatch({
        type: "appSlides",
        payload: e.data,
      });
    })
    .catch((e) => {
      console.log(e);
      console.log(e.response);
    });
  };

  handleClick = (block) => {
    let filterItems = Store.getState().filterItems;
    let classItem = filterItems.find((x) => x.name === "class");
    let typeItem = filterItems.find((x) => x.name === "type");
    classItem.value = block.collection;
    classItem.label = block.collectionLabel ? block.collectionLabel : block.label;
    typeItem.value = block.type ? block.type : '';
    typeItem.label = block.typeLabel ? block.typeLabel : block.label;
    filterItems
    .filter((x) => !["class", "type"].includes(x.name))
    .map((item) => {
      if (["class", "type", "categoryId", "provinceId", "cityId", "idpId", "ftzId"].includes(item.name)) {
        item.label = '';
        item.value = '';
      }
      if (["searchText"].includes(item.name)) {
        item.value = "";
      }
      if (["countryId"].includes(item.name)) {
        item.value = 80;
      }
    });
    Store.dispatch({
      type: "filterItems",
      payload: filterItems,
    });
    Store.dispatch({
      type: "getBlocks",
      payload: true,
    });
    this.props.history.push('/explore');
  };

  filterBtn = () => {
    this.props.history.push({
      pathname: '/filter',
      state: {
        searchFieldAutoFocus: true,
      }
    })
  }

  render() {
    return (
      <Box
        style={{
          height: "calc(100vh - 60px)",
          paddingBottom: 60,
          backgroundColor: "#f0f8ff",
          overflowY: 'auto'
        }}
      >
        <AppBar color="inherit" position="fixed">
          <Toolbar
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box style={{width: '100%'}}>
              <SearchButtonWithField onClick={this.filterBtn}/>
            </Box>
          </Toolbar>
        </AppBar>
        <Box style={{height: 60}}/>
        {this.state.slides.length > 0 ? <Slider slides={this.state.slides} id='home-slider'/> : <Skeleton
          height={200}
          variant="rect"
          animation="wave"
        />}
        <Box>
          <Grid
            container
            spacing={3}
            style={{
              justifyContent: "center",
            }}
            className="grid-container"
          >
            {this.props.blocks.map((block, key) => {
              return (
                <Grid key={key} item xs={4} className="grid-item">
                  <div
                    style={{
                      display: "flex",
                      flexFlow: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                    onClick={() => {
                      this.handleClick(block);
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        flexFlow: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <ButtonBase
                        focusRipple
                        elevation={3}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 80,
                          boxShadow:
                            "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
                          backgroundColor:'#ffffff'
                        }}
                      >
                        <CardMedia
                          image={block.icon}
                          title={translate(block.label)}
                          style={{
                            width: 80,
                            height: 80,
                            backgroundSize: 50,
                          }}
                        />
                      </ButtonBase>
                      <Typography
                        variant='caption'
                        style={{
                          textAlign: "center",
                          marginTop: 10,
                        }}
                      >
                        {translate(block.label)}
                      </Typography>
                    </Box>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    );
  }
}

export default connect(mapStateToProps)(Home);
