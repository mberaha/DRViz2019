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

// function drwaMap() {
//   console.log("AAAAAA")
//   var data = {
//      type: 'scattermapbox',
//      name: classes,
//      lat: lats,
//      lon: longs
//   };
//
//   var layout = {
//      title: 'Tweets in Milan',
//      font: {
//          color: 'white'
//      },
//     dragmode: 'zoom',
//     mapbox: {
//       center: {
//         lat: 45.47043,
//         lon: 9.179307
//       },
//       domain: {
//         x: [0, 1],
//         y: [0, 1]
//       },
//       style: 'dark',
//       zoom: 10.7
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
//   };
//
//   Plotly.setPlotConfig({
//     mapboxAccessToken: 'pk.eyJ1IjoiZXRwaW5hcmQiLCJhIjoiY2luMHIzdHE0MGFxNXVubTRxczZ2YmUxaCJ9.hwWZful0U2CQxit4ItNsiQ'
//   });
//
//
//   Plotly.plot(document.getElementById('map'), data, layout, {showSendToCloud: true});
// };

function drwaMap() {
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

      Plotly.newPlot("map", [{
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
};


google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawWordChart);

function drawWordChart() {
      var wordsAndScores = $.ajax({
                     url: "example_words.json",
                     dataType: "json",
                     async: false,
                     }).responseText;
      wordsAndScores = JSON.parse(wordsAndScores);
      data = [["Word", "Weight"]]
      Array.prototype.push.apply(data, wordsAndScores);
      var data = google.visualization.arrayToDataTable(data);
      var options = {
        title: 'Most Influential Words',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Weight',
          minValue: 0
        },
        vAxis: {
          title: ''
        }
      };

      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    }
