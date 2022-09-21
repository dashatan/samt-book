import React from "react";
import {connect} from "react-redux";
import {Box, ButtonBase, Card, CardMedia, Grid} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    block: state.singleBlock,
    subset: state.singleBlockSubset,
    subsetIsLoading: state.singleBlockSubsetIsLoading,
  }
};

class DefaultSubsetPanel extends React.Component {
  render() {
    if (!this.props.subset || this.props.subsetIsLoading) {
      return (
        <Box style={{padding: 10}}>
          {[...Array(8)].map((x, i) => {
            return (
              <Skeleton
                key={i}
                variant="rect"
                height={100}
                style={{
                  borderRadius: 20,
                  margin: "20px 0",
                }}
                animation="wave"
              />
            );
          })}
        </Box>
      )
    }
    return (
      <Box
        style={{
          padding: 10,
          marginTop: 10
        }}
      >
        {this.props.subset.map((block, key) => {
          return (
            <ButtonBase
              key={key}
              style={{width: "100%"}}
              onClick={() => {
                //   Store.dispatch({
                //       type: "singleBlock",
                //       payload: block,
                //   });
                // Store.dispatch({
                //   type: "singleBlockSubset",
                //   payload: [],
                // });
                // Store.dispatch({
                //   type: "singleSlides",
                //   payload: [],
                // });
                // Store.dispatch({
                //   type: "singleBlockRelations",
                //   payload: [],
                // });
                // Store.dispatch({
                //   type: "singleBlockContact",
                //   payload: [],
                // });
              }}
              component={Link}
              to={`/s/${block.class}/${block.id}`}
            >
              <Card
                style={{
                  height: 100,
                  width: "100%",
                  borderRadius: 20,
                  marginBottom: 20,
                  display: "flex",
                }}
                elevation={3}
              >
                <Grid container>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    xs={4}
                  >
                    <CardMedia
                      style={{
                        width: 80,
                        height: 80,
                        backgroundSize: "cover",
                        borderRadius: "50%",
                      }}
                      image={block.image}
                      title={block.title}
                    />
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                    xs={8}
                  >
                    <Typography style={{fontSize: 14}}>{block.title}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </ButtonBase>
          );
        })}
      </Box>
    )
  }
}

export default connect(mapStateToProps)(DefaultSubsetPanel);
