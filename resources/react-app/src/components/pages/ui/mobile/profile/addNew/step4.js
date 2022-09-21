import React from "react";
import { connect } from "react-redux";
import { Box, ButtonBase, Card, CardMedia, Fade } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import translate from "../../../../../translate";
import Typography from "@material-ui/core/Typography";

const mapStateToProps = state => {
    return {
        baseUrl: state.baseUrl,
        dataStoreOfAddNewItem: state.dataStoreOfAddNewItem,
        classesOfAddingNewItem: state.classesOfAddingNewItem,
        user: state.user
    };
};

class Step4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relations: []
        };
    }

    render() {
        return (
            <Fade in={true}>
                <Box
                    style={{
                        height: "calc(100vh - 139px)",
                        paddingTop: 20,
                        overflowY: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f8ff"
                    }}
                >
                    <div className="d-flex flex-wrap justify-content-center align-items-center p-3">
                        {this.state.relations &&
                            this.state.relations.map(relation => {
                                return (
                                    <Relation
                                        relationKey={relation.key}
                                        modelType={relation.relation.model}
                                        saveType={relation.relation.save_type}
                                        // parentModel={this.state.model}
                                        // parentInfo={this.state.info}
                                        // userId={this.state.userId}
                                        // locale={this.state.locale}
                                    />
                                );
                            })}
                    </div>
                </Box>
            </Fade>
        );
    }
}

export default connect(mapStateToProps)(Step4);
