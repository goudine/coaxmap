import L from "leaflet";
import { MapControl } from "react-leaflet";
import "leaflet-side-by-side";
import { withLeaflet } from "react-leaflet";

class SliderControl extends MapControl {
  constructor(props, context) {
    super(props);
  }
  createLeafletElement(props) {
    const Slider = L.Control.sideBySide(props.left, props.right);
    return new Slider();
  }
}

export default withLeaflet(SliderControl);
