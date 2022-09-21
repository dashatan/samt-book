import React from "react";
import {connect} from "react-redux";
import {Box} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";

const mapStateToProps = (state) => {
  return {
    singleBlock: state.singleBlock
  }
};

const TitleWithLargeImage = (props) => {
  let image = new Image();
  let isVertical = false;
  if (props.singleBlock) {
    image.src = props.singleBlock.image;
    isVertical = image.height > image.width;
  }

  return (
    <Box>
      {props.singleBlock
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
            data-fancybox="slide"
          >
            <img
              style={{width: isVertical ? 'auto' : '100%', height: isVertical ? '100%' : 'auto'}}
              src={image.src}
              alt={props.singleBlock.title}
            />
          </a>
          <Box style={{padding: '10px 16px'}}>
            <Typography style={{fontSize: 16}}>
              {props.singleBlock.title}
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

export default connect(mapStateToProps)(TitleWithLargeImage);
