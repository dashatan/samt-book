import {red} from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import React from "react";
import Store from "../../../../redux/store";
import axios from "axios";
import Slider from "../Slider";
import {
   AppBar,
   Box,
   ButtonBase,
   Card,
   CardMedia,
   Chip,
   CircularProgress,
   Container,
   Fab,
   Fade,
   Grid,
   Toolbar,
   Zoom,
} from "@material-ui/core";
import {Info, Navigation, Slideshow} from "@material-ui/icons";
import {Link, Route, Switch} from "react-router-dom";
import {Skeleton} from "@material-ui/lab";
import {connect} from "react-redux";
import translate from "../../../../translate";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Slides from "./slides";
import 'jquery.scrollto';
import FilterModal from "./filter-modal";
import $ from 'jquery';
import SearchButtonWithField from "../side-components/search/searchButtonWithField";
import Single from "./single";

const mapStateToProps = (state) => (
   {
      baseUrl: state.baseUrl,
      filterItems: state.filterItems,
      blocks: state.exploreBlocks,
      slides: state.exploreSlides,
      appSlides: state.appSlides,
      getBlocks: state.getBlocks,
      classes: state.classes,
      user: state.user,
   }
);

class Explore extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         filters: this.props.filterItems,
         blocks: this.props.blocks ? this.props.blocks : [],
         slides: this.props.slides ? this.props.slides : [],
         page: 1,
         scroll: false,
         showBackToTop: false,
         showLoading: false,
         showBlocksSkeleton: !this.props.exploreBlocks,
         noResults: false,
         skeletonLoading: false,
      };
   }

   componentDidMount() {
      Store.dispatch({
         type: "navTabValue",
         payload: 2,
      });
      this.getBlocks();
      let scrollElement = document.querySelector('#explore');
      scrollElement.onscroll = () => {
         this.infScroll();
         if (scrollElement.scrollTop > 500) {
            this.setState({showBackToTop: true});
         } else {
            this.setState({showBackToTop: false});
         }
      };
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.getBlocks) {
         this.setState({blocks: []});
         Store.dispatch({
            type: "exploreBlocks",
            payload: [],
         });
         Store.dispatch({
            type: "exploreSlides",
            payload: [],
         });
         Store.dispatch({
            type: "getBlocks",
            payload: false,
         });
         this.getBlocks(1);
      }
   }

   getBlocks = (page) => {
      this.autoScrollToClassElement();
      page = page ? page : this.state.page;
      this.setState({
         // showLoading: page > 1,
         // showBlocksSkeleton: page === 1,
         showBlocksSkeleton: true,
      });
      const url = this.props.baseUrl + "/api/explore";
      let blocks = this.state.blocks;
      let filterItems = this.props.filterItems;
      const data = {
         search_text: filterItems.find((x) => x.name === "searchText").value,
         class: filterItems.find((x) => x.name === "class").value,
         type: filterItems.find((x) => x.name === "type").value,
         category_id: filterItems.find((x) => x.name === "categoryId").value,
         country_id: filterItems.find((x) => x.name === "countryId").value,
         province_id: filterItems.find((x) => x.name === "provinceId").value,
         city_id: filterItems.find((x) => x.name === "cityId").value,
         idp_id: filterItems.find((x) => x.name === "idpId").value,
         ftz_id: filterItems.find((x) => x.name === "ftzId").value,
         is_in_idp: filterItems.find((x) => x.name === "insideOfIdp").value
            ? true
            : filterItems.find((x) => x.name === "outsideOfIdp").value
               ? false
               : null,
         is_in_ftz: filterItems.find((x) => x.name === "insideOfFtz").value
            ? true
            : filterItems.find((x) => x.name === "outsideOfFtz").value
               ? false
               : null,
         // open_date: filterItems.find((x) => x.name === "openDate").value,
         // close_date: filterItems.find((x) => x.name === "closeDate").value,
         // open_time: filterItems.find((x) => x.name === "openTime").value,
         // close_time: filterItems.find((x) => x.name === "closeTime").value,
         page,
      };
      axios.post(url, data).then((e) => {
         blocks = page > 1 ? blocks.concat(e.data.blocks.data) : e.data.blocks.data;
         let slides = e.data.slides;
         this.setState({
            blocks: blocks,
            slides: slides,
            showLoading: false,
            showBlocksSkeleton: false,
            scroll: e.data.blocks.data.length >= e.data.blocks.per_page,
            page: e.data.blocks.data.length >= e.data.blocks.per_page ? page + 1 : page,
            noResults: e.data.blocks.data.length === 0,
         });
         Store.dispatch({
            type: "exploreBlocks",
            payload: blocks,
         });
         Store.dispatch({
            type: "exploreSlides",
            payload: slides,
         });
      }).catch((e) => {
         this.setState({
            showLoading: false,
            // showBlocksSkeleton: false,
         });
         console.log(e);
         console.log(e.reponse);
      });
   };

   infScroll = () => {
      if (this.state.scroll) {
         let scrollElement = document.querySelector('#explore');
         let scrollHeight = scrollElement.scrollTop + scrollElement.clientHeight;
         let pageBottomHeight = scrollElement.scrollHeight;
         if (scrollHeight >= pageBottomHeight - 600) {
            this.setState({
               scroll: false,
               skeletonLoading: true,
            });
            this.getBlocks();
         }
      }
   };

   scrollTop = () => {
      // const anchor = document.getElementById("back-to-top-anchor");
      // anchor.scrollIntoView({
      //   behavior: "auto",
      //   block: "center",
      // });
      let scrollElement = document.querySelector('#explore');
      scrollElement.scrollTop = 0;

   };

   clearFilter = (name) => {
      let filters = this.state.filters;
      let filter = filters.find((x) => x.name === name);
      filter.value = '';
      if (["class", "type", "categoryId", "countryId", "provinceId", "cityId", "idpId", "ftzId"].includes(name)) {
         filter.label = '';
      }
      Store.dispatch({
         type: "filterItems",
         payload: filters,
      });
      Store.dispatch({
         type: "getBlocks",
         payload: true,
      });
   };

   setClass = (value, label) => {
      let filterItems = this.props.filterItems;
      let Class = filterItems.find(x => x.name === 'class');
      if (Class.value !== value) {
         let type = filterItems.find(x => x.name === 'type');
         Class.value = value;
         Class.label = label;
         type.value = '';
         type.label = '';
         Store.dispatch({
            type: 'filterItems',
            payload: filterItems
         });
         this.setState({blocks: []});
         Store.dispatch({
            type: "exploreBlocks",
            payload: [],
         });
         Store.dispatch({
            type: "exploreSlides",
            payload: [],
         });
         this.getBlocks(1);
      }
   }

   autoScrollToClassElement = () => {
      let Class = this.props.filterItems.find(x => x.name === 'class');
      let classChipsScrollElement = $('#classChips');
      let currentClassChip = $(`#${Class.value}-chip`);
      classChipsScrollElement.scrollTo(currentClassChip, 0, {
         offset: -120,
      });
   }

   filterBtn = () => {
      let matchUrl = this.props.match.url;
      this.props.history.push({
         pathname: matchUrl + '/filter',
         state: {
            searchFieldAutoFocus: true,
         }
      })
   }

   singleBlock = (block) => {
      Store.dispatch({
         type: "singleBlock",
         payload: block,
      });
      let matchUrl = this.props.match.url;
      this.props.history.push({
         pathname: `${matchUrl}/${block.class}/${block.id}`,
         state: {
            baseUrl: this.props.baseUrl,
            userToken: this.props.userToken,
            collection: block,
         }
      })
   }

   render() {
      let chips = this.props.filterItems.filter(
         (x) => !["", false, undefined, null].includes(x.value)
            && x.name !== "class"
      );
      let classChips = this.props.classes;
      let Class = this.props.filterItems.find(x => x.name === 'class');
      return (
         <Box
            id="explore"
            style={
               {
                  overflowY: 'auto',
                  // backgroundColor: '#f0f8ff',
                  backgroundColor: '#ffffff',
                  height: 'calc(100vh - 60px)',
                  marginTop: 60,
               }
            }
         >
            <Grid container>
               <Grid item xs={4} style={{
                  padding:10
               }}>
                  <Paper elevation={6} style={{
                     padding:20
                  }}>
                     <FilterModal/>
                  </Paper>
               </Grid>
               <Grid item xs={8}>
                  <div>
                     {this.props.slides && this.props.slides.length > 0 ? (
                        <Slider
                           slides={this.props.slides}
                           id='explore-slider'
                           style={{
                              height:400,
                           }}
                        />
                     ) : (
                        <Skeleton height={400} variant="rect" animation="wave"/>
                     )}
                     <Box id="back-to-top-anchor"/>
                     <Box
                        id="classChips"
                        style={{
                           padding: 10,
                           borderRadius: 0,
                           whiteSpace: 'nowrap',
                           overflowX: 'auto',
                           backgroundColor: '#ffffff',
                        }}
                     >
                        {classChips.map((item, key) => {
                           return (
                              <Chip
                                 key={key}
                                 id={`${item.value}-chip`}
                                 size="medium"
                                 label={translate(item.label)}
                                 color="primary"
                                 variant={Class.value === item.value ? 'default' : 'outlined'}
                                 style={{
                                    marginLeft: 5,
                                 }}
                                 onClick={() => {
                                    this.setClass(item.value, item.label)
                                 }}
                              />
                           )
                        })}
                     </Box>
                     {chips.length > 0 && (
                        <Box
                           style={{
                              padding: 10,
                              borderRadius: 0,
                              whiteSpace: 'nowrap',
                              overflowX: 'auto',
                              backgroundColor: '#ffffff',
                           }}
                        >
                           {chips.map((item, key) => {
                              let chipLabel;
                              if (["searchText"].includes(item.name)) {
                                 chipLabel = `${translate(item.label)}:${translate(item.value)}`;
                              } else {
                                 let label = item.label.length <= 20 ? translate(item.label) : translate(item.label).substr(0, 20) + "...";
                                 chipLabel = `${translate(item.title)}${item.title !== item.label ? ' : ' + label : ''}`;
                              }
                              return (
                                 <Chip
                                    key={key}
                                    size="small"
                                    label={chipLabel}
                                    color="primary"
                                    variant="outlined"
                                    style={{
                                       marginLeft: 5,
                                    }}
                                    onDelete={this.clearFilter.bind(this, item.name)}
                                 />
                              )
                           })}
                        </Box>
                     )}
                     <Box
                        style={{
                           padding: 10,
                           marginTop: 10
                        }}
                     >
                        <Grid container spacing={3}>
                           {this.state.blocks.map((block, key) => {
                              return (
                                 <Grid item xs={4}>
                                    <ButtonBase
                                       key={key}
                                       style={{
                                          width: "100%",
                                       }}
                                       onClick={() => {
                                          this.singleBlock(block);
                                       }}
                                    >
                                       <Card
                                          style={{
                                             height: 300,
                                             width: "100%",
                                          }}
                                          elevation={3}
                                       >
                                          <CardMedia
                                             style={{
                                                height:200,
                                             }}
                                             image={block.image}
                                             title={block.title}
                                          />
                                          <Typography
                                             variant='subtitle1'
                                             style={{
                                                textAlign:'right',
                                                padding:20,
                                             }}
                                          >
                                             {block.title}
                                          </Typography>
                                       </Card>
                                    </ButtonBase>
                                 </Grid>
                              );
                           })}
                        </Grid>

                        {this.state.showBlocksSkeleton && (
                           <Grid container spacing={3}>
                              {[...Array(8)].map((x, i) => {
                                 return (
                                    <Grid item xs={4}>
                                       <Card
                                          key={i}
                                          style={{height: 400}}
                                          elevation={3}
                                       >
                                          <Skeleton variant="rect" height={300} width={'100%'}/>
                                          <div style={{padding:20}}>
                                             <Skeleton variant="text" height={80} width="100%"/>
                                             <div style={{height:10}}/>
                                             <Skeleton variant="text" height={80} width="100%"/>
                                          </div>
                                       </Card>
                                    </Grid>
                                 );
                              })}
                           </Grid>
                        )}
                     </Box>

                     {this.state.noResults && (
                        <Container
                           style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              marginTop: 20,
                           }}
                        >
                           <img
                              src={`${this.props.baseUrl}/images/icons/classes/yellow-shadow/research.svg`}
                              alt="No Results !"
                              style={{height: 100}}
                           />
                           <Typography
                              style={{
                                 color: "#f0bc5e",
                                 fontSize: 22,
                              }}
                           >
                              {translate("نتیجه ای یافت نشد")}!
                           </Typography>
                        </Container>
                     )}
                     <Fade in={this.state.showLoading} timeout={10}>
                        <Container
                           style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                           }}
                        >
                           <CircularProgress/>
                        </Container>
                     </Fade>
                     <Zoom in={this.state.showBackToTop}>
                        <Fab
                           color="primary"
                           size='large'
                           style={{
                              position: "fixed",
                              bottom: 70,
                              right: 70,
                           }}
                           focusRipple
                           onClick={this.scrollTop}
                        >
                           <Navigation/>
                        </Fab>
                     </Zoom>
                     <Switch>
                        <Route path={`${this.props.match.path}/slides`} component={Slides}/>
                        <Route path={`${this.props.match.path}/filter`} component={FilterModal}/>
                        <Route path={`${this.props.match.path}/:class/:id`} component={Single}/>
                     </Switch>
                  </div>
               </Grid>
            </Grid>
         </Box>
      );
   }
}

export default connect(mapStateToProps)(Explore);
