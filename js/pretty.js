



//counties is the array of data
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawPlot = function(counties,target,
                         xScale,yScale)
{
    target
    .selectAll("circle")
    .data(counties)
    .enter()
    .append("circle")
    .attr("cx",function(county)
    {
        return xScale(county.white_pct);   
    })
    .attr("cy",function(county)
    {
        return yScale(county.trumpPercentage);    
    })
    .attr("r",2.5)
    .attr("class",function(county)
    {
        if(county.lesscollege_pct<80)
        {
            return "lessCollege"        
        }
        else if(county.clf_unemploy_pct<6)
        {
            return "unemployment";        
        }
    })//tooltip on
    .on("mouseenter" ,function(county)
      {
        
      var xPos = d3.event.pageX;
      var yPos = d3.event.pageY;
      
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
        d3.select("#state")
        .text(county.state);
        
        d3.select("#county")
        .text(county.county);
      })//tool tip off
    .on("mouseleave",function()
    {
        d3.select("#tooltip")    
        .classed("hidden",true);
    })
}

var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}

//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawAxes = function(graphDim,margins,
                         xScale,yScale)
{
    //Define fnc to draw axes
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale);
    
    //Create group for axes
    var axes = d3.select("svg")
        .append("g")
    
    //Create x axis
    axes.append("g")
        .attr("transform", "translate(" + margins.left + "," + (margins.top + graphDim.height) + ")")
        .call(xAxis)
    
    //Create y axis
    axes.append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(yAxis)
 
}


//graphDim -object that stores dimensions of the graph area
//margins - objedct that stores the size of the margins
var drawLabels = function(graphDim,margins)
{
    //Create group for labels
    var labels = d3.select("svg")
        .append("g")
        .classed("labels", true)
    
    //Create title
    labels.append("text")
        .text("Trump Support")
        .classed("title", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graphDim.width/2))
        .attr("y", margins.top)
    
    //Create x label
    labels.append("text")
        .text("Percentage White")
        .classed("xLabel", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graphDim.width/2))
        .attr("y", margins.top + graphDim.height + 40)
    
    //Create y label
    labels.append("g")
        .attr("transform", "translate(20," + (margins.top + (graphDim.height/2)) + ")")
        .append("text")
        .text("Percentage Voting for Trump")
        .classed("yLabel", true)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90)")
}


var drawLegend = function(graphDim,margins)
{ 
   var categories = [
       {
           class:"lessCollege",
           name:"Less College"
       },
       {
           class:"unemployment",
           name:"High unemployment"
       }
    ]
   
   //Create group for legends
   var legend = d3.select("svg")
    .append("g")
    .classed("legend", true)
    .attr("transform", "translate(" + (margins.left+10) + "," + (margins.top+10) + ")")
   
   //Bind legends with each group for individual category
   var entries = legend.selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", function(aCategory){return aCategory.class;})
    .attr("transform", function(aCategory, index){return "translate(0," + index*20 + ")";})
    .on("click", function(aCategory){
        
        console.log("A legend is clicked");
        
        //Create Boolean var to check if class is off
        var off = ! d3.select(this)
                      .classed("off")
        
        //When class is NOT off, dim
        if (off)
        {
            d3.select(this)
                .classed("off", true);
            d3.selectAll("." + aCategory.class)
                .classed("off", true);
        }
        //When class if off, remove off class
        else
        {
           d3.select(this) 
                .classed("off", false);
           d3.selectAll("." + aCategory.class)
                .classed("off", false);
        }
        
    })
   
   //Add rectangle
   entries.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    
   //Add name to legend
   entries.append("text")
    .text(function(aCategory){return aCategory.name})
    .attr("x", 15)
    .attr("y", 10)
}

//sets up several important variables and calls the functions for the visualization.
var initGraph = function(counties)
{
    //size of screen
    var screen = {width:800,height:600}
    //how much space on each side
    var margins = {left:70,right:10,top:50,bottom:50}
    
    //Set the graph size
    var graphDim = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    
    console.log(graphDim);
    
    //Apply screen size
    d3.select("svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    //Create group for graph
    var target = d3.select("svg")
    .append("g")
    .attr("id","#graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    //Define fnc to scale x
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graphDim.width])
    
    //Define fnc to scale y
    var yScale = d3.scaleLinear()
        .domain([0,1])
        .range([graphDim.height,0])
    
    drawAxes(graphDim,margins,xScale,yScale);
    drawPlot(counties,target,xScale,yScale);
    drawLabels(graphDim,margins);
    drawLegend(graphDim,margins);   
}




var successFCN = function(counties)
{
    console.log("politics",counties);
    initGraph(counties);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var polPromise = d3.csv("data/politics.csv")
polPromise.then(successFCN,failFCN);