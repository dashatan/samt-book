import React from "react";
import axios from "axios";
import Store from "./redux/store";
import Button from "@material-ui/core/Button";
import {CircularProgress, Container} from "@material-ui/core";
import {Check} from "@material-ui/icons";

const baseUrl = Store.getState().baseUrl;

export default class Import extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            producers: [],
            allow: true,
            loading: false,
        };

    }

    componentDidMount() {
        console.log('asdasd');
    }

    getProducers = () => {
        this.setState({loading: true});
        const url = 'https://samtbook.ir/api/producers';
        axios.post(url).then(e => {
            this.setState({loading: false});
            console.log(e.data);
            this.setState({producers: e.data.producers})
        }).catch(e => {
            this.setState({loading: false});
            console.log(e);
            console.log(e.response);
        })
    };

    storeCollection = () => {
        axios.post(baseUrl + '/api/storeProducer', {producers: this.state.producers}).then(e => {
            console.log(e);
        }).catch(e => {
            console.log(e);
            console.log(e.response);
        });
    };

    render() {
        return (
            <Container>
                {this.state.producers.length === 0 ?
                    <Button style={{direction: 'ltr'}} variant='contained' color='secondary' startIcon={this.state.loading ? <CircularProgress size={20} color='inherit'/> : <Check/>}
                            onClick={this.getProducers}>Get Collection</Button>
                    :
                    <Button variant='contained' color='secondary' onClick={this.storeCollection}>Store Collection</Button>
                }
            </Container>
        )
    }


}
