import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Box, TextField} from "@material-ui/core";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  }
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: props.lat ? props.lat : 0,
      lng: props.lng ? props.lng : 0,
    }
  }


  componentDidMount() {
    let _this = this;
    let lat = this.state.lat;
    let lng = this.state.lng;
    let myMap = L.map('location').setView([lat, lng], 9);
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(myMap);
    let flatMarker = L.icon({
      iconUrl: this.props.baseUrl + '/icons/leaflet/home.svg',
      // shadowUrl: 'leaf-shadow.png',
      iconSize: [40, 40], // size of the icon
      // shadowSize: [50, 64], // size of the shadow
      iconAnchor: [20, 39], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    })
    let marker = L.marker([lat, lng],{icon:flatMarker}).addTo(myMap);
    myMap.on('move', function () {
      marker.setLatLng(myMap.getCenter());
    });
    myMap.on('dragend', function (e) {
      myMap.getCenter();
      let position = marker.getLatLng();
      lat = Number(position['lat']).toFixed(5);
      lng = Number(position['lng']).toFixed(5);
      _this.setState({
        lat,
        lng
      })
      _this.props.onChange(lat, lng);
    });
    myMap.invalidateSize();
  }

  render() {
    return (
      <div>
        <TextField variant='outlined'
                   size='small'
                   value={this.state.lat + ',' + this.state.lng}
                   name='location'
                   label='موقعیت جغرافیایی'
                   style={{
                     width: '100%',
                     marginBottom: 20
                   }}/>
        <Box id='location' style={{
          width: '100%',
          height: 150,
        }}/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Map);
