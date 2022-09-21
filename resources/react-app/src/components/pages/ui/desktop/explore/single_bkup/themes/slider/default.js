import React from "react";
import Slider from "../../../../Slider";
import {Skeleton} from "@material-ui/lab";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        baseUrl: state.baseUrl,
    }
};

class DefaultSlider extends React.Component {
    render() {
        return (
            <div>
                {this.props.slides.length > 0 ?
                    <Slider slides={this.props.slides} /> :
                    <Skeleton height={200} variant='rect' animation="wave"/>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(DefaultSlider);
