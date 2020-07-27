import React from "react";
import { Nav, Navbar } from "reactstrap";
import DateSelector from "./DateSelector";
import Coordinates from "./Coordinates";
import LayerPicker from "../LayerPicker";
import sizes from "react-sizes";

const Dashboard = props => (
  <Navbar className="fixed-bottom navbar-light">
    <Nav>
      {!props.mobileVersion && (
        <li className="logos">
          <div className="site-logo">
            <span className="p">P</span>
            <span className="three">3</span>
            <span className="aqua">Aqua</span>
          </div>
          <a
            href="http://yvonnecoady.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="logo"
              src="/images/modsquad_light.png"
              alt="MOD Squad Lab Logo"
            />
          </a>
        </li>
      )}

      <LayerPicker
        toggleChlor={props.toggleChlor}
        displayChlor={props.displayChlor}
        mobileVersion={props.mobileVersion}
      />
      <Coordinates
        addMarker={props.addMarker}
        toggleDropPin={props.toggleDropPin}
        droppingPin={props.droppingPin}
        mobileVersion={props.mobileVersion}
      />

      <DateSelector
        onChangeDate={props.onChangeDate}
        curDate={props.curDate}
        dateList={props.dateList}
        errorMsg={props.errorMsg}
        mobileVersion={props.mobileVersion}
      />
    </Nav>
  </Navbar>
);

export default Dashboard;

//export default Dashboard;
