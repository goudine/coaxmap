const BLANK_MONTH = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
  9: false,
  10: false,
  11: false,
  12: false,
  13: false,
  14: false,
  15: false,
  16: false,
  17: false,
  18: false,
  19: false,
  20: false,
  21: false,
  22: false,
  23: false,
  24: false,
  25: false,
  26: false,
  27: false,
  28: false,
  29: false,
  30: false,
  31: false
};

// quick function to get the number of days in a month
// note that year is required due to leap years...
export function getNumDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// does preliminary processing from txt file into json
export function getDateJson(dateArr) {
  return dateArr.map(date => {
    let parsedDate = date.split("-");
    return {
      year: Number(parsedDate[0]),
      month: Number(parsedDate[1]) - 1,
      date: Number(parsedDate[2])
    };
  });
}

// creates a more functional json object where each year
// is a property having months as subproperties
// and each month has a day with a t/f flag
// where only days with data will have a 'true' flag
export function createValidDateList(dates) {
  let dateList = {};
  dates.forEach(d => {
    if (!d || d.year === 0) return;
    // check to see if year exists
    if (!dateList[d.year]) {
      //dateList[d.year] = JSON.parse(JSON.stringify(BLANK_YEAR));
      dateList[d.year] = {};
    }

    if (!dateList[d.year][d.month]) {
      dateList[d.year][d.month] = JSON.parse(JSON.stringify(BLANK_MONTH));
    }

    // flag all dates contained in list as true
    if (!dateList[d.year][d.month][d.date]) {
      dateList[d.year][d.month][d.date] = true;
    }
  });

  return dateList;
}

// creates the path to the image on the server to be rendered by Leaflet
export function getImgPath(date) {
  let y = date.getFullYear().toString();
  let m = (date.getMonth() + 1).toString();
  let d = date.getDate().toString();
  d.length === 1 && (d = "0" + d);
  m.length === 1 && (m = "0" + m);
  return "/OLCI/" + y + "/" + m + "/" + d + "/polymer/overlay.png";
}

export function findLatestDate(dateList) {
  let validDate = new Date();
  let curDate, curMonth, curYear;
  let dateFound = false;
  while (!dateFound) {
    curDate = validDate.getDate();
    curMonth = validDate.getMonth();
    curYear = validDate.getFullYear();
    if (!dateList[curYear]) {
      validDate = new Date(Number(curYear) - 1, 12, 0);
      continue;
    }
    if (!dateList[curYear][curMonth]) {
      validDate = new Date(curYear, Number(curMonth), 0);
      continue;
    }
    if (!dateList[curYear][curMonth][curDate]) {
      validDate = new Date(curYear, curMonth, Number(curDate) - 1);
      continue;
    }
    dateFound = true;
  }
  return validDate;
}

export function checkIfDateIsValid(date, dateList) {
  let curDate = date.getDate();
  let curMonth = date.getMonth();
  let curYear = date.getFullYear();
  if (
    !dateList[curYear] ||
    !dateList[curYear][curMonth] ||
    !dateList[curYear][curMonth][curDate]
  ) {
    return "No data available";
  }
  return "";
}

export function getShortLatLng(latlng) {
  const lat = latlng.lat.toFixed(6);
  const lng = latlng.lng.toFixed(6);
  return { lat, lng };
}

export function getPngCoords(latlng) {
  const imgOrigin = { lat: 59.5, lng: -139.001 };
  const imgLat = imgOrigin.lat - latlng.lat;
  const imgLng = -1 * (imgOrigin.lng - latlng.lng);
  const x = Math.round(imgLng * (6493 / 17.499));
  //following didn't work because conversion from degrees lat to meters in 3857 is not linear
  //const y = Math.round(imgLat * (7823 / 12.499));
  //will have to take meters at 59.5 degrees and meters at lat, subtract and divide by 300 (since 300 meters per pixel)
  const metersOrigin = (Math.log(Math.tan((90 + 59.5) * Math.PI / 360)) / (Math.PI / 180))*20037508.34/180;
  const metersCurrent = (Math.log(Math.tan((90 + latlng.lat) * Math.PI / 360)) / (Math.PI / 180))*20037508.34/180;
  const y = Math.round(Math.abs(metersCurrent-metersOrigin)/300);
  console.log("x: "+x+" y: "+y+" imgLng: "+imgLng+" imgLat: "+imgLat+" lng: "+latlng.lng+" lat: "+latlng.lat+"metersOrigin: "+metersOrigin+" metersCurrent: "+metersCurrent);
  return { x, y };
}
