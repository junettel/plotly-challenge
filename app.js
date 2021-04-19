// Test data import
const jsonData = d3.json("samples.json");
jsonData.then(data => {
  console.log("Full Dataset:", data)
});

// Create reference variables
const dropdownElement = d3.select("#selDataset")
const metadataElement = d3.select("#sample-metadata");

function init() {
  jsonData.then(data => {data.names

    // Fill dropdown element
    .forEach(id => dropdownElement
      .append("option")
      .text(id)
      .property("value")
    )

    // Default plot
    buildDashboard(data.names[0])
    console.log("Default ID:", data.names[0])   
  });
};

// Event handler for new selection
function optionChanged(selectionId) {
  console.log(`Subject ID: ${selectionId}`);
  buildDashboard(selectionId);
};

// Build dashboard with plots and metadata
function buildDashboard(selectionId) {
  jsonData.then(data => {

    // Create reference variable for selected ID samples data
    var selectionSamples = data.samples.filter(sample => sample.id === selectionId)[0];
    console.log(`ID ${selectionSamples.id} selectionSamples:`, selectionSamples);
    
    // #################################
    // BAR CHART
    // #################################
    var barTrace = {
      x: selectionSamples.sample_values.slice(0, 10).reverse(),
      y: selectionSamples.otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
      hovertext: selectionSamples.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var barData = [barTrace];

    var barLayout = {
      title: `Top 10 OTUs Found in Test Subject ID No. ${selectionId}`,
      xaxis: {
        title: "Sample Values"
      }
    };

    // Plot bar chart
    Plotly.newPlot("bar", barData, barLayout);

    // #################################
    // BUBBLE CHART
    // #################################
    var bubbleTrace = {
      x: selectionSamples.otu_ids,
      y: selectionSamples.sample_values,
      text: selectionSamples.otu_labels,
      mode: "markers",
      marker: {
        size: selectionSamples.sample_values,
        color: selectionSamples.otu_ids,
        colorscale: 'Bluered',
        sizeref: 1.5
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: `Belly Button Biodiversity in Test Subject ID No. ${selectionId}`,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample Values",
        hovermode: "closest"
      },
    };
    
    // Plot bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // #################################
    // METADATA
    // #################################
         
    // Filter for selected ID
    var selectionMetadata = data.metadata.filter(meta => meta.id.toString() === selectionId)[0];
    console.log(`ID ${selectionMetadata.id} selectionMetadata:`, selectionMetadata);

    // Clear existing html data
    metadataElement.html("");

    // Add selection metadata to Demographic Info on page
    Object.entries(selectionMetadata).forEach(([key, value]) => {
      metadataElement
      .append("p")
      .text(`${key.toUpperCase()}: ${value}`)
    });
    
    // #################################
    // GAUGE CHART
    // #################################
    var selectionWfreq = selectionMetadata.wfreq;
    console.log("selectionWfreq:", selectionWfreq);

    // Create gauge chart
    var gaugeTrace = {
      value: selectionMetadata.wfreq,
      title: "Scrubs per Week",
      type: "indicator",
      mode: "gauge+number",
      domain: { x: [0, 1], y: [0, 1] },
      gauge: {
        axis: { 
          range: [null, 9], 
          tickwidth: 1, 
          tickcolor: "black",
        },
        bar: { color: "#800000" },
        borderwidth: 1,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "#ffffe5" },
          { range: [1, 2], color: "#f7fcb9" },
          { range: [2, 3], color: "#d9f0a3" },
          { range: [3, 4], color: "#addd8e" },
          { range: [4, 5], color: "#78c679" },
          { range: [5, 6], color: "#41ab5d" },
          { range: [6, 7], color: "#238443" },
          { range: [7, 8], color: "#006837" },
          { range: [8, 9], color: "#004529" }
        ]
      }      
    };

    var gaugeData = [gaugeTrace];

    var gaugeLayout = {
      title: `Belly Button Washing Frequency<br>Test Subject ID No. ${selectionId}`,
    };

    // Plot gauge chart
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
};

init();
