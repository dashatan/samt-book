import React from "react";
import Like from "./default/like";
import Container from "@material-ui/core/Container";
import ShareButton from "./default/share";
import {Skeleton} from "@material-ui/lab";
import {Chat} from "@material-ui/icons";
import translate from "../../../../../../../translate";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {Box} from "@material-ui/core";

const chatShowCases = ['prd', 'exb', 'gld', 'prv', 'idp', 'ftz', 'ofc', 'act', 'prt'];
const likeShowCases = ['pdc', 'nws', 'wtd', 'agt'];

export default function DefaultInteractionPanel(props) {
  let {push} = useHistory();
  let {url} = useRouteMatch();
  let {state} = useLocation();
  if (!props.ready) {
    return (
      <Container>
        <Skeleton height={80} variant="text" animation="wave"/>
      </Container>
    )
  }
  const chat = () => {
    if (!state.userToken) {
      return alert(translate('برای گفتگو باید ابتدا وارد شوید'))
    }
    if (!props.collection.user) {
      return alert(translate('نماینده این مجموعه قادر به پاسخگویی نیست'))
    }
    push({
      pathname: `${url}/chat`,
      state: {
        ...state,
        opponentUser: props.collection.user,
      }
    })
  }

  return (
    <Box style={{padding: 10}}>
      <Grid container spacing={2} style={{justifyContent: 'center'}}>
        <Grid
          item
          xs={4}
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            style={{
              borderRadius: 100,
              width: '100%'
            }}
            size="small" variant="outlined" color="primary"
            startIcon={props.collection.page_view}
          >
            {translate('بازدید')}
          </Button>
        </Grid>
        <Grid
          item
          xs={4}
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <ShareButton
            title={props.collection.title}
            text={props.collection.title}
            url={`${props.baseUrl}/s/${props.collection.class}/${props.collection.id}`}
          />
        </Grid>
        <Grid
          item
          xs={4}
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {likeShowCases.includes(props.collection.class) && (
            <Like collection={props.collection}/>
          )}
          {chatShowCases.includes(props.collection.class) && (
            <Button
              style={{
                borderRadius: 100,
                width: '100%'
              }}
              size="small" variant="outlined" color="primary"
              startIcon={<Chat/>}
              onClick={chat}
            >
              {translate('گفتگو')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  )

}