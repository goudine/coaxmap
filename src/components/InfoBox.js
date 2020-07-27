import React from "react";

const ColorBar = props => (
  <div className="colorbar">
    <div className="info" onClick={() => props.toggleInfo()}>
      <i className="fas fa-info-circle" />
    </div>
    <img
      src="/images/chl_colorbar.png"
      alt="Color Scale"
      className="colorscale"
    />
  </div>
);

export default ColorBar;
