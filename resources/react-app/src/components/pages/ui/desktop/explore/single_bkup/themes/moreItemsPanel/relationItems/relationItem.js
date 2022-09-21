import React from "react";
import {Box, Card, CardMedia, CircularProgress, Container, Slide, Toolbar} from "@material-ui/core";
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../../../translate";
import Fab from "@material-ui/core/Fab";
import {ArrowBack, Explore} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    block: state.singleBlock,
    relations: state.singleBlockRelations,
  }
}

class RelationItem extends React.Component {

  render() {
    let collection = this.props.block
    if (!collection) {
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
    let relationName = this.props.match.params.relation;
    let relationId = this.props.match.params.id;
    let relations = collection[relationName];
    let relation = relations.find(x => x.id === parseInt(relationId));
    return (
      <Slide direction="left" in={true}>
        <Box
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: "100vh",
            zIndex: 100000,
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
                <Typography>{translate(relationName)}</Typography>
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
          <Box
            style={{
              height: 'calc(100vh - 60px)',
              overflowY: 'auto',
              padding: 10,
            }}
          >
            <Container
              style={{
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Card
                elevation={3}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 80,
                  marginBottom: 10,
                }}
              >
                <CardMedia
                  image={this.props.baseUrl + "/" + relation.icon}
                  title={translate(relation.label)}
                  style={{
                    width: 100,
                    height: 100,
                    backgroundSize: 'cover',
                  }}
                />
              </Card>
              <Typography>{relation.label}</Typography>
              {relation.caption && (
                <Typography variant="caption">{relation.caption}</Typography>
              )}
              <Divider style={{margin: '10px 0'}}/>
              {relation.dsc && (
                <Box>
                  <Typography>{relation.dsc}</Typography>
                  <Divider style={{margin: '10px 0'}}/>
                </Box>
              )}
              {relation.phone_number && (
                <Box>
                  <Typography>{translate('شماره تلفن') + " : " + relation.phone_number}</Typography>
                  <Divider style={{margin: '10px 0'}}/>
                </Box>
              )}
              {relation.address && (
                <Box>
                  <Typography>{translate('آدرس') + " : " + relation.address}</Typography>
                  <Divider style={{margin: '10px 0'}}/>
                </Box>
              )}
              {relation.location && (
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`geo:${relation.location}`}
                    startIcon={<Explore/>}
                  >
                    {translate('مسیریابی')}
                  </Button>
                  <Divider style={{margin: '10px 0'}}/>
                </Box>
              )}
              {relation.file_path && (
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`${this.props.baseUrl}/${relation.file_path}`}
                    startIcon={<Explore/>}
                  >
                    {translate('دانلود')}
                  </Button>
                </Box>
              )}
            </Container>
          </Box>
        </Box>
      </Slide>
    )
  }
}

export default connect(mapStateToProps)(RelationItem);