var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
}

Plotly.d3.json('https://raw.githubusercontent.com/abahgat/opendata-milano/master/geojson/quartieri.geojson', function(redjson) {
  sources=[];
  for (i=0; i < redjson['features'].length; i++) {
      sources.push({"type": "FeatureCollection", 'features': [redjson['features'][i]]});
  };

  lays=[];
  for (i=0; i < sources.length; i++) {
    lays.push({
      sourcetype: 'geojson',
      source: sources[i],
      below: "water",
      type: 'fill',
      color: getColorForPercentage(0.01 * sources[i]['features'][0]["properties"]['ID_NIL']),
      opacity: 0.8,
    });
  }
  console.log(lays);

    Plotly.newPlot("graphDiv", [{
      type: 'scattermapbox',
      lat: [46],
      lon: [-74],
      colorscale: 'RdBu'
    }], {
      title: "Milan Tweets",
      height: 600,
      width: 600,
      mapbox: {
        center: {
          lat: 45.47043,
          lon: 9.179307
        },
        style: 'light',
        zoom: 10.0,
        layers: lays
      }
    }, {
      mapboxAccessToken: 'pk.eyJ1IjoiZXRwaW5hcmQiLCJhIjoiY2luMHIzdHE0MGFxNXVubTRxczZ2YmUxaCJ9.hwWZful0U2CQxit4ItNsiQ'
    });


});

// Plotly.d3.csv('https://raw.githubusercontent.com/bcdunbar/datasets/master/meteorites_subset.csv', function(err, rows){
//
//   var classArray = unpack(rows, 'class');
//   var classes = [...new Set(classArray)];
//
//   function unpack(rows, key) {
//     return rows.map(function(row) { return row[key]; });
//   }
//
//   var data = classes.map(function(classes) {
//     var rowsFiltered = rows.filter(function(row) {
//         return (row.class === classes);
//     });
//     return {
//        type: 'scattermapbox',
//        name: classes,
//        lat: unpack(rowsFiltered, 'reclat'),
//        lon: unpack(rowsFiltered, 'reclong')
//     };
//   });
//
//   console.log(data)
//
//   var layout = {
//      title: 'Meteorite Landing Locations',
//      font: {
//          color: 'white'
//      },
//     dragmode: 'zoom',
//     mapbox: {
//       center: {
//         lat: 38.03697222,
//         lon: -90.70916722
//       },
//       domain: {
//         x: [0, 1],
//         y: [0, 1]
//       },
//       style: 'dark',
//       zoom: 1
//     },
//     margin: {
//       r: 20,
//       t: 40,
//       b: 20,
//       l: 20,
//       pad: 0
//     },
//     paper_bgcolor: '#191A1A',
//     plot_bgcolor: '#191A1A',
//     showlegend: true,
//      annotations: [{
//          x: 0,
//        y: 0,
//        xref: 'paper',
//        yref: 'paper',
//          text: 'Source: <a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh" style="color: rgb(255,255,255)">NASA</a>',
//          showarrow: false
//      }]
//   };
//
//   Plotly.setPlotConfig({
//     mapboxAccessToken: 'pk.eyJ1IjoiZXRwaW5hcmQiLCJhIjoiY2luMHIzdHE0MGFxNXVubTRxczZ2YmUxaCJ9.hwWZful0U2CQxit4ItNsiQ'
//   });
//
//
//   Plotly.plot(document.getElementById('graphDiv'), data, layout, {showSendToCloud: true});
// });
