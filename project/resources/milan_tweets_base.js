Plotly.d3.csv('example_data.csv', function(err, rows){

  var classArray = unpack(rows, 'class');
  var classes = [...new Set(classArray)];

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }

  var data = classes.map(function(classes) {
    var rowsFiltered = rows.filter(function(row) {
        return (row.class === classes);
    });
    return {
       type: 'scattermapbox',
       name: classes,
       lat: unpack(rowsFiltered, 'latitude'),
       lon: unpack(rowsFiltered, 'longitude')
    };
  });

  var layout = {
     title: 'Tweets in Milan',
     font: {
         color: 'white'
     },
    dragmode: 'zoom',
    mapbox: {
      center: {
        lat: 45.47043,
        lon: 9.179307
      },
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      style: 'dark',
      zoom: 10.7
    },
    margin: {
      r: 20,
      t: 40,
      b: 20,
      l: 20,
      pad: 0
    },
    paper_bgcolor: '#191A1A',
    plot_bgcolor: '#191A1A',
    showlegend: true,
  };

  Plotly.setPlotConfig({
    mapboxAccessToken: 'pk.eyJ1IjoiZXRwaW5hcmQiLCJhIjoiY2luMHIzdHE0MGFxNXVubTRxczZ2YmUxaCJ9.hwWZful0U2CQxit4ItNsiQ'
  });


  Plotly.plot(document.getElementById('map'), data, layout, {showSendToCloud: true});
});


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


function drawWordCloud() {
  var wordsAndScores = $.ajax({
                 url: "example_words.json",
                 dataType: "json",
                 async: false,
                 }).responseText;
  wordsAndScores = JSON.parse(wordsAndScores);
  console.log(wordsAndScores)
  WordCloud(document.getElementById('wordcloud'), { list: wordsAndScores } );
}
