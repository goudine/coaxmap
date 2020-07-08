import React from "react";
import { ImageOverlay } from "react-leaflet";

const Chlorophyll = (props) => {
  return (
    <ImageOverlay
      bounds={[
        [59.5, -139.001],
        [47.001, -121.502],
      ]}
      url={props.curOverlay}
      opacity={0.9}
      onLoad={props.loading}
    />
  );
};

export default Chlorophyll;
