import React from "react";
import {Box, CardMedia, Grid, Typography} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";

export default function DefaultTitle(props) {
  return (
    <Box style={{padding: 10}}>
      {props.text && props.image
        ? <Grid container spacing={3}>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CardMedia
              image={props.image}
              style={{
                borderRadius: "50%",
                width: 80,
                height: 80,
                backgroundSize: "cover",
              }}
            />
          </Grid>
          <Grid
            item
            xs={8}
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box>
              <Typography style={{fontSize: 16}}>
                {props.text}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        : <Grid container spacing={3}>
          <Grid item xs={4}>
            <Skeleton height={80} width={80} variant="circle" animation="wave"/>
          </Grid>
          <Grid item xs={8}>
            <Skeleton height={50} variant="text" animation="wave"/>
            <Skeleton height={50} variant="text" animation="wave"/>
          </Grid>
        </Grid>
      }
    </Box>
  )
}
