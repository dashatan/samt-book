import React from 'react';
import TuneIcon from '@material-ui/icons/Tune';
import translate from "../../../../translate";
import {Link, Route, Switch} from "react-router-dom";
import FilterModal from "./filter-modal";
import Button from "@material-ui/core/Button";

export default class Filter extends React.Component {
  render() {
    return (
      <div>
        <Button
          focusRipple
          variant="contained"
          size="small"
          color="secondary"
          component={Link}
          to={this.props.match.url + '/filter'}
          style={{
            borderRadius:100,
          }}
          startIcon={<TuneIcon/>}
        >
          {translate('جستجوی پیشرفته')}
        </Button>
        <Switch>
          <Route path={this.props.match.path + '/filter'} component={FilterModal}/>
        </Switch>
      </div>
    )
  }
}
