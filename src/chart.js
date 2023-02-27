// Load the Visualization API and the corechart package.
google.charts.load("current", { packages: ["corechart"] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Topping");
  data.addColumn("number", "Slices");
  data.addRows([
    ["Mushrooms", 3],
    ["Onions", 1],
    ["Olives", 1],
    ["Zucchini", 1],
    ["Pepperoni", 2],
  ]);

  // Set chart options
  var options = {
    title: "How Much Pizza I Ate Last Night",
    width: 400,
    height: 300,
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(
    document.getElementById("chart_div")
  );
  chart.draw(data, options);
}

google.charts.load("current", {
  packages: ["geochart"],
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  var data = google.visualization.arrayToDataTable([
    ["Country", "Median income"],
    ["Monaco", 186080],
    ["Bermuda *", 122470],
    ["Switzerland", 90600],
    ["Luxembourg", 88190],
    ["Norway", 83880],
    ["Ireland", 76110],
    ["United States", 70930],
    ["Denmark", 68300],
    ["Singapore", 64010],
    ["Iceland", 63460],
    ["Qatar", 62310],
    ["Sweden", 59540],
    ["Australia", 57170],
    ["Netherlands", 55200],
    ["Hong Kong *", 54460],
    ["Finland", 53510],
    ["Austria", 52760],
    ["Germany", 51660],
    ["Belgium", 50490],
    ["Israel", 49290],
    ["Canada", 48310],
    ["Macao *", 46450],
    ["New Zealand", 45230],
    ["United Kingdom", 44480],
    ["France", 44160],
    ["Japan", 42650],
    ["United Arab Emirates", 41770],
    ["Italy", 35990],
    ["South Korea", 35110],
    ["Brunei", 30320],
    ["Spain", 29690],
    ["Portugal", 23890],
    ["Saudi Arabia", 21540],
    ["Greece", 20000],
    ["Hungary", 17740],
    ["Croatia", 17630],
    ["Poland", 16850],
    ["Romania", 14160],
    ["Costa Rica", 12310],
    ["China", 11880],
    ["Russia", 11610],
    ["Malaysia", 10710],
    ["Argentina", 9960],
    ["Turkey", 9900],
    ["Mexico", 9590],
    ["Brazil", 7740],
    ["Thailand", 7090],
    ["South Africa", 6530],
    ["Ecuador", 5960],
    ["Indonesia", 4180],
    ["Ukraine", 4120],
    ["Sri Lanka", 4030],
    ["Morocco", 3620],
    ["Vietnam", 3590],
    ["Philippines", 3550],
    ["Iran", 3530],
    ["Egypt", 3350],
    ["Bangladesh", 2570],
    ["India", 2150],
    ["Nigeria", 2080],
    ["Cameroon", 1590],
    ["Cambodia", 1580],
    ["Pakistan", 1470],
    ["Nepal", 1220],
    ["Myanmar", 1170],
    ["Timor-Leste", 1140],
    ["Afghanistan", 390],
    ["Kazakhstan", 10041],
    ["Mongolia", 4535],
    ["Chile", 16503],
    ["Peru", 6692],
    ["Bolivia", 3415],
    ["Colombia", 6131],
    ["Uruguay", 17021],
    ["Paraguay", 5400],
    ["Algeria", 3765],
    ["Benin", 1428],
    ["Burundi", 237],
    ["Cameroon", 1662],
    ["Mali", 918],
    ["Burkina Faso", 918],
    ["Chad", 696],
    ["Somalia", 446],
    ["Sudan", 764],
    ["Jordan", 4406],
    ["Palestine", 3664],
    ["Yemen", 691],
  ]);

  var options = {};

  // var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

  //chart.draw(data, options);
}
