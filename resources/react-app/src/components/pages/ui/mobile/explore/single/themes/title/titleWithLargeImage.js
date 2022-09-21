import React from "react";
import {Box} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";

export default function TitleWithLargeImage(props) {
  let image = new Image();
  image.src = props.image;
  let isVertical = image.height > image.width;

  return (
    <Box>
      {props.text && props.image
        ?
        <Box>
          <a
            style={{
              height: 200,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
            href={image.src}
            data-fancybox={props.id}
          >
            <img
              style={{width: isVertical ? 'auto' : '100%', height: isVertical ? '100%' : 'auto'}}
              src={image.src}
              alt={props.text}
            />
          </a>
          <Box style={{padding: 10}}>
            <Typography style={{fontSize: 16}}>
              {props.text}
            </Typography>
          </Box>
        </Box>
        :
        <Box>
          <Skeleton height={200} variant="rect" animation="wave"/>
          <Skeleton style={{margin: '10px 16px'}} height={50} variant="text" animation="wave"/>
        </Box>
      }
    </Box>
  )
}