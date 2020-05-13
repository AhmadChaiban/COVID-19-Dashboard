import pandas as pd

def set_abs(dataframe):
    """
        Takes the absolute value of the columns of a dataframe
    """
    dataframe.confirmed  =  dataframe.confirmed.abs()
    dataframe.recovered  =  dataframe.recovered.abs()
    dataframe.deaths     =  dataframe.deaths.abs()
    dataframe.active     =  dataframe.active.abs()

    return dataframe


def get_agg_data():
    dataframe = pd.read_csv('../cases_per_day.csv', header=None, sep=',')
    # print(dataframe)
    dataframe.columns = ['date', 'confirmed', 'recovered', 'deaths', 'active', 'country']
    dataframe['date'] = pd.to_datetime(dataframe['date'])


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

    grouped_agg_df.to_csv('../CountryData/cases_per_day_agg_all.csv')

    difference = grouped_agg_df.diff()
    difference.iloc[0] = grouped_agg_df.iloc[0]
    grouped_agg_df = difference.astype('int')   

    grouped_agg_df.to_csv('../CountryData/cases_per_day_diff_all.csv')

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
        grouped_agg_df = set_abs(grouped_agg_df)
        grouped_agg_df.to_csv(f'../CountryData/cases_per_day_agg_{countries[idx].replace("*","").strip()}.csv')
        difference = grouped_agg_df.diff()
        difference.iloc[0] = grouped_agg_df.iloc[0]
        grouped_agg_df = difference.astype('int')     
        grouped_agg_df.to_csv(f'../CountryData/cases_per_day_diff_{countries[idx].replace("*","").strip()}.csv')
        