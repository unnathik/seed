import pandas as pd
from fuzzywuzzy import process, fuzz

# # Load your datasets
# original_data_path = 'data/ethical-params.csv'  # Update this path
# nasdaq_screener_path = 'data/nasdaq.csv'  # Update this path

# original_data = pd.read_csv(original_data_path)
# nasdaq_data = pd.read_csv(nasdaq_screener_path)

# # Preprocess and standardize company names (optional, depends on your data)
# def standardize_name(name):
#     import re
#     suffixes = [' Inc', ' Corp', ' Corporation', ' Ltd', ' Limited', ' Co', '\.', ',']
#     pattern = '|'.join(suffixes)
#     name = re.sub(pattern, '', name, flags=re.IGNORECASE).strip()
#     return name

# original_data['Standardized Company'] = original_data['Company'].apply(standardize_name)
# nasdaq_data['Standardized Name'] = nasdaq_data['Name'].apply(standardize_name)

# # Create a mapping of standardized names to NASDAQ symbols
# name_to_symbol = pd.Series(nasdaq_data.Symbol.values, index=nasdaq_data['Standardized Name']).to_dict()

# # Define a function to perform fuzzy matching
# def find_best_match(name, choices, scorer=fuzz.WRatio, threshold=70):
#     best_match = process.extractOne(name, choices, scorer=scorer)
#     if best_match and best_match[1] >= threshold:
#         return best_match[0]
#     else:
#         return None

# # Apply fuzzy matching
# nasdaq_names = nasdaq_data['Standardized Name'].unique()
# original_data['Fuzzy Matched Name'] = original_data['Standardized Company'].apply(lambda x: find_best_match(x, nasdaq_names))
# original_data['Fuzzy Corrected Ticker'] = original_data['Fuzzy Matched Name'].map(name_to_symbol)

# # Results
# print(original_data[['Company', 'Tickers', 'Fuzzy Corrected Ticker']].head())

# # Save the updated dataset
# original_data.to_csv('path_to_save_updated_dataset.csv', index=False)  # Update the save path

file_path = 'ethical-params-updated.csv'  # Update this path to your file's location
data = pd.read_csv(file_path)

# Remove entries with any empty values
cleaned_data = data.dropna()

# Save the cleaned data to a new CSV file
cleaned_file_path = 'ethical-params-updated-cleaned.csv'  # Specify your desired output file name
cleaned_data.to_csv(cleaned_file_path, index=False)

print(f"Cleaned data saved to {cleaned_file_path}.")
