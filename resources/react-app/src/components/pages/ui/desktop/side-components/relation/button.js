import React from "react";
import {Box, ButtonBase, Card, CardMedia} from "@material-ui/core";
import {Link, useLocation, useRouteMatch} from "react-router-dom";
import translate from "../../../../../translate";
import Typography from "@material-ui/core/Typography";
import Store from "../../../../../redux/store";

const RelationButton = (props) => {
  let {state} = useLocation();
  let {url} = useRouteMatch();

  const listRelationItems = () => {
    Store.dispatch({
      type: 'relationProps',
      payload: props,
    })
  }

  return (
    <ButtonBase
      style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
      component={Link}
      to={{
        pathname : url + '/relations/' + props.name,
        state : {
          ...state,
          label:props.label,
          caption:props.caption,
          parentModelName:props.parentModelName,
          parentModelId:props.parentModelId,
          imageBackGroundSize:props.imageBackGroundSize,
        }
      }}
      onClick={listRelationItems}
    >
      <Box
        style={{
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Card
          elevation={3}
          style={{
            width: 80,
            height: 80,
            borderRadius: 80,
          }}
        >
          <CardMedia
            image={props.icon}
            title={translate(props.label)}
            style={{
              width: 80,
              height: 80,
              backgroundSize: 50,
            }}
          />
        </Card>
        <Typography
          style={{
            fontSize: 13,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {translate(props.label)}
        </Typography>
      </Box>
    </ButtonBase>
  )
}

export default RelationButton;