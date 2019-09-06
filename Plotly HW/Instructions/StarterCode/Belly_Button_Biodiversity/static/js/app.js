// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then(function(metadata){
    //console.log(metadata)
    var metaDump = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaDump.html("");

    var count = 0

  // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(metadata).forEach(function([key,value]){
      metaDump.append("h6").text(`${key}: ${value}`)
      //metaDump.append("p").attr("class",`meta meta${count}`).html(`<b>${key.toUpperCase()}: ${value}</b>`);
      //count += 1;
    })
  
    // d3.select(".meta5").remove();
    // d3.select(".meta6").html(`<b> SAMPLEID: ${sample}</b>`)

  // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    //buildGauge(data.WFREQ)
  })
};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    
    var traceBubble = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode:"markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Earth"
      }
  }
    // @TODO: Build a Bubble Chart using the sample data
  
  var data2 = [traceBubble]

  var layout = {
    title: "Bubble Chart",
    paper_bgcolor: 'rgb(255,255,255)',
    plot_bgcolor:'rgb(255,255,255)',
    xaxis: {title: "OTU ID"}
  }

  Plotly.plot("bubble", data2, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  
  var labels = data.otu_ids.slice(0,10);
  var values = data.sample_values.slice(0,10);
  var names = data.otu_labels.slice(0,10);

  var tracePie = {
    labels: labels,
    values: values,
    type: "pie"};

  var dat = [tracePie];

  var layout = {
    paper_bgcolor: 'rgb(255,255,255)',
    plot_bgcolor:'rbg(255,255,255)',
    margin: {
      t: 0,
      l: 0,
  }
}
  Plotly.newPlot("pie",dat,layout);
  });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
