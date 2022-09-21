import React from "react";
import Like from "./default/like";
import Container from "@material-ui/core/Container";
import ShareButton from "./default/share";
import {Skeleton} from "@material-ui/lab";
import {Chat} from "@material-ui/icons";
import translate from "../../../../../../../translate";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {connect} from "react-redux";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    user: state.user,
    singleBlock: state.singleBlock,
  }
};

const chatShowCases = ['prd', 'exb', 'gld', 'prv', 'idp', 'ftz', 'ofc', 'act', 'prt'];
const likeShowCases = ['pdc', 'nws', 'wtd', 'agt'];

const DefaultInteractionPanel = (props) => {
  let {push} = useHistory();
  let {url} = useRouteMatch();
  let {state} = useLocation();
  if (!props.singleBlock) {
    return (
      <Container>
        <Skeleton height={80} variant="text" animation="wave"/>
      </Container>
    )
  }
  const chat = () => {
    if (!props.user) {
      return alert(translate('برای گفتگو باید ابتدا وارد شوید'))
    }
    if (!props.singleBlock.user) {
      return alert(translate('نماینده این مجموعه قادر به پاسخگویی نیست'))
    }
    push({
      pathname: `${url}/chat`,
      state: {
        ...state,
        opponentUser: props.singleBlock.user,
      }
    })
  }

  return (
    <Container>
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
            startIcon={props.singleBlock.page_view}
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
            title={props.singleBlock.title}
            text={props.singleBlock.title}
            url={`${props.baseUrl}/s/${props.singleBlock.class}/${props.singleBlock.id}`}
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
          {likeShowCases.includes(props.singleBlock.class) && (
            // <Badge badgeContent={props.singleBlock.likesCount || ''} color="secondary" style={{width: '100%'}}>
            <Like/>
            // </Badge>
          )}
          {chatShowCases.includes(props.singleBlock.class) && (
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
    </Container>
  )

}

export default connect(mapStateToProps)(DefaultInteractionPanel);
