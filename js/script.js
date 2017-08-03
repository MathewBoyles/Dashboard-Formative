google.charts.load("current", {
  packages: ["corechart", "treemap", "geochart"],
  mapsApiKey: "AIzaSyCAGwOj-7XD8nrxHWl2hwFHj8tvOsy6rJg"
});

var dashboard = {
  charts: {},
  json: {}
};

google.charts.setOnLoadCallback(drawCharts);

function drawCharts () {
  $.ajax({
    url: "js/data.json",
    dataType: "json",
    success: function(data){
      dashboard.json = data;
      ageChart();
      genderChart();
      bornChart();
    }
  })
}

function ageChart() {
  var jsonData = dashboard.json;
  var addData = [
    ["Age", "Number"]
  ];
  $.each(jsonData.age, function(age, count){
    addData.push([age, count]);
  });
  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    title: "Age",
    pieHole: 0.4,
  };
  var chart = new google.visualization.PieChart($("#chart-age")[0]);
  chart.draw(data, options);
  dashboard.charts["age"] = {
    chart: chart,
    data: data,
    options: options
  };
}


function genderChart() {
  var jsonData = dashboard.json;
  var addData = [
    ["Gender", "Number"]
  ];
  $.each(jsonData.gender, function(gender, count){
    addData.push([gender, count]);
  });
  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    title: "Gender"
  };
  var chart = new google.visualization.PieChart($("#chart-gender")[0]);
  chart.draw(data, options);
  dashboard.charts["gender"] = {
    chart: chart,
    data: data,
    options: options
  };
}



function bornChart() {
  var jsonData = dashboard.json;
  var addData = [
    ["Name", "Parent" , "Number"]
  ];
  var hasCountry = [];

  addData.push(["Global", null, 0]);

  $.each(jsonData.born, function(id, data){
    if(hasCountry.indexOf(data.country) < 0){
      addData.push([data.country, "Global", 0]);
      hasCountry.push(data.country);
    }
    addData.push([data.city, data.country, data.count]);
  });

  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    minColor: "#f00",
    midColor: "#ddd",
    maxColor: "#0d0",
    headerHeight: 15,
    fontColor: "black",
    showScale: true,
    height: 500
  };
  var chart = new google.visualization.TreeMap($("#chart-born")[0]);
  chart.draw(data, options);

  google.visualization.events.addListener(chart, "select", function(){
    $("#chart-born-reset").removeClass("hide");
  });

  $("#chart-born-reset").click(function(){
    dashboard.charts["born"].chart.setSelection(null);
    $(this).addClass("hide");
  });

  dashboard.charts["born"] = {
    chart: chart,
    data: data,
    options: options
  };
}
