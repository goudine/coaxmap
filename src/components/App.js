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
  getPngCoords
} from "../helpers";

const DEFAULT_VIEWPORT = {
  center: [49.299, -124.695],
  zoom: 8
};

const spinCfg = {
  width: 12,
  radius: 35,
  color: "#ffffff"
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
      loading: true,
      infoBox: {}

    };
  }

  componentDidMount() {
    // gets the latest list of dates
    console.log("mounty");
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
          console.log("gotDates: ", date);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        errorMsg => {
          console.log("notgotdates");
          this.setState({
            errorMsg
          });
        }
      );
        console.log("out of mounty");
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChangeDate = date => {
    this.setState({ loading: true }, () => {
      let errorMsg = checkIfDateIsValid(date, this.state.dateList);
      let path = getImgPath(date);
      this.setState({
        curOverlay: path,
        date,
        errorMsg
      });
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
    //console.log("marker: ", getShortLatLng(e.latlng));
    //console.log("screen: ", getPngCoords(e.latlng));
    let x = getPngCoords(e.latlng);
    let yr = this.state.date.getFullYear().toString();
    let m = (this.state.date.getMonth() + 1).toString();
    let d = this.state.date.getDate().toString();
    d.length === 1 && (d = "0" + d);
    m.length === 1 && (m = "0" + m);
    //console.log(this.state.date);
    try {
      fetch('/express_backend?yr='+yr+'&m='+m+'&d='+d+'&x='+x.x+'&y='+x.y)
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          console.log("Error: ", result.error);
          return;
        }
        if (!result.lat) this.setState({infoBox: undefined});
        else this.setState({infoBox: {...result}});
      })
    } catch (error) {
      console.log("Error:", error)
    }


    if (!this.state.droppingPin) return;
    const { markers } = this.state;
    const marker = getShortLatLng(e.latlng);
    const pngCoords = getPngCoords(e.latlng);
    //console.log("lt/ln value is: ", pngCoords);
    markers.push({ ...marker, ...pngCoords });
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
    console.log("loading");
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
        <ColorBar toggleInfo={this.toggleModal} infoBox={this.state.infoBox} />
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
