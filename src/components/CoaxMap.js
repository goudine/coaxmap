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

import SliderControl from "./SliderControl";
import Chlorophyll from "./Overlays";
import { azureMapsKey } from "../azureMapsKey.json";

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
    console.log("wwoww: ", azureMapsKey);
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
          attribution="&amp;copy 1992 - 2020 TomTom"
          url="https://atlas.microsoft.com/map/tile?subscription-key={subscriptionKey}&api-version=2.0&zoom={z}&x={x}&y={y}&tileSize=256&tilesetId={tilesetId}&language={language}&view={view}"
          id="azure.satellite"
          subscriptionKey={azureMapsKey}
          tilesetId="microsoft.imagery"
          language="en-US"
          view="Auto"
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
