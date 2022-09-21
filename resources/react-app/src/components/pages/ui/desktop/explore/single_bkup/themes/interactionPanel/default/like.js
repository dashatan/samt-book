import React from "react";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import {Favorite, FavoriteBorder} from '@material-ui/icons';
import axios from 'axios';
import translate from "../../../../../../../../translate";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    singleBlock: state.singleBlock,
  }
};

class Like extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      like: [],
      isLiked: false,
      redirectToProfile: false,
      type: 'App\\Collection',
      id: props.singleBlock.id,
      likesCount: props.singleBlock.likesCount,
    }
  }

  componentDidMount() {
    this.isLiked();
  }

  isLiked = () => {
    let url = this.props.baseUrl + '/api/single/like/isLiked';
    let type = this.state.type;
    let id = this.state.id;
    let userToken = this.props.userToken;
    axios.post(url, {
      type,
      id,
      userToken
    }).then(e => {
      this.setState({
        isLiked: e.data.isLiked,
        like: e.data.like,
      })
    }).catch(e => {
      console.log(e);
      console.log(e.response ? e.response : false);
    })
  };

  storeLike = () => {
    let url = this.props.baseUrl + '/api/single/like/store';
    let block = this.props.singleBlock;
    let type = block.modelName;
    let id = block.id;
    let userToken = this.props.userToken;
    axios.post(url, {
      type,
      id,
      userToken
    }).then(e => {
      this.setState({
        isLiked: e.data.isLiked,
        like: e.data.like,
        likesCount: this.state.likesCount + 1,
      })
    }).catch(e => {
      console.log(e);
    })
  };

  destroyLike = () => {
    let url = this.props.baseUrl + '/api/single/like/destroy';
    let id = this.state.like.id;
    axios.post(url, {id}).then(e => {
      this.setState({
        isLiked: e.data.isLiked,
        likesCount: this.state.likesCount - 1,
      })
    }).catch(e => {
      console.log(e);
      console.log(e.response ? e.response : false);
    })
  };

  handleLike = () => {
    if (this.props.userToken) {
      let isLiked = this.state.isLiked;
      this.setState({isLiked: !isLiked});
      if (isLiked) {
        this.destroyLike();
      } else {
        this.storeLike();
      }
    } else {
      this.setState({snack: true})
    }
  };

  render() {
    console.log(this.props.singleBlock);
    return (
      <Button
        style={{
          borderRadius: 100,
          width: '100%'
        }}
        size="small"
        variant="outlined"
        color="secondary"
        startIcon={this.state.isLiked ? <Favorite color="secondary"/> : <FavoriteBorder color="secondary"/>}
        onClick={this.handleLike}
      >
        {this.state.likesCount || translate('پسندیدن')}
      </Button>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Like));
