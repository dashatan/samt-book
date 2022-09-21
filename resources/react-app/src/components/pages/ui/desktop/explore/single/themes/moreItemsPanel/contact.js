import React from "react";
import {Box, CircularProgress, Container, Paper, Slide, Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../../translate";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Alert from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import {useHistory, useLocation} from "react-router-dom";

export default function Contact() {
  let {goBack} = useHistory();
  let {state} = useLocation();
  let collection = state.collection;
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
              <Typography>{translate("اطلاعات تماس")}</Typography>
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
        {!collection && (
          <Container
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 20
            }}
          >
            <CircularProgress/>
          </Container>
        )}
        {(
          collection
          && collection.phones
          && collection.addresses
          && collection.social_medias
        )
          ? (
            <Box
              style={{
                height: 'calc(100vh - 60px)',
                overflowY: 'auto'
              }}
            >
              {(
                collection.phones.length === 0
                && collection.addresses.length === 0
                && collection.social_medias.length === 0
              ) &&
              (
                <Box style={{padding: 10}}>
                  <Alert severity="error" variant="filled">
                    {translate('نتیجه ای یافت نشد')}
                  </Alert>
                </Box>
              )}
              {collection.phones.length > 0 && (
                <Box style={{marginTop: 20}}>
                  <Typography style={{padding: '0 10px'}}>{translate('شماره تلفن ها')}</Typography>
                  <Divider style={{margin: '10px 0'}}/>
                  <Box style={{padding: '0 5px'}}>
                    {collection.phones.map((phone, key) => {
                      return (
                        <Button
                          key={key}
                          href={'tel:' + phone.phone_number}
                          variant="outlined"
                          color="primary"
                          startIcon={phone.title}
                          style={{margin: 5, borderRadius: 100}}
                        >
                          {phone.phone_number}
                        </Button>
                      )
                    })}
                  </Box>
                </Box>
              )}
              {collection.addresses.length > 0 && (
                <Box style={{marginTop: 20}}>
                  <Typography style={{padding: '0 10px'}}>{translate('آدرس ها')}</Typography>
                  <Divider style={{margin: '10px 0'}}/>
                  <Box style={{padding: '0 5px'}}>
                    {collection.addresses.map((address, key) => {
                      return (
                        <Button
                          key={key}
                          variant="outlined"
                          color="primary"
                          href={`geo:${address.location}`}
                          // startIcon={<Explore/>}
                          // startIcon={address.title}
                          style={{textAlign: 'center', margin: 5}}
                        >
                          {/*{translate('مسیریابی')}*/}

                          {address.title + ' - ' + address.address}
                          {address.postal_code
                          && !['', 'null', 'undefined'].includes(address.postal_code)
                          && translate('کد پستی') + ' : ' + address.postal_code}
                        </Button>
                      )
                    })}
                  </Box>
                </Box>
              )}
              {collection.social_medias.length > 0 && (
                <Box style={{marginTop: 20}}>
                  <Typography style={{padding: '0 10px'}}>{translate('شبکه های اجتماعی')}</Typography>
                  <Divider style={{margin: '10px 0'}}/>
                  <Box style={{padding: 10}}>
                    {collection.social_medias.map((socialMedia, key) => {
                      return (
                        <Paper
                          key={key}
                          style={{
                            padding: 10,
                            borderRadius: 20,
                            marginBottom: 20
                          }}
                          elevation={3}
                          onClick={() => {
                            let url =
                              socialMedia.url.includes('https://')
                                ? socialMedia.url
                                : socialMedia.url.includes('http://')
                                ? socialMedia.url
                                : 'http://' + socialMedia.url
                            ;
                            window.open(url);
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid
                              item xs={3} style={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                            >
                              <CardMedia
                                style={{
                                  height: 60,
                                  width: 60,
                                  borderRadius: '50%',
                                  backgroundSize: 60
                                }}
                                image={state.baseUrl + '/' + socialMedia.icon}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={9}
                              style={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Box style={{direction: 'ltr'}}>
                                <Typography>{translate(socialMedia.title)}</Typography>
                                <Typography variant="caption">{socialMedia.url}</Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      )
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )
          : (
            <Box style={{padding: 10}}>
              <Alert severity="error" variant="filled">
                {translate('نتیجه ای یافت نشد')}
              </Alert>
            </Box>
          )
        }
      </Box>
    </Slide>
  )
}