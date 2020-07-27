import React, { Component } from "react";

class ColorBar extends Component {
  render() {
    let infoBox = {...this.props.infoBox};
    let infoBoxClass = infoBox.lat ? "infobox" : "";
    let algae = infoBox.algae;
    if (algae) {algae = algae.toFixed(3)}
    if (algae&&algae==1.00) {algae="N/A"}
    console.log(algae);
    return (
      <div className="colorbar">
        <div>
          <div className="info" onClick={() => this.props.toggleInfo()}>
            <i className="fas fa-info-circle" />
          </div>
          <div className={infoBoxClass}>
            {infoBox.lat &&
              <div className="algaeconc">
                <div><span className="label">Lat:</span><span>{infoBox.lat.toFixed(3)}</span></div>
                <div><span className="label">Lon:</span><span>{infoBox.lon.toFixed(3)}</span></div>
                <div><div className="label">Concentration:</div><div>{algae} mg/m<sup>3</sup></div></div>
              </div>
            }
          </div>
        </div>

        <img
          src="/images/chl_colorbar.png"
          alt="Color Scale"
          className="colorscale"
        />
      </div>
    )
  }
}

export default ColorBar;
