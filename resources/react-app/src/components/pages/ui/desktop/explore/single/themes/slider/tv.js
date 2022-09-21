import React from "react";
import Slider from "../../../../Slider";
import {Skeleton} from "@material-ui/lab";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        baseUrl: state.baseUrl,
    }
};

class TVSlider extends React.Component {
    render() {
        return (
            <div style={{position: 'relative', backgroundColor: '#000000'}}>
                <img src={`${this.props.baseUrl}/images/tv.webp`} alt="" style={{width: '100%', height: '100%', zIndex: 10, position: 'absolute', top: 0, right: 0, pointerEvents: 'none'}}/>
                {this.props.slides.length > 0 ?
                    <Slider slides={this.props.slides} style={{padding: '12px 0', margin: '0 12px'}}/> :
                    <Skeleton height={200} variant='rect' animation="wave"/>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(TVSlider);
