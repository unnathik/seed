import pandas as pd
from fuzzywuzzy import process, fuzz
import Levenshtein
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

#Removed duplicate years
clean_envi_path = 'clean-environmental-dataset.csv'
clean_envi_data = pd.read_csv(clean_envi_path)
cleaneddf = clean_envi_data.drop_duplicates(keep = 'first')
cleaneddf.to_csv('new_environmental_dataset1.csv')

# Load the nasdaq dataset
# nasdaq_df = pd.read_csv('nasdaq.csv')

# # Function to remove specified prefixes and suffixes
# def clean_name(name):
#     suffixes = ['Corporation', 'Ordinary Shares', 'Common Stock', 'Depositary Shares', 'Common Shares']
#     for suffix in suffixes:
#         if name.endswith(suffix):
#             name = name[:name.find(suffix)].strip()
#     return name

# # Apply the cleaning function to the Name column
# nasdaq_df['Updated_Names'] = nasdaq_df['Name'].apply(clean_name)

# # Load the clean environmental dataset
# env_df = pd.read_csv('new_environmental_dataset.csv')

# # Define a function for fuzzy matching
# def get_best_match(row, choices, limit=1):
#     best_matches = process.extract(row, choices, scorer=fuzz.WRatio, limit=limit)
#     # Assuming the best match is returned first
#     if (best_matches[0][0] != None):
#         print(best_matches[0][0])
#     else:
#         print(None)
#     return best_matches[0][0] if best_matches else None

# # Apply fuzzy matching to find the best match in env_df for each entry in nasdaq_df
# nasdaq_df['Best_Match'] = nasdaq_df['Updated_Names'].apply(lambda x: get_best_match(x, env_df['Company_Name'].tolist()))

# # Now merge the datasets based on the best match found
# merged_df = pd.merge(nasdaq_df, env_df, left_on='Best_Match', right_on='Company_Name', how='left')
# merged_df.to_csv('ticker_environmental_dataset.csv')