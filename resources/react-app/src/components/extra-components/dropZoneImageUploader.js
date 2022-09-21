import React from "react";
import Dropzone from "dropzone";
import {Box, Fab, Grid, LinearProgress, Paper} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

let setImage;

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageAdded: false,
      imageHelperText: '',
      progress: 0,
    }
  }

  componentDidMount() {
    let _this = this;
    setImage = new Dropzone("#image", {
      url: this.props.url,
      clickable: "#image-clickable",
      paramName: 'file',
      acceptedFiles: _this.props.accept ? _this.props.accept : '*',
      previewTemplate: document.getElementById("tpl").innerHTML,
      resizeWidth: 600,
      maxFilesize: 20,
      maxFiles: 1,
      addRemoveLinks: true,
      dictRemoveFile: '',
      dictCancelUpload: '',
      autoProcessQueue: false,
      init: function () {
        if (_this.props.accept) {
          // document.querySelector('.dz-hidden-input').setAttribute('accept', this.props.accept);
        }
      }
    });
    setImage.on('addedfile', function (file) {
      document.getElementById('image-clickable').style.display = 'none';
      document.getElementById('progress-bar').style.display = 'none';
      _this.setState({
        imageAdded: true,
        imageHelperText: '',
      })
      _this.props.fileAdded(file, true, setImage);
    });
    setImage.on('removedfile', function (file) {
      document.getElementById('image-clickable').style.display = 'block';
      _this.setState({
        imageAdded: false,
      })
      _this.props.fileAdded(file, false, setImage);
    });
    setImage.on("uploadprogress", function (file, progress) {
      // document.getElementById('progress-bar').style.display = 'flex';
      _this.props.onProgress(Math.round(progress));
      // _this.setState({progress: Math.round(progress)});
      // if (progress === 100) {
      //   document.getElementById('progress-bar').style.display = 'none';
      // }
    });
    setImage.on('sending', function (file, xhr, formData) {
      _this.props.onSending(file, xhr, formData);
    });
    setImage.on('success', function (file, response) {
      _this.props.onSuccess(file, response);
    });
    setImage.on('error', function (file, response) {
      _this.props.onError(file, response);
    });
    // this.props.processQueue && setImage.processQueue();
  }

  render() {
    const tpl = (
      <Box id="tpl" style={{display: 'none'}}>
        <Box
          style={{
            position: 'relative',
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <Box
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Paper
              elevation={3} style={{
              width: 80,
              height: 80,
              borderRadius: 80,
              overflow: "hidden",
              position: "relative"
            }}
            >
              <img
                data-dz-thumbnail=""
                style={{width: "100%"}}
                src={this.props.defaultImage}
                alt=""
              />
            </Paper>
            <Fab
              size="small" style={{
              minWidth: 23,
              width: 23,
              minHeight: 23,
              height: 23,
              position: 'absolute',
              right: -3,
              top: -3,
              border: '2px solid white',
              boxShadow: 'none',
            }} color="secondary"
              className="dz-remove"
              data-dz-remove
            >
              <Close style={{fontSize: 14}}/>
            </Fab>
          </Box>
        </Box>
      </Box>
    );
    return (
      <div>
        {tpl}
        <Box id="image">
          <Paper
            id="image-clickable"
            elevation={3}
            style={{
              width: 80,
              height: 80,
              borderRadius: 80,
              overflow: "hidden",
              position: "relative",
              margin: 'auto'
            }}
          >
            <CardMedia
              image={this.props.defaultImage}
              style={{
                width: "100%",
                height: "100%",
                backgroundSize: this.props.defaultImageSize
              }}
            />
          </Paper>

        </Box>
        <Grid
          container
          id="progress-bar"
          style={{display: 'none'}}
        >
          <Grid
            item
            xs={3}
          >
            <Typography
              style={{
                textAlign: 'center',
                direction: "ltr",
                fontSize: 10
              }}
            >
              {this.state.progress}
            </Typography>
          </Grid>
          <Grid
            item
            xs={9}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <LinearProgress
              style={{width: this.state.progress + '%'}}
              variant="determinate"
              value={this.state.progress}
              color="secondary"
            />
          </Grid>
        </Grid>
        <Typography
          color="error"
          variant="caption"
        >
          {this.state.imageHelperText}
        </Typography>
      </div>
    );
  }

}

export default Upload;