import React from "react";
import {Box} from "@material-ui/core";
import {connect} from "react-redux";

const mapStateToProps = (state)=>{
  return {
    baseUrl:state.baseUrl,
  }
}

class EditRelation extends React.Component{
  render() {
    return(<Box>EditRelation</Box>)
  }
}

export default connect(mapStateToProps)(EditRelation);