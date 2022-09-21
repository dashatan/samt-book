import React from "react";
import {Box, Card, CardMedia, CircularProgress, Container, Slide, Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../../../translate";
import Fab from "@material-ui/core/Fab";
import {ArrowBack, Explore} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {useHistory, useLocation} from "react-router-dom";

export default function RelationItem(props) {
  let {state} = useLocation();
  let {goBack} = useHistory();
  let collection = state.collection
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
          backgroundColor: '#ffffff'
        }}
      >
        <CircularProgress/>
      </Box>
    )
  }
  let relationItem = state.relationItem;
  console.log(relationItem)
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
          backgroundColor: "#ffffff",
          overflowY: 'auto',
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
              <Typography>{translate(relationItem.label)}</Typography>
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
                onClick={goBack}
              />
            </Fab>
          </Toolbar>
        </AppBar>
        <Box style={{height: 60}}/>
        <Box style={{padding: 10}}>
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
                image={state.baseUrl + "/" + relationItem.icon}
                title={translate(relationItem.label)}
                style={{
                  width: 100,
                  height: 100,
                  backgroundSize: 'cover',
                }}
              />
            </Card>
            <Typography>{relationItem.label}</Typography>
            {relationItem.caption && (
              <Typography variant="caption">{relationItem.caption}</Typography>
            )}
            <Divider style={{margin: '10px 0'}}/>
            {relationItem.dsc && (
              <Box>
                <Typography>{relationItem.dsc}</Typography>
                <Divider style={{margin: '10px 0'}}/>
              </Box>
            )}
            {relationItem.phone_number && (
              <Box>
                <Typography>{translate('شماره تلفن') + " : " + relationItem.phone_number}</Typography>
                <Divider style={{margin: '10px 0'}}/>
              </Box>
            )}
            {relationItem.address && (
              <Box>
                <Typography>{translate('آدرس') + " : " + relationItem.address}</Typography>
                <Divider style={{margin: '10px 0'}}/>
              </Box>
            )}
            {relationItem.location && (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  href={`geo:${relationItem.location}`}
                  startIcon={<Explore/>}
                >
                  {translate('مسیریابی')}
                </Button>
                <Divider style={{margin: '10px 0'}}/>
              </Box>
            )}
            {relationItem.file_path && (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  href={`${state.baseUrl}/${relationItem.file_path}`}
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

