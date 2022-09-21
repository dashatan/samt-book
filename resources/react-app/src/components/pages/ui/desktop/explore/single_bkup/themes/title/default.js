import React from "react";
import {connect} from "react-redux";
import {Box, Container} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    singleBlock: state.singleBlock
  }
};

class DefaultTitle extends React.Component {
  render() {
    return (
      <Container>
        {this.props.singleBlock
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
                image={this.props.singleBlock.image}
                title={this.props.singleBlock.title}
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
                  {this.props.singleBlock.title}
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
      </Container>
    )
  }
}

export default connect(mapStateToProps)(DefaultTitle);
