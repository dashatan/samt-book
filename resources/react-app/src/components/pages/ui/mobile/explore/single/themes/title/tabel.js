import React from "react";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        baseUrl: state.baseUrl,
    }
};

class TitleOnTheTable extends React.Component{
    render() {
        return(
            <div style={{position: 'relative', minHeight: 140}}>
                <img src={`${this.props.baseUrl}/images/table.jpg`} alt="" style={{width: '100%', zIndex: 10, position: 'absolute', top: 30, right: 0, pointerEvents: 'none'}}/>
                <p style={{
                    textAlign: 'center',
                    position: 'absolute',
                    width: '85%',
                    minHeight: 20,
                    margin: 0,
                    padding: 10,
                    zIndex: 11,
                    backgroundColor: 'beige',
                    whiteSpace: 'nowrap',
                    overflowX: 'auto'
                }}>{this.props.title}</p>
            </div>
        )
    }
}
export default connect(mapStateToProps)(TitleOnTheTable);
