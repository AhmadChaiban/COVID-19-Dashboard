var fs = require('fs');
const fetch = require("node-fetch");
const neatCsv = require('neat-csv');
var cmd=require('node-cmd');
// fetch("https://pomber.github.io/covid19/timeseries.json")
//   .then(response => response.json())
//   .then(data => {
//     data["US"].forEach(({ date, confirmed, recovered, deaths }) =>
//       console.log(`${date} active cases: ${confirmed - recovered - deaths}`)
//     );
//   });

function getMainData(){
    var data_final = 'id\tname\tconfirmed\trecovered\tdeaths\tactive\t';  
    var all_country_cases_per_day = [];
    var name_data = fs.readFileSync('../country_id_names.tsv');
    name_data = neatCsv(name_data)

    fetch("https://pomber.github.io/covid19/timeseries.json")
        .then(response => response.json())
        .then(data => {

            for(i=0; i<name_data.length; i++){
                
                var name_data_instance = name_data[i]['id\tname'].split('\t')
                // console.log(name_data_instance[1])
                if (name_data_instance[1] == 'South Korea'){
                    name_data_instance[1] = 'Korea, South'
                }

                var case_info_list = [];
                data[name_data_instance[1]].forEach(({ date, confirmed, recovered, deaths}) =>
                    // console.log(`${date} active cases: ${confirmed - recovered - deaths}`);
                       { 
                        case_info_list.push([date, confirmed, recovered, deaths, confirmed - recovered - deaths]);
                        all_country_cases_per_day.push([date,confirmed,recovered,deaths, confirmed-recovered-deaths, name_data_instance[1]. replace(',', '')]);
                       }
                    );
                    last_row = case_info_list[case_info_list.length-1]
                    data_final = data_final + '\n'+ name_data_instance[0] +'\t' + name_data_instance[1] +'\t'+ last_row[1] +'\t'+ last_row[2] +'\t'+ last_row[3] +'\t' 
                        + (last_row[4]) + '\t'
                // console.log(case_info_list[case_info_list.length-1][4]);
            }

            fs.writeFileSync('../world_covid.tsv', data_final);
            fs.writeFileSync('../cases_per_day.csv', all_country_cases_per_day.join('\n'));

        });

        cmd.run('python Agg_data.py');
}

// setInterval(getMainData, 100000);
getMainData();
