import pandas as pd 
import json

import urllib.request, json
from Agg_data import get_agg_data
import time

def getMainData():
    data_final = 'id\tname\tconfirmed\trecovered\tdeaths\tactive\t'
    all_country_cases_per_day = ''
    name_data = pd.read_csv('../country_id_names.tsv')
    with urllib.request.urlopen("https://pomber.github.io/covid19/timeseries.json") as url:
        # data = json.loads(url.read().decode())
        data = pd.read_json(url.read().decode())
        for i in range(len(name_data)):
            name_data_instance = name_data['id\tname'][i].split('\t')
            
            if name_data_instance[1] == 'South Korea':
                name_data_instance[1] = 'Korea, South'
            elif name_data_instance[1] == 'Western Sahara':
                continue

            case_info_list = []
            for j in range(len(data[name_data_instance[1]])):

                date = data[name_data_instance[1]][j]['date']
                confirmed = data[name_data_instance[1]][j]['confirmed']
                recovered = data[name_data_instance[1]][j]['recovered']
                deaths = data[name_data_instance[1]][j]['deaths']
                active = confirmed - recovered - deaths

                case_info_list.append([date, confirmed, recovered, deaths, active])
                all_country_cases_per_day += (f"{date}, {confirmed}, {recovered}, {deaths}, {active}, {name_data_instance[1].replace(',','')}\n")

            last_row = case_info_list[-1]
            data_final = data_final + '\n'+ name_data_instance[0] +'\t' + name_data_instance[1] +'\t'+ str(last_row[1]) +'\t'+ str(last_row[2]) +'\t'+ str(last_row[3]) +'\t' + str(last_row[4]) + '\t'

        word_covid = open('../world_covid.tsv', 'w')
        word_covid.write(data_final)

        cases_per_day = open('../cases_per_day.csv', 'w')
        cases_per_day.write(all_country_cases_per_day)

while True:
    getMainData()
    get_agg_data()
    time.sleep(3600)



    



    

        # break
    
