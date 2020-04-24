import pandas as pd

dataframe = pd.read_csv('cases_per_day.csv', header=None, sep=',')
dataframe.columns = ['date', 'confirmed', 'recovered', 'deaths', 'active', 'country']
dataframe['date'] =pd.to_datetime(dataframe['date'])


grouped_agg_df = dataframe.sort_values(by='date').groupby(
   ['date']
).agg(
    {
        'confirmed':sum,
        'recovered':sum,
        'deaths':sum,
        'active':sum,

    }
)

grouped_agg_df.to_csv('./CountryData/cases_per_day_agg_all.csv')

for i in range(len(grouped_agg_df)-1):
    for j in range(0,i+1):
        grouped_agg_df['confirmed'][i+1] = int(grouped_agg_df['confirmed'][i+1]) - int(grouped_agg_df['confirmed'][j])
        grouped_agg_df['recovered'][i+1] = grouped_agg_df['recovered'][i+1] - grouped_agg_df['recovered'][j]     
        grouped_agg_df['deaths'][i+1] = grouped_agg_df['deaths'][i+1] - grouped_agg_df['deaths'][j]     
        grouped_agg_df['active'][i+1] = grouped_agg_df['active'][i+1] - grouped_agg_df['active'][j]     

grouped_agg_df.to_csv('./CountryData/cases_per_day_diff_all.csv')

countries = dataframe['country'].unique()
for idx in range(len(countries)):
    per_country_data = dataframe[dataframe['country']==countries[idx]]
    grouped_agg_df = per_country_data.sort_values(by='date').groupby('date').agg(
    {
        'confirmed':sum,
        'recovered':sum,
        'deaths':sum,
        'active':sum,

        }
    )
    grouped_agg_df.to_csv(f'./CountryData/cases_per_day_agg_{countries[idx].replace("*","")}.csv')
    for i in range(len(grouped_agg_df)-1):
        for j in range(0,i+1):
            grouped_agg_df['confirmed'][i+1] = int(grouped_agg_df['confirmed'][i+1]) - int(grouped_agg_df['confirmed'][j])
            grouped_agg_df['recovered'][i+1] = grouped_agg_df['recovered'][i+1] - grouped_agg_df['recovered'][j]     
            grouped_agg_df['deaths'][i+1] = grouped_agg_df['deaths'][i+1] - grouped_agg_df['deaths'][j]     
            grouped_agg_df['active'][i+1] = grouped_agg_df['active'][i+1] - grouped_agg_df['active'][j]    
    grouped_agg_df.to_csv(f'./CountryData/cases_per_day_diff_{countries[idx].replace("*","")}.csv')
    