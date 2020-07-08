import React, { useEffect, Component } from "react";
import {
  Map,
  MapControl,
  TileLayer,
  ScaleControl,
  ImageOverlay,
  Marker,
  Popup,
} from "react-leaflet";
import { mapboxAccessToken } from "../mapboxAccessToken.json";
import SliderControl from "./SliderControl";
import Chlorophyll from "./Overlays";

class CoaxMap extends Component {
  onViewportChanged = (viewport) => {};

  render() {
    const left = (
      <Chlorophyll
        curOverlay={this.props.curOverlay}
        loading={this.props.loading}
      />
    );
    const right = (
      <Chlorophyll
        curOverlay={this.props.curOverlay}
        loading={this.props.loading}
      />
    );
    return (
      <Map
        // mousemove={e => this.mouseMove(e)}
        // mouseMove={this.props.mouseMove}
        onViewportChanged={this.onViewportChanged()}
        viewport={this.props.viewport}
        doubleClickZoom={true}
        onClick={this.props.addMarker}
        minZoom={6}
        maxBounds={[
          [44.887012, -111.137695], // southwest corner
          [59.92199, -144.624023], // northeast corner
        ]}
        style={{ cursor: this.props.pointer }}
      >
        {/* <SliderControl left={left} right={right} /> */}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
          id="mapbox.satellite"
          accessToken={mapboxAccessToken}
        />
        <ScaleControl imperial={false} maxWidth={200} />
        {/* {this.props.displayChlor && left} */}
        {this.props.markers.map((position, idx) => (
          <Marker key={`marker-${idx}`} position={position}>
            <Popup>
              {position.lat}, {position.lng}
            </Popup>
          </Marker>
        ))}
      </Map>
    );
  }
}

export default CoaxMap;
