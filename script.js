const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json' 

const canvas  = d3.select('#canvas')
const tooltip = d3.select('#tooltip')

const drawCanvas = (height, width)=>{
    canvas.attr('width', width)
    canvas.attr('height', height)
}

const drawMap = (countyData, educationData)=>{
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                const id = countyDataItem['id']
                const county = educationData.find((item) => {
                    return item['fips'] === id
                })
                const percentage = county['bachelorsOrHigher']
                if(percentage <= 12){
                    return '#480355'
                }else if(percentage <= 21){
                    return '#9448BC'
                }else if(percentage <= 30){
                    return '#90FCF9'
                }else if(percentage <= 39){
                    return '#78D5D7'
                }else if(percentage <= 48){
                    return '#7699D4'
                }else if(percentage <= 57){
                    return '#2081C3'
                }else{
                    return '#0D4B75'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .on('mouseover', function(d,countyDataItem) {
                const xposition = d.x - 950
                const yposition = d.y - 525
                tooltip.transition()
                    .style('visibility', 'visible')

                const id = countyDataItem['id']
                const county = educationData.find((item) => {
                    return item['fips'] === id
                })
                tooltip.text(county['area_name'] + ', ' + 
                    county['state'] + ': ' + county['bachelorsOrHigher'] + '%')
                tooltip.attr('data-education', county['bachelorsOrHigher'] )
                tooltip.style('translate', `${xposition}px ${yposition}px`);
            })
            .on('mouseout', function(d,countyDataItem) {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}

const getData = async()=>{
    try {
        const response = await fetch(countyURL)
        const json = await response.json()
        const res = await fetch(educationURL)
        const json2 = await res.json()
        const result = json
        const result2 = json2
        const countyData = topojson.feature(result, result.objects.counties).features
        const educationData = result2
        return {countyData, educationData}
    } catch (error) {
        throw new Error(e)        
    }
}

const ChoroplethMap = async()=>{
try {
    const {countyData, educationData} = await getData()
    const width = 960
    const height = 600
    drawCanvas(height, width)
    drawMap(countyData, educationData)
} catch (error) {
    throw new Error(error)     
}
}

ChoroplethMap()