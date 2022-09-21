import React from "react";
import {Box, ButtonBase, Card, CircularProgress, Container, Slide, Toolbar, Zoom} from "@material-ui/core";
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../../translate";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import {Link, Route, Switch} from "react-router-dom";
import RelationItems from "./relationItems/relationItems";
import AppBar from "@material-ui/core/AppBar";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    block: state.singleBlock,
  }
}

const relations = [
  {
    name: 'news',
    show: ['prd', 'prv', 'prt', 'gld', 'ofc', 'idp', 'ftz', 'act', 'exb'],
    label: 'اخبار',
    icon: 'icons/special-flat/news.svg',
  },
  {
    name: 'wantads',
    show: ['prd', 'prv', 'gld', 'ofc', 'idp', 'ftz', 'exb', 'act'],
    label: 'نیازمندیها',
    icon: 'icons/special-flat/agreement.svg',
  },
  {
    name: 'boards',
    show: ['prd', 'prv', 'ofc', 'idp', 'ftz', 'exb', 'act'],
    label: 'هیئت مدیره',
    icon: 'icons/special-flat/team.svg'
  },
  {
    name: 'agents',
    show: ['prd', 'prv', 'prt', 'gld', 'ofc', 'act', 'exb'],
    label: 'نمایندگی ها',
    icon: 'icons/special-flat/marketing.svg',
  },
  {
    name: 'catalogs',
    show: ['prd', 'prv', 'prt', 'gld'],
    label: 'کاتالوگ',
    icon: 'icons/special-flat/catalog.svg',
  }
];

class MoreItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    let collection = this.props.block;
    if (!collection){
      return (
        <Box
          style={{
            position: 'fixed',
            height: '100vh',
            width: '100%',
            top: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: '#ffffff'
          }}
        >
          <CircularProgress/>
        </Box>
      )
    }
    let delay = 0;
    return (
      <Slide direction="left" in={true}>
        <Box
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: "100vh",
            zIndex: 1000,
            backgroundColor: "#ffffff"
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
                <Typography>{translate("موارد بیشتر")}</Typography>
                <Typography variant="caption">{collection ? collection.label : ''}</Typography>
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
          <Box style={{height: 60}}/>
          <Container>
            <Grid
              container
              spacing={4}
              style={{
                justifyContent: "center",
              }}
              className="grid-container"
            >
                {relations.map((relation, key) => {
                delay = delay + 50;
                const template = (
                  <Zoom
                    in={true}
                    key={key}
                    style={{
                      transitionDelay: `${delay}ms`,
                    }}
                  >
                    <Grid item xs={4}>
                      <ButtonBase
                        style={{
                          display: "flex",
                          flexFlow: "column",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                        component={Link}
                        to={`${this.props.match.url}/${relation.name}`}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexFlow: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Card
                            elevation={3}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 80,
                            }}
                          >
                            <CardMedia
                              image={this.props.baseUrl + "/" + relation.icon}
                              title={translate(relation.label)}
                              style={{
                                width: 80,
                                height: 80,
                                backgroundSize: 50,
                              }}
                            />
                          </Card>
                          <Typography
                            style={{
                              fontSize: 13,
                              textAlign: "center",
                              marginTop: 10,
                            }}
                          >
                            {translate(relation.label)}
                          </Typography>
                        </Box>
                      </ButtonBase>
                    </Grid>
                  </Zoom>
                );
                if (relation.show.includes(this.props.block.class)){
                  return template;
                }
              })}
            </Grid>
          </Container>
          <Switch>
            <Route component={RelationItems} path={`${this.props.match.path}/:relation`} />
          </Switch>
        </Box>
      </Slide>
    )
  }
}

export default connect(mapStateToProps)(MoreItems);