import React, {useEffect, useState} from "react";
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Axios from "axios";
import {ArrowBack, Send} from "@material-ui/icons";
import {Fab, Zoom} from "@material-ui/core";
import {useHistory} from "react-router";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import translate from "../../../../../../../translate";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import {lightBlue} from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    userToken: state.userToken,
    block: state.singleBlock,
  }
}

const Comments = (props) => {
  let {goBack} = useHistory();
  let [comments, setComments] = useState([]);
  let [onPageLoading, setOnPageLoading] = useState(false);
  let [onBtnLoading, setOnBtnLoading] = useState(false);
  let [newComment, setNewComment] = useState('');
  let [page, setPage] = useState(1);
  const scrollElement = document.querySelector('#comments-scroll-element');

  useEffect(() => {
    props.block && getComments()
  }, [])

  const getComments = () => {
    setOnPageLoading(true);
    const url = `${props.baseUrl}/api/single/getComments`;
    let data = {modelId: props.block.id, page}
    Axios.post(url, data).then(e => {
      setOnPageLoading(false);
      let newComments = comments.concat(e.data.comments.data);
      setComments(newComments);
      setPage(page + 1);
    }).catch(e => {
      setOnPageLoading(false);
      console.log(e);
    })
  }

  const storeNewComment = () => {

    if (newComment) {
      setOnBtnLoading(true);
      const url = props.baseUrl + '/api/single/storeNewComment';
      const data = {
        text: newComment,
        userId: props.user.id,
        parentModelId: props.block.id,
      };
      setNewComment('');
      Axios.post(url, data).then(e => {
        setOnBtnLoading(false);
        let newComments = [
          ...comments,
          e.data.comment,
        ]
        setComments(newComments);
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }).catch(e => {
        setOnBtnLoading(false);
        console.log(e);
      })
    }
  }
  return (

    <Slide in={true} direction="left">
      <Box
        id="comments-scroll-element"
        style={{
          position: 'fixed',
          zIndex: 10000,
          height: '100vh',
          width: '100%',
          top: 0,
          right: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#ffffff',
          backgroundSize: 'contain',
        }}
      >
        <Box>
          <AppBar position="fixed" color="inherit">
            <Toolbar
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {props.block && (
                <Box>
                  <Typography>{translate('دیدگاه ها')}</Typography>
                  <Typography variant="caption">{translate(props.block.label)}</Typography>
                </Box>
              )}

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
        </Box>
        <Box style={{height: 60}}/>
        <Box style={{padding: 10}}>
          {onPageLoading && (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <Fab size="small" style={{backgroundColor: "#ffffff"}}>
                <CircularProgress size={20} color="primary"/>
              </Fab>
            </Box>
          )}
          {comments.length > 0 && comments.map((comment, key) => {
            return (
              <Box key={key} style={{marginBottom: 20}}>
                <Grid container>
                  <Grid item xs={2}>
                    <Avatar src={comment.user.avatar}/>
                  </Grid>
                  <Grid item xs={10}>
                    <Paper
                      elevation={6}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      <Typography>
                        {comment.text}
                      </Typography>
                      <Divider style={{margin: '5px 0'}}/>
                      <Box style={{display: "flex"}}>
                        <Typography variant="caption">
                          {comment.date}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )
          })}
        </Box>
        {props.user && (
          <Box>
            <Box style={{height: 120}}/>
            <Box
              style={{
                position: 'fixed',
                width: '100%',
                height: 'auto',
                bottom: 0,
                right: 0,
                zIndex: 100000,
                backgroundColor: '#ffffff',
              }}
            >
              <Box style={{padding: 10}}>
                <Grid container spacing={3}>
                  <Grid item xs={2}>
                    <Zoom in={true}>
                      <Fab color="primary" size="medium" onClick={storeNewComment}>
                        {onBtnLoading && (
                          <CircularProgress size={24} color={"inherit"}/>
                        )}
                        {!onBtnLoading && (
                          <Send
                            style={{
                              position: 'relative',
                              left: '2.5px'
                            }}
                          />
                        )}
                      </Fab>
                    </Zoom>
                  </Grid>
                  <Grid
                    item xs={10} style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  >
                    <TextField
                      multiline
                      fullWidth
                      placeholder={translate('دیدگاه خود را بنویسید')}
                      value={newComment}
                      onChange={(e) => {
                        setNewComment(e.target.value)
                      }}
                      style={{
                        maxHeight: 200,
                        overflowY: 'auto'
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Slide>
  )
}

export default connect(mapStateToProps)(Comments)