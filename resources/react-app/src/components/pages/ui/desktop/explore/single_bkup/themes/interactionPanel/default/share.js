import React from "react";
import Button from '@material-ui/core/Button';
import {Share} from '@material-ui/icons';
import translate from "../../../../../../../../translate";

export default class ShareButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  share = () => {
    this.setState({loading: true});
    if (navigator.share) {
      navigator.share({
        title: this.props.title,
        text: this.props.text,
        url: this.props.url,
      }).then((e) => {
        this.setState({loading: false})
      }).catch((error) => console.log('Error sharing', error));
    }
  };

  render() {
    return (
      <Button
        style={{
          borderRadius: 100,
          width: '100%'
        }}
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<Share color="primary"/>}
        onClick={this.share}
      >
        {translate('اشتراک')}
      </Button>
    )
  }
}
