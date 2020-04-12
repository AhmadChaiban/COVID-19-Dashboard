function sortByProperty(property){  
    return function(a,b){  
       if(parseInt(a[property]) < parseInt(b[property]))  
          return 1;  
       else if(parseInt(a[property]) > parseInt(b[property]))  
          return -1;  
   
       return 0;  
    }  
 }

 function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function top6(){

    var svgRace = d3.selectAll('#Top6').attr('width',document.getElementById('divBoxtopworld_race').offsetWidth);
        //Using this selection to update the SVG everytime the function is called
    svgRace.selectAll("*").remove();

    d3.tsv("world_covid.tsv", function(data) {
        var sorted_data = data.sort(sortByProperty('confirmed'));
        var sorted_3_first = [sorted_data[0], sorted_data[1], sorted_data[2]];
        var sorted_3_second = [sorted_data[3], sorted_data[4], sorted_data[5]];
        console.log(sorted_3_first)
        console.log(sorted_3_second)

        var svgRace = d3.selectAll('#Top6')
                        .attr('height', document.getElementById('divBoxtopworld_race').offsetHeight/2)

        svgRace.append('g')
            .data(['Highest 6 infected (Confirmed)'])
            .append('text')
            .text(['Highest 6 infected (Confirmed)'])
            .style('stroke', 'white')
            .style('font-size', '14px')
            .attr('x', 50)
            .attr('y', 20);

        svgRace.selectAll('body')
            .data(sorted_3_first)
            .enter()
            .append('text')
            .text(function(d,i){
                console.log(d['name'])
                return d['name'];
            })
            .style('stroke', 'white')
            .attr('y',60)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + 25;
            });

        svgRace.selectAll('body')
            .data(sorted_3_first)
            .enter()
            .append('text')
            .text(function(d,i){
                return numberWithCommas(d['confirmed']);
            })
            .style('stroke', 'white')
            .attr('y',80)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + 25;
            });

        svgRace.selectAll('body')
            .data(sorted_3_second)
            .enter()
            .append('text')
            .text(function(d,i){
                return d['name'];
            })
            .style('stroke', 'white')
            .attr('y',140)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + 25;
            });

        svgRace.selectAll('body')
            .data(sorted_3_second)
            .enter()
            .append('text')
            .text(function(d,i){
                return numberWithCommas(d['confirmed']);
            })
            .style('stroke', 'white')
            .attr('y',160)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + 25;
            });
    
    });
}
