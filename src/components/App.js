import React, { Component } from "react";
import "../style/App.css";
import "../style/Dashboard.css";
import "../style/Popup.css";
import "../style/ColorBar.css";
import IntroModal from "./Modal";
import Dashboard from "./Dashboard";
import CoaxMap from "./CoaxMap";
import ColorBar from "./ColorBar";
import Spinner from "react-tiny-spin";
import withSizes from "react-sizes";
import {
  getImgPath,
  getDateJson,
  createValidDateList,
  findLatestDate,
  checkIfDateIsValid,
  getShortLatLng,
  getPngCoords,
  getPixelVal
} from "../helpers";
//import { getPixelData } from "./Coordinates";

const DEFAULT_VIEWPORT = {
  center: [49.299, -124.695],
  zoom: 8
};

const spinCfg = {
  width: 12,
  radius: 35
};

const CURSOR = {
  true: "crosshair",
  false: "grab"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curOverlay: "",
      date: new Date(),
      dateList: undefined,
      displayChlor: true,
      droppingPin: false,
      markers: [],
      modal: false, //TODO make true. false for dev only
      viewport: DEFAULT_VIEWPORT,
      zoneVisible: false,
      errorMsg: "",
      loading: true
    };
  }

  componentDidMount() {
    // gets the latest list of dates
    fetch("/OLCI/curDates.txt")
      .then(res => res.text())
      .then(
        result => {
          let dates = getDateJson(result.split("\n"));
          let dateList = createValidDateList(dates);
          let date = findLatestDate(dateList);
          let curOverlay = getImgPath(date);
          let errorMsg = checkIfDateIsValid(date, dateList);
          this.setState({ dateList, date, curOverlay, errorMsg });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        errorMsg => {
          this.setState({
            errorMsg
          });
        }
      );
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChangeDate = date => {
    let errorMsg = checkIfDateIsValid(date, this.state.dateList);
    let path = getImgPath(date);
    this.setState({
      curOverlay: path,
      date,
      errorMsg
    });
  };

  // this is to change the map cursor to crosshairs and back
  // during a pin drop
  toggleDropPin = () => {
    this.setState(prevState => ({
      droppingPin: !prevState.droppingPin
    }));
  };

  addMarker = e => {
    if (!this.state.droppingPin) return;
    const { markers } = this.state;
    const marker = getShortLatLng(e.latlng);
    const pngCoords = getPngCoords(e.latlng);
    console.log("lt/ln value is: ", pngCoords);
    markers.push({ ...marker, ...pngCoords });
    let pixelVal = getPixelVal(this.state.curOverlay, pngCoords);
    this.setState({
      markers,
      droppingPin: false
    });
  };

  toggleChlor = displayChlor => {
    this.setState({ displayChlor });
  };

  mouseMove = e => {
    console.log(e);
  };

  loading = e => {
    this.setState({ loading: false });
  };

  render() {
    return (
      <div id="page">
        {this.state.loading && <Spinner config={spinCfg} />}
        <IntroModal
          toggle={() => {
            this.toggleModal();
          }}
          show={this.state.modal}
        />
        <div className={"mapContainer"} id="mapContainer">
          <CoaxMap
            mouseMove={e => {
              this.mouseMove(e);
            }}
            viewport={this.state.viewport}
            curOverlay={this.state.curOverlay}
            displayChlor={this.state.displayChlor}
            zoneVisible={this.state.zoneVisible}
            markers={this.state.markers}
            addMarker={e => {
              this.addMarker(e);
            }}
            pointer={CURSOR[this.state.droppingPin]}
            loading={this.loading}
          />
        </div>
        <ColorBar toggleInfo={this.toggleModal} />
        <Dashboard
          displayChlor={this.state.displayChlor}
          toggleChlor={this.toggleChlor}
          toggleDropPin={this.toggleDropPin}
          droppingPin={this.state.droppingPin}
          addMarker={this.addMarker}
          onChangeDate={this.onChangeDate}
          curDate={this.state.date}
          dateList={this.state.dateList}
          errorMsg={this.state.errorMsg}
          mobileVersion={this.props.mobileVersion}
        />
      </div>
    );
  }
}

const mapSizesToProps = ({ width }) => ({
  mobileVersion: width && width < 768 ? true : false
});

export default withSizes(mapSizesToProps)(App);
