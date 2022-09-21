import React, {useEffect, useState} from "react";
import Button from '@material-ui/core/Button';
import {Favorite, FavoriteBorder} from '@material-ui/icons';
import axios from 'axios';
import translate from "../../../../../../../../translate";
import Store from "../../../../../../../../redux/store";

export default function Like(props) {
  let [isLiked, setIsLiked] = useState(false);
  let [like, setLike] = useState([]);
  let [likesCount, setLikesCount] = useState(props.collection.likesCount);
  const baseUrl = Store.getState().baseUrl;
  const userToken = Store.getState().userToken;

  useEffect(() => {
    fetchIsLiked();
  }, [])

  const fetchIsLiked = () => {
    let url = baseUrl + '/api/single/like/isLiked';
    let data = {
      id: props.collection.id,
      userToken,
    }
    axios.post(url, data).then(e => {
      setIsLiked(e.data.isLiked)
      setLike(e.data.like)
    }).catch(e => {
      console.log(e);
      console.log(e.response ? e.response : false);
    })
  };

  const storeLike = () => {
    let url = baseUrl + '/api/single/like/store';
    let data = {
      id: props.collection.id,
      userToken,
    }
    axios.post(url, data).then(e => {
      setLike(e.data.like);
      setIsLiked(e.data.isLiked);
      setLikesCount(likesCount + 1);
    }).catch(e => {
      console.log(e);
    })
  };

  const destroyLike = () => {
    let url = baseUrl + '/api/single/like/destroy';
    let id = like.id;
    axios.post(url, {id}).then(e => {
      setIsLiked(e.data.isLiked);
      setLikesCount(likesCount - 1);
    }).catch(e => {
      console.log(e);
      console.log(e.response ? e.response : false);
    })
  };

  const handleLike = () => {
    if (userToken) {
      setIsLiked(!isLiked);
      if (isLiked) {
        destroyLike();
      } else {
        storeLike();
      }
    } else {
      alert(translate('ابتدا باید وارد شوید'))
    }
  };

  return (
    <Button
      style={{
        borderRadius: 100,
        width: '100%'
      }}
      size="small"
      variant="outlined"
      color="secondary"
      startIcon={isLiked ? <Favorite color="secondary"/> : <FavoriteBorder color="secondary"/>}
      onClick={handleLike}
    >
      {likesCount || translate('پسندیدن')}
    </Button>
  )
}