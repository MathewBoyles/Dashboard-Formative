google.charts.load("current", {
  packages: ["corechart", "treemap", "geochart"],
  mapsApiKey: "AIzaSyBO2Xn3agIAeuTN8e0l4pwupUONZAodSnk"
});

var dashboard = {
  charts: {},
  json: {},
  colors: {
    min: "#3366cc",
    max: "#dc3912",
    background: "#222",
    text: "#EEE"
  }
};

google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
  $.ajax({
    url: "js/data.json",
    dataType: "json",
    success: function(data) {
      dashboard.json = data;
      ageChart();
      genderChart();
      ethnicityChart();
      bornChart();
      travelChart();
      ratingChart();
      holidayChart();
    }
  })
}

function ageChart() {
  var addData = [
    ["Age", "Number"]
  ];
  $.each(dashboard.json.age, function(age, count) {
    addData.push([age, count]);
  });
  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    height: 300,
    backgroundColor: dashboard.colors.background,
    legendTextStyle: {
      color: dashboard.colors.text
    },
    titleTextStyle: {
      color: dashboard.colors.text
    }
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
  var addData = [
    ["Gender", "Number"]
  ];
  $.each(dashboard.json.gender, function(gender, count) {
    addData.push([gender, count]);
  });
  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    height: 300,
    backgroundColor: dashboard.colors.background,
    legendTextStyle: {
      color: dashboard.colors.text
    },
    titleTextStyle: {
      color: dashboard.colors.text
    }
  };
  var chart = new google.visualization.PieChart($("#chart-gender")[0]);
  chart.draw(data, options);
  dashboard.charts["gender"] = {
    chart: chart,
    data: data,
    options: options
  };
}

function ethnicityChart() {
  var addData = [
    ["Ethnicity", "Number"]
  ];
  $.each(dashboard.json.ethnicity, function(ethnicity, count) {
    addData.push([ethnicity, count]);
  });
  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    height: 300,
    backgroundColor: dashboard.colors.background,
    legendTextStyle: {
      color: dashboard.colors.text
    },
    titleTextStyle: {
      color: dashboard.colors.text
    }
  };
  var chart = new google.visualization.PieChart($("#chart-ethnicity")[0]);
  chart.draw(data, options);
  dashboard.charts["ethnicity"] = {
    chart: chart,
    data: data,
    options: options
  };
}

function bornChart() {
  var addData = [
    ["Name", "Parent", "Number"]
  ];
  var hasCountry = [];

  addData.push(["Global", null, 0]);

  $.each(dashboard.json.born, function(id, data) {
    if (hasCountry.indexOf(data.country) < 0) {
      addData.push([data.country, "Global", 0]);
      hasCountry.push(data.country);
    }
    addData.push([data.city, data.country, data.count]);
  });

  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    minColor: dashboard.colors.min,
    maxColor: dashboard.colors.max,
    headerHeight: 15,
    fontColor: "black",
    showScale: true,
    height: 500
  };
  var chart = new google.visualization.TreeMap($("#chart-born")[0]);
  chart.draw(data, options);

  google.visualization.events.addListener(chart, "select", function() {
    $("#chart-born-reset").removeClass("hide");
  });

  $("#chart-born-reset").click(function() {
    dashboard.charts["born"].chart.setSelection(null);
    $(this).addClass("hide");
  });

  dashboard.charts["born"] = {
    chart: chart,
    data: data,
    options: options
  };
}

function travelChart() {
  var addData = [
    ["Travel Mode", "Number"]
  ];
  $.each(dashboard.json.travel, function(mode, count) {
    addData.push([mode, count]);
  });
  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    height: 500,
    backgroundColor: dashboard.colors.background,
    legendTextStyle: {
      color: dashboard.colors.text
    },
    titleTextStyle: {
      color: dashboard.colors.text
    },
    vAxis: {
      textStyle: {
        color: dashboard.colors.text
      }
    },
    hAxis: {
      textStyle: {
        color: dashboard.colors.text
      }
    }
  };
  var chart = new google.visualization.BarChart($("#chart-travel")[0]);
  chart.draw(data, options);
  dashboard.charts["travel"] = {
    chart: chart,
    data: data,
    options: options
  };
}

function ratingChart() {
  var addData = [
    ["Rating", "Votes", "Overall Average"]
  ];
  var ratings = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0
  }
  var rating_average = 0;
  $.each(dashboard.json.rating, function(id, rating) {
    ratings[rating + ""]++;
    rating_average += rating;
  });

  rating_average /= dashboard.json.responders;

  addData.push(["1 star", ratings["1"], rating_average]);
  addData.push(["2 stars", ratings["2"], rating_average]);
  addData.push(["3 stars", ratings["3"], rating_average]);
  addData.push(["4 stars", ratings["4"], rating_average]);
  addData.push(["5 stars", ratings["5"], rating_average]);


  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    height: 500,
    backgroundColor: dashboard.colors.background,
    legendTextStyle: {
      color: dashboard.colors.text
    },
    titleTextStyle: {
      color: dashboard.colors.text
    },
    vAxis: {
      title: "Rating",
      textStyle: {
        color: dashboard.colors.text
      }
    },
    hAxis: {
      title: "Votes",
      textStyle: {
        color: dashboard.colors.text
      }
    },
    seriesType: "bars",
    series: {
      1: {
        type: "line"
      }
    }
  };
  var chart = new google.visualization.ComboChart($("#chart-rating")[0]);
  chart.draw(data, options);
  dashboard.charts["rating"] = {
    chart: chart,
    data: data,
    options: options
  };
}

function holidayChart() {
  var addData = [
    ["City", "Count"]
  ];
  $.each(dashboard.json.holiday, function(city, count) {
    addData.push([city, count]);
  });

  var data = google.visualization.arrayToDataTable(addData);

  var options = {
    region: "NZ",
    displayMode: "markers",
    colorAxis: {
      colors: [
        dashboard.colors.max,
        dashboard.colors.min
      ]
    },
    height: 700,
    backgroundColor: dashboard.colors.background,
    legendTextStyle: {
      color: dashboard.colors.text
    },
    titleTextStyle: {
      color: dashboard.colors.text
    }
  };

  var chart = new google.visualization.GeoChart($("#chart-holiday")[0]);
  chart.draw(data, options);

  dashboard.charts["holiday"] = {
    chart: chart,
    data: data,
    options: options
  };
}


$(document).ready(function(){
  $("#navbar .navbar-brand").click(function(event){
    $("html,body").animate({
      scrollTop: 0
    });
    event.preventDefault();
  });

  $("#nav-links a").click(function(event){
    var do_id = $(this).attr("href");
    $("html,body").animate({
      scrollTop: $(do_id).offset()["top"] - 150
    }, 500, function(){
      $(do_id).animate({
        opacity: 0.3
      }, 100, function(){
        $(do_id).animate({
          opacity: 1
        });
      });
    });
    event.preventDefault();
  });

  $("#chart-info-box-overlay").click(function(){
    $("#intermission-wrap").html($("#intermission-wrap").html().replace("auto_play=false", "auto_play=true"));
  })
})
