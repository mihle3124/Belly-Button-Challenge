// Set URL for data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it specified variables to peruse
d3.json(url).then(function(data) {
    console.log(data)
    console.log(data.names)
    console.log(data.samples)
    console.log(data.metadata);
});

// Initializes the page with a default plot
function init(){
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then(function(data) {
        // Append names to dropdown menu
        let dataNames = data.names
        dataNames.forEach(function(dataName) {
        dropdownMenu.append("option").property("value", dataName).text(dataName)
    });
        // Select data for plotting
        let result = dataNames[0]
        updatePlots(result)
        updateDemo(result)
})};

// On change to the DOM
function updatePlots(nameSelect) {
    d3.json(url).then(function(data){
    // Filter by ID
    let idSample = data.samples.filter(select => select.id === nameSelect)[0]
    console.log(idSample)
    // Add parameters to the bar graph
    let trace1 = {
        x: (idSample.sample_values).slice(0,10).reverse(),
        y: (idSample.otu_ids).map(object => `OTU_${object}`).slice(0,10).reverse(),
        text: (idSample.otu_labels).slice(0,10).reverse(),
        name: "The Top 10 OTUs",
        type: "bar",
        orientation: "h",
        marker: {color: "blue"},
    };

    // Trace for data
    let dataTrace = [trace1];
    // Apply title and margin to the layout
    let layout = {
        title: "The Top 10 OTUs",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    }
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", dataTrace, layout);

    // Parameters for bubble graph
    let trace2 = {
        x: idSample.otu_ids,
        y: idSample.sample_values,
        text: (idSample.otu_labels),
        mode: "markers",
        orientation: "h",
        marker: {
            size: idSample.sample_values,
            color: idSample.otu_ids
        }
    };

    // Trace for data
    let dataTrace2 = [trace2];
    // Apply title and margin to the layout
    let layout2 = {
        title: "Sample Display",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };
    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", dataTrace2, layout2);

    // Parameters for Gauge chart
    let metaSample = data.metadata.filter(select => select.id == nameSelect)[0]

    let trace3 = {
        value: metaSample.wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "black", tickmode: "linear"},
            bar: {color: "darkred"},
            steps: [
            { range: [0, 1], color: "#e6ffe6" },
            { range: [1, 2], color: "#ccffcc" },
            { range: [2, 3], color: "#b3ffb3" },
            { range: [3, 4], color: "#99ff99" },
            { range: [4, 5], color: "#80ff80" },
            { range: [5, 6], color: "#66ff66" },
            { range: [6, 7], color: "#4dff4d" },
            { range: [7, 8], color: "#33ff33" },
            { range: [8, 9], color: "#1aff1a" },
            { range: [9, 10], color: "#00ff00" }
        ]
    }};
    
    // Trace for data
    let dataTrace3 = [trace3];

    let layout3 = {
        title: "Belly Button Washing Frequency",
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 50
    }};

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("gauge", dataTrace3, layout3)
 
})};

// Function called by DOM changes
function updateDemo(nameSelect) {
    d3.json(url).then(function(data){

    // Add demographic information
    let metaSample = data.metadata.filter(select => select.id == nameSelect)[0]
    d3.select(".panel-body").html("")
    Object.entries(metaSample).forEach(([key, value]) => d3.select(".panel-body")
        .append("h5")
        .text(`${key}:${value}`)
        .style("color", "blue")
    )}
)};

// Call function to update the chart
function optionChanged(nameSelect) {
    Plotly.restyle("bar", "values", [nameSelect])
    Plotly.restyle("bubble", "values", [nameSelect])
    updatePlots(nameSelect)
    updateDemo(nameSelect)
};

init();