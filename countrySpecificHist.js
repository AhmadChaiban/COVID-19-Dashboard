

function countrySpecificHist(country){

    if(country == 'all'){


        d3.csv("cases_per_day_diff.csv", function(data_entry) {

        delete data_entry['columns'];

        console.log(data_entry[3].confirmed);


        let data = []
        let ordinals = []

        for(let i = 0;i < data_entry.length; i++){
        data.push({
            value: data_entry[i].confirmed,
            city: 'test' + i
        })

        ordinals.push(data_entry[i].date)
        }

        let margin = {
            top: 20,
            right: 50,
            bottom: 150,
            left: 100
            },
            width = document.getElementById('divBoxHist').offsetWidth - margin.left - margin.right,
            height = document.getElementById('divBoxHist').offsetHeight - margin.top - margin.bottom,
            radius = (Math.min(width, height) / 2) - 10,
            node


        var svg = d3.select('#histogramNode')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.left + margin.right )
                    .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    .call(
                        d3.zoom()
                        .translateExtent([[0,0], [width, height]])
                        .extent([[0, 0], [width, height]])
                        .on('zoom', zoom)
                    )

        svg.selectAll('*').remove()

        // the scale
        let x = d3.scaleLinear().range([0, width])
        let y = d3.scaleLinear().range([height, 0])
        let color = d3.scaleOrdinal(d3.schemeCategory10)
        let xScale = x.domain([-1, ordinals.length])
        let yScale = y.domain([0, d3.max(data, function(d,i){return parseInt(data[i].value)})])
        // for the width of rect
        let xBand = d3.scaleBand().domain(d3.range(-1, ordinals.length)).range([0, width])

        // zoomable rect
        svg.append('rect')
        .attr('class', 'zoom-panel')
        .attr('width', width)
        .attr('height', height)

        // x axis
        let xAxis = svg.append('g')
        .style('stroke','white')
        .style('stroke-width',1)
        .attr('class', 'xAxis')
        .style('font-size','11px')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3.axisBottom(xScale).tickFormat((d, e) => {
            return ordinals[d]
            })
        )

        // y axis
        let yAxis = svg.append('g')
                    .attr('class', 'y axis')
                    .style('stroke','white')
                    .call(d3.axisLeft(yScale))

        let bars = svg.append('g')
                    .attr('clip-path','url(#my-clip-path)')
                    .selectAll('.bar')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function(d, i){
                    return xScale(i) - xBand.bandwidth()*0.9/2
                    })
                    .attr('y', function(d, i){
                    return yScale(parseInt(d.value))
                    })
                    .attr('width', xBand.bandwidth()*0.9)
                    .attr('height', function(d){
                    return height - yScale(d.value)
                    })

        let defs = svg.append('defs')

        // use clipPath
        defs.append('clipPath')
            .attr('id', 'my-clip-path')
            .append('rect')
            .attr('width', width)
            .attr('height', height)

        let hideTicksWithoutLabel = function() {
        d3.selectAll('.xAxis .tick text').each(function(d){
            if(this.innerHTML === '') {
            this.parentNode.style.display = 'none'
            }
        })
        }

        function zoom() {
            if (d3.event.transform.k < 1) {
                d3.event.transform.k = 1
                return
            }

            xAxis.call(
                d3.axisBottom(d3.event.transform.rescaleX(xScale)).tickFormat((d, e, target) => {
                // has bug when the scale is too big
                if (Math.floor(d) === d3.format(".1f")(d)) return ordinals[Math.floor(d)]
                return ordinals[d]
                })
            )

            hideTicksWithoutLabel()

            // the bars transform
            bars.attr("transform", "translate(" + d3.event.transform.x+",0)scale(" + d3.event.transform.k + ",1)")
        }

    });

    }
    
}
