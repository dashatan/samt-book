import React from "react";
import {connect} from "react-redux";
import {Box, Zoom} from "@material-ui/core";

import {withRouter} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import translate from "../../../../../translate";
import RelationButton from "../../side-components/relation/button";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    userToken: state.userToken,
    EditingCollection: state.EditingCollection,
    relations: state.relations,
  };
};

class Relations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showRelation = (relation) => {
    // console.log(relation)
  }

  render() {
    let delay = 0;
    return (
      <Box
        style={{
          paddingTop: 25,
        }}
      >
        <Grid
          container
          spacing={4}
          style={{
            justifyContent: "center",
          }}
          className="grid-container"
        >
          {this.props.relations.map((block, key) => {
            delay = delay + 50;
            const template = (
              <Zoom
                in={true}
                key={key}
                style={{
                  transitionDelay: `${delay}ms`,
                }}
              >
                <Grid item xs={4}>
                  <RelationButton
                    name={block.name}
                    icon={this.props.baseUrl + '/' + block.icon}
                    label={translate(block.label)}
                    caption={translate(this.props.EditingCollection.label)}
                    parentModelName={this.props.EditingCollection.modelName.replace('App\\', '')}
                    parentModelId={this.props.EditingCollection.id}
                  />


                  {/*<ButtonBase
										style={{
											display: "flex",
											flexFlow: "column",
											alignItems: "center",
											justifyContent: "flex-start",
										}}
										component={Link}
										to={this.props.match.url + '/relations/' + block.name}
										onClick={this.showRelation.bind(this, block)}>
										<Box
											style={{
												display: "flex",
												flexFlow: "column",
												alignItems: "center",
												justifyContent: "flex-start",
											}}>
											<Card
												elevation={3}
												style={{
													width: 80,
													height: 80,
													borderRadius: 80,
												}}>
												<CardMedia
													image={this.props.baseUrl + "/" + block.icon}
													title={translate(block.label)}
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
												}}>
												{translate(block.label)}
											</Typography>
										</Box>
									</ButtonBase>*/}
                </Grid>
              </Zoom>
            );
            if (block.show.includes(this.props.EditingCollection.class)) {
              return template;
            }
          })}
        </Grid>

      </Box>
    )
  }

}

export default withRouter(connect(mapStateToProps)(Relations));
