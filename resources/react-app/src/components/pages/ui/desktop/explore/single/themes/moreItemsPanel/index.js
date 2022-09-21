import React, {useState} from "react";
import {connect} from "react-redux";
import Container from "@material-ui/core/Container";
import {Skeleton} from "@material-ui/lab";
import {AddShoppingCart, Comment, More, Phone} from "@material-ui/icons";
import translate from "../../../../../../../translate";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import Axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Badge from "@material-ui/core/Badge";
import {Box} from "@material-ui/core";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
  }
};

const contactShowCases = [
  'prd',
  'exb',
  'gld',
  'prv',
  'idp',
  'ftz',
  'ofc',
  'act',
  'prt',
  'agt',
  'wtd',
];
const moreItemsShowCases = [
  'prd',
  'exb',
  'gld',
  'prv',
  'idp',
  'ftz',
  'ofc',
  'act',
  'prt',
];
const orderShowCases = [
  'pdc'
];
const commentsShowCases = [
  'pdc'
];

const DefaultMoreItemsPanel = (props) => {
  let {state} = useLocation();
  let {push} = useHistory();
  let {url} = useRouteMatch();
  let [btnLoading, setBtnLoading] = useState(false);
  let collection = props.collection;
  if (!collection) {
    return (
      <Container>
        <Skeleton height={80} variant="text" animation="wave"/>
      </Container>
    )
  }

  const order = () => {
    if (!props.user) {
      return alert(translate('برای ثبت سفارش ابتدا باید وارد شوید'))
    }
    if (!collection.user) {
      return alert(translate('در حال حاظر سفارش این محصول امکان پذیر نیست'))
    }
    setBtnLoading(true);
    let message = `${translate('سفارش جدید')} - ${translate('برای محصول')} ${collection.label}`;
    const apiUrl = props.baseUrl + '/api/single/sendMessage';
    const data = {
      type: 'text',
      message,
      userId: props.user.id,
      opponentUserId: collection.user.id,
    };
    Axios.post(apiUrl, data).then(e => {
      setBtnLoading(false);
      push({
        pathname: `${url}/chat`,
        state: {
          ...state,
          opponentUser: collection.user,
        }
      })

    }).catch(e => {
      setBtnLoading(false);
      console.log(e);
    })
  }

  return (
    <Box style={{padding:10}}>
      <Grid container spacing={2} style={{justifyContent: 'center'}}>
        {contactShowCases.includes(collection.class) && (
          <Grid
            item xs={6} style={{
            display: 'flex',
            justifyContent: 'center'
          }}
          >
            <Button
              style={{
                borderRadius: 100,
                width: '100%'
              }}
              size="small" variant="contained" color="primary"
              startIcon={<Phone/>}
              component={Link}
              to={{
                pathname:`${url}/contact`,
                state:{
                  ...state,
                  collection,
                }
              }}
            >
              {translate('اطلاعات تماس')}
            </Button>
          </Grid>
        )}

        {moreItemsShowCases.includes(collection.class) && (
          <Grid
            item xs={6} style={{
            display: 'flex',
            justifyContent: 'center'
          }}
          >
            <Button
              style={{
                borderRadius: 100,
                width: '100%'
              }}
              size="small" variant="contained" color="primary"
              startIcon={<More/>}
              component={Link}
              to={{
                pathname:`${url}/moreItems`,
                state:{
                  ...state,
                  collection:props.collection
                }
              }}
            >
              {translate('موارد بیشتر')}
            </Button>
          </Grid>
        )}
        {orderShowCases.includes(collection.class) && (
          <Grid
            item xs={6} style={{
            display: 'flex',
            justifyContent: 'center'
          }}
          >
            <Button
              style={{borderRadius: 100}}
              size="small" variant="contained" color="primary"
              startIcon={btnLoading ? <CircularProgress size={24} color={"inherit"}/> : <AddShoppingCart/>}
              fullWidth
              onClick={order}
            >
              {translate('ثبت سفارش')}
            </Button>
          </Grid>
        )}
        {commentsShowCases.includes(collection.class) && (
          <Grid
            item xs={6} style={{
            display: 'flex',
            justifyContent: 'center'
          }}
          >
            {parseInt(collection.commentsCount) > 0 && (
              <Badge color="secondary" badgeContent={collection.commentsCount || ''} style={{width: '100%'}}>
                <Button
                  style={{borderRadius: 100}}
                  size="small" variant="contained" color="primary"
                  startIcon={<Comment/>}
                  component={Link}
                  to={{
                    pathname:`${url}/comments`,
                    state:{
                      ...state
                    }
                  }}
                  fullWidth
                >
                  {translate('دیدگاه ها')}
                </Button>
              </Badge>
            )}
            {parseInt(collection.commentsCount) === 0 && (
              <Button
                style={{borderRadius: 100}}
                size="small" variant="contained" color="primary"
                startIcon={<Comment/>}
                component={Link}
                to={{
                  pathname:`${url}/comments`,
                  state:{
                    ...state,
                    collection:props.collection
                  }
                }}
                fullWidth
              >
                {translate('دیدگاه ها')}
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps)(DefaultMoreItemsPanel);
