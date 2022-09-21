import React from "react";
import {connect} from "react-redux";
import {Grid} from "@material-ui/core";

const mapStateToProps = (state) => {
    return {
        baseUrl: state.baseUrl,
        singleBlock: state.singleBlock,
    }
};

class AntiqueRelationsPanel extends React.Component{
    render() {
        return(
            <Grid container spacing={3} className='grid-container'>
                {[...Array(8)].map((x, i) => {
                    return (
                        <Grid key={i} item xs={6} className='grid-item'>
                            <div style={{position: 'relative', minHeight: 165, padding: 30}}>
                                <div style={{
                                    backgroundColor: 'beige',
                                    width: 97,
                                    height: 140,
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <img src={this.props.baseUrl + '/images/icons/classes/yellow-shadow/Factory.svg'} alt="" style={{width: 60}}/>
                                    <p style={{fontSize: 13, textAlign: 'center'}}>واحدهای تولیدی-صنعتی</p>
                                </div>
                                <img src={this.props.baseUrl + '/images/pic-frame.png'} alt="" style={{position: 'absolute', right: 0, top: 0, width: '100%', pointerEvents: 'none'}}/>
                            </div>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }
}
export default connect(mapStateToProps)(AntiqueRelationsPanel);
