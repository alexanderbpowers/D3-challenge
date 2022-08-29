// DEFINE DIMENSIONS

var svgHeight = 600
var svgWidth = 1000

var margin = {
    top: 20,
    bottom: 100,
    left: 100,
    right: 80,
}

var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.bottom - margin.top

var svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(data) {

    console.log(data)

    var y = []
    var x = []

    data.forEach(d => {
        d.healthcare = +d.healthcare;
        y.push(d.healthcare)
        d.poverty = +d.poverty;
        x.push(d.poverty)
        d.age = +d.age;
        d.smokes = +d.smokes;
        d.income = +d.income;
        d.obese = +d.obese;
    })

    var yScale = d3.scaleLinear().domain([0, (d3.max(y) + 2)]).range([height,0])
    var xScale = d3.scaleLinear().domain([(d3.min(x) - 2), (d3.max(x) + 2)]).range([0,width])
    
    function xScale(x) {
        var xScale = d3.scaleLinear().domain([(d3.min(x) - 2), (d3.max(x) + 2)]).range([0,width])
    }
    xScale(x)

    var yAxis = d3.axisLeft(yScale)
    var xAxis = d3.axisBottom(xScale)

    chartGroup.append("g")
        .call(yAxis)

    chartGroup.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)

    var circleGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d,i) => xScale(x[i]))
        .attr("cy", (d,i) => yScale(y[i]))
        .attr("r", 15)
        .classed("stateCircle", true)
    
    var abbrGroup = chartGroup.selectAll("text.stateText")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", (d,i) => xScale(x[i]))
        .attr("y", (d,i) => yScale(y[i]))
        .attr("transform", "translate(0,5)")
        .classed("stateText", true) 
    
    var yGroup = chartGroup.append("g")
        .classed("yGroup", true)

    var xGroup = chartGroup.append("g")
        .classed("xGroup", true)

    xGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + 40})`)
        .classed("aText active", true)
        .attr("id", "poverty")
        .text("Poverty %")

    xGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + 60})`)
        .classed("aText inactive", true)
        .attr("id", "age")
        .text("Age %")

    xGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + 80})`)
        .classed("aText inactive", true)
        .attr("id", "income")
        .text("Household Income (Median)")

    yGroup.append("text")
        .attr("transform", `rotate(-90)`)
        .attr("y", 0 - margin.left + 60)
        .attr("x",  0 - (height / 2))
        .attr("id", "healthcare")
        .classed("aText active", true)
        .text("Lack of Healthcare %")

    yGroup.append("text")
        .attr("transform", `rotate(-90)`)
        .attr("y", 0 - margin.left + 40)
        .attr("x",  0 - (height / 2))
        .classed("aText inactive", true)
        .text("Smokes %")

    yGroup.append("text")
        .attr("transform", `rotate(-90)`)
        .attr("y", 0 - margin.left + 20)
        .attr("x",  0 - (height / 2))
        .classed("aText inactive", true)
        .text("Obese %")

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([80, -60])
        .html(function(d,i) { 
            return `<strong> ${d.state}</strong> <br> 
            Poverty: ${x[i]}% <br> Lack of Healthcare: ${y[i]}`
        })

    chartGroup.call(toolTip)

    circleGroup.on("mousemove",toolTip.show)
        .on("mouseout", toolTip.hide)

    d3.select("#age").on("click", function() {
        data.forEach(d =>
            d.age = +d.age,
            x.push(d.age)
        );
        xScale(x);
        circleGroup.transition()
            .duration(5000)
            .attr("cx", (d,i) => xScale(x[i]));
        abbrGroup.transtion()
            .duration(5000)
            .attr("x", (d,i) => xScale(x[i]));
        });
    
});
