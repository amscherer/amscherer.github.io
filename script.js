let ntasAPI = 'https://data.cityofnewyork.us/resource/q2z5-ai38.geojson';
// let ntasAPI = 'https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson';

// Initialize selected year as blank
let selectedYear = '';

// Set the projection for the map so it shows up on the canvas and in the corrct location
let projection = d3.geoMercator()
    .scale(57000)
    .center([-74.099, 40.739]);
let path = d3.geoPath(projection);

//some necessary global variable thingzzzz
let ntaData
let violationData


// My canvas space that gets appended to the html body in a div
let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

// The async load for basic geography of the map
d3.json(ntasAPI).then(
    (data, error) => {
        if (error) {
            console.log(error);
        } else {
            ntaData = data.features;
            // console.log(ntaData);
        }
    }
);

let drawMap = () => {
    canvas.selectAll('path').remove();

    canvas.selectAll('path')
        .data(ntaData)
        .enter()
        .append('path')
        // .attr('d',d3.geoPath())
        .attr('d',path)
        .attr('class', 'ntaname')
        .attr('stroke-width','1px')
        .attr('stroke','white')
        .attr('fill', (ntaDataItem) => {
            let ntaname = ntaDataItem.properties.ntaname
            let nta = violationData.find((item) => {
                return item.ntaname === ntaname
            })
            
            if (nta && nta.bblviolations){
                let violations = nta.bblviolations
                if (violations <= 44){
                    return'#d1d1d1'
                } else if (violations <=108){
                    return '#999999'
                }else if(violations <=209){
                    return '#616365'
                }else if (violations <=325){
                    return '#333333'
                }else if(violations <= 612){
                    return 'black'
                }
            } else {
                //for the areas where no lead violations issued
                return '#f3f3f3'
            }
            
        })
       
    
    
       
};

// Function to async load the violation data for a specific year 
let loadViolationData = (year) => {
    d3.json(`aggregatedData/agdata${year}.json`).then(
        (data, error) => {
            if (error) {
                console.log(error);
            } else {
                violationData = data;
                drawMap();                             
            }
        }
    );
};
//create the legend on the map canvas//

const data = [
    {label: '0', color: '#f3f3f3', y: 100},
    {label: '1 - 44', color: '#d1d1d1', y: 130},
    {label: '44 - 108', color: '#999999', y: 160},
    {label: '108 - 209', color: '#616365', y: 190},
    {label: '209 - 325', color: '#333333', y: 220},
    {label: '325 - 612', color: 'black', y: 250},
  ];
  
  canvas.append('text')
    .style('font', '20px Lucida Sans Regular')
    .attr('x', 100)
    .attr('y', 90)
    .text('Lead Based Paint Violations');
  
  const rects = canvas.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', 100)
    .attr('y', d => d.y)
    .attr('width', 30)
    .attr('height', 30)
    .attr('fill', d => d.color);
  
  const texts = canvas.selectAll('text.value')
    .data(data)
    .enter()
    .append('text')
    .classed('value', true)
    .style('font', '20px Lucida Sans')
    .attr('x', 140)
    .attr('y', d => d.y + 20)
    .text(d => d.label);
  


// Event listener for the year buttons
d3.selectAll('.year-btn')
    .on('click', function() {
        selectedYear = d3.select(this).attr('id');
        loadViolationData(selectedYear);
        
    });

