import React, {useEffect} from 'react';
import Swiper from "swiper";
import "swiper/css/swiper.css";
import Box from "@material-ui/core/Box";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

export default function Glider(props) {
  let glides = props.glides;
  useEffect(() => {
    new Swiper('#' + props.id, {
      slidesPerView: 3,
      spaceBetween: 30,
    });
  }, [])

  return (
    <Box className="swiper-container" id={props.id} style={{height: 150}}>
      <Box className="swiper-wrapper">
        {glides.map((glide, key) => {
          return (
            <Box
              key={key}
              id={`glide${key}`}
              onClick={() => {
                props.onClick(glide)
              }}
              className="swiper-slide"
              style={{
                backgroundColor: '#ffffff',
              }}
            >
              <Paper
                elevation={3} style={{
                height: document.getElementById(`glide${key}`)
                  ? document.getElementById(`glide${key}`).clientWidth
                  : 100
                ,
                width: '100%',
                borderRadius: 20,
              }}
              >
                <CardMedia
                  image={glide.image}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20,
                    backgroundSize: 'cover'
                  }}
                />
              </Paper>
              <Box style={{height: 5}}/>
              <Box
                style={{
                  height: 45,
                  overflow: 'auto',
                  padding:'0 5px'
                }}
              >
                <Typography variant="caption" id={`glide-title-${key}`}>
                  {glide.label}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}