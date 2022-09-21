import React from "react";
import {Box, Paper} from "@material-ui/core";
import {connect} from "react-redux";
import translate from "../translate";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  }
}

class VideoUpload extends React.Component {
  constructor(props) {
    super(props);
    let videoPreview = this.props.defaultVideo
      ? <video src={this.props.defaultVideo} style={{width: '100%'}}/>
      : <img src={this.props.baseUrl + '/icons/special-flat/add.svg'} alt="add-video" style={{width: '75%'}}/>;
    this.state = {
      videoPreview,
    }
  }

  fileReader = (e) => {
    let _this = this;
    let fileSize = e.target.files[0].size / 1024 / 1024;
    if (fileSize > 20) {
      alert(translate('حجم فایل زیاد است . حداکثر حجم قابل قبول 20 مگابایت میباشد'))
    } else {
      let reader = new FileReader();
      reader.onload = function (readerEvent) {
        _this.setState({
          videoPreview: <video src={reader.result} style={{width: '100%'}}/>
        });
      };
      reader.readAsDataURL(e.target.files[0]);
      this.props.onChange(e.target.files[0]);
    }
  }

  render() {
    return (
      <Box
        style={{
          width: 80,
          height: 80,
        }}
      >
        <Paper
          id="videoContainer" elevation={3}
          onClick={() => {
            document.getElementById('file').click();
          }}
          style={{
            borderRadius: '50%',
            width: 80,
            height: 80,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {this.state.videoPreview}
        </Paper>
        <input type="file" name="file" id="file" style={{display: 'none'}} onChange={this.fileReader} accept="video/*"/>
      </Box>
    )
  }
}

export default connect(mapStateToProps)(VideoUpload);