import React from "react";
import Store from "../../../../../redux/store";
import {TextField} from '@material-ui/core';


export default class SearchText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText:'',
        }
    }

    setSearchText = (e) => {
        this.setState({searchText:e.target.value});
        Store.dispatch({type:'filterSearchText',payload:e.target.value});
    };

    render() {
        return (
            <div>
                <TextField type='search' placeholder={this.props.placeholder}  onChange={this.setSearchText} className='search-text' value={this.state.searchText}/>
            </div>
        )
    }


}
