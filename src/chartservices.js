var city1Categories = 10,
  city2Categories = 10;
google.charts.load("current", { packages: ["corechart", "bar"] });
google.charts.setOnLoadCallback(drawTitleSubtitle);
var materialChart, data;
function drawTitleSubtitle() {
  data = new google.visualization.DataTable();
  data.addColumn("string", "categoria");

  data.addColumn("number", "CITY 1");
  data.addColumn("number", "CITY 2");

  data.addRows([["nada cargado", undefined, undefined]]);

  var options = {
    chart: {
      title: "FACILITY DENSITY BY LOCATION",
      subtitle: "Based on an area of 1km radius",
    },
    hAxis: {
      title: "TYPE OF SERVICE",
      format: "h:mm a",
      viewWindow: {
        min: [7, 30, 0],
        max: [17, 30, 0],
      },
    },
    vAxis: {
      title: "Rating (scale of 1-40)",
    },
    width: 400,
    height: 300,
  };

  materialChart = new google.charts.Bar(
    document.getElementById("chart_services")
  );
  materialChart.draw(data, options);
}

function drawCity1Places(city, numberOfPlaces) {
  data.setValue(0, 0, facility);
  data.setValue(0, 1, numberOfPlaces);

  data.setColumnLabel(1, city);

  materialChart.draw(data, google.charts.Bar.convertOptions({}));
}

function drawCity2Places(city, numberOfPlaces) {
  data.setValue(0, 0, facility);
  data.setValue(0, 2, numberOfPlaces);

  data.setColumnLabel(2, city);

  materialChart.draw(data, google.charts.Bar.convertOptions({}));
}
module.exports = { drawCity1Places, drawCity2Places };
