import React from "react";
import {Box, CircularProgress, Container, Paper, Slide, Toolbar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import translate from "../../../../../../../translate";
import Fab from "@material-ui/core/Fab";
import {ArrowBack, Explore} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Alert from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import {connect} from "react-redux";
import {useHistory} from "react-router";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    block: state.singleBlock,
    contacts: state.singleBlockContacts,
  }
}

const Contact = (props) => {
  let {goBack} = useHistory();
  let collection = props.block;
  console.log(props.contacts);
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
        {collection && (
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
                <Box style={{padding: '0 20px'}}>
                  {collection.phones.map((phone, key) => {
                    return (
                      <Box key={key}>
                        <Typography
                          style={{
                            fontSize: 14,
                            marginBottom: 10
                          }}
                        >{phone.title} : {phone.phone_number}</Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )}
            {collection.addresses.length > 0 && (
              <Box style={{marginTop: 50}}>
                <Typography style={{padding: '0 10px'}}>{translate('آدرس ها')}</Typography>
                <Divider style={{margin: '10px 0'}}/>
                <Box style={{padding: '0 20px'}}>
                  {collection.addresses.map((address, key) => {
                    return (
                      <Box key={key} style={{marginBottom: 10}}>
                        <Typography
                          style={{
                            fontSize: 14,
                            marginBottom: 10
                          }}
                        >{address.title} : {address.address}</Typography>
                        {address.postal_code && (
                          <Typography
                            style={{
                              fontSize: 14,
                              marginBottom: 10
                            }}
                          >{translate('کد پستی')} : {address.postal_code}</Typography>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          href={`geo:${address.location}`}
                          startIcon={<Explore/>}
                        >
                          {translate('مسیریابی')}
                        </Button>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )}
            {collection.social_medias.length > 0 && (
              <Box style={{marginTop: 50}}>
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
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={3}>
                            <CardMedia
                              style={{
                                height: 60,
                                width: 60,
                                borderRadius: '50%',
                                backgroundSize: 40
                              }}
                              image={props.baseUrl + '/' + socialMedia.icon}
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
        )}
      </Box>
    </Slide>
  )
}

export default connect(mapStateToProps)(Contact);