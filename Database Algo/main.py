import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

COMPANY_PROVIDED_CSV = 'Sample Data Set.csv'
DATABASE = 'Database.csv'
PRODUCTION = 'production.csv' 
PACKAGING = 'packaging.csv'


def parse_prod_data():
  prod = pd.read_csv(PRODUCTION) #food info
  return prod[['Food category','Land use change','Animal Feed','Farm','Processing']]


def parse_pack_data() -> pd.DataFrame:
  pack = pd.read_csv(PACKAGING) #material info
  return pack


def calc_footprint(row: pd.Series) -> tuple:
  '''
  takes in one row and returns the footprint value
  '''
  prod = parse_prod_data()
  components = row['Food category'].split('/')
  weights = [float(i) for i in row['amount(kg)'].split('/')]
  food_cost = 0
  for component,weight in zip(components,weights):
    prod_weight = prod.loc[prod['Food category'] == component]
    food_cost += prod_weight.select_dtypes('number').to_numpy().sum() * weight

  pack = parse_pack_data()
  pack_weight = pack.loc[pack['Product'] == row['packaging material']]
  pack_cost = pack_weight.iat[0,1] * row['packaging cost(unit)']

  dist_cost = row['distance(km)'] * 0.0158
  
  footprint = food_cost + pack_cost + dist_cost

  return round(food_cost, 3), round(pack_cost, 3), round(dist_cost, 3), round(footprint, 3)


def write_data(df: pd.DataFrame) -> None:
  """
  writes calculated footprint value into dataframe
  """
  df[['food_cost','pack_cost','dist_cost','footprint']] = df.apply(lambda row: calc_footprint(row),axis=1,result_type='expand')
  df.to_csv(DATABASE,mode='a',header=False,index=False)


def plot_footprint(df: pd.DataFrame) -> None:
  df[['food_cost','pack_cost','dist_cost','footprint']] = df.apply(lambda row: calc_footprint(row),axis=1,result_type='expand')
  for i in range(len(df.index)):
    # graph labels
    graph = df[['food_cost','pack_cost','dist_cost','footprint']].iloc[i].plot(kind='bar')
    plt.xticks(rotation=0)
    graph.set_ylabel('kg of CO₂ \nequivalent', rotation = 0,labelpad=30)
    plt.subplots_adjust(left=0.20)
    x_labels = ['Production', 'Packaging', 'Transportation', 'TOTAL']
    graph.set_xticklabels(x_labels)
    graph.set_title(df['product'].iat[i])

    # generates the numeric bar labels
    rects = graph.patches
    labels = df[['food_cost','pack_cost','dist_cost','footprint']].iloc[i]
    for rect, label in zip(rects, labels):
      height = rect.get_height()
      graph.text(rect.get_x() + rect.get_width() / 2, height, label,
              ha='center', va='bottom')
    plt.show(block=False)
    plt.savefig(f"figures/{df['product'].iat[i]}.jpg")
    plt.pause(3)
    plt.close()


def main():
  plt.close('all')
  inp = pd.read_csv(COMPANY_PROVIDED_CSV)
  write_data(inp)
  plot_footprint(inp)
  

if __name__ == "__main__":
  main()