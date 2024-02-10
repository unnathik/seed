import pandas as pd
from fuzzywuzzy import process, fuzz
import Levenshtein
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

#Removed duplicate years
clean_envi_path = 'clean-environmental-dataset.csv'
clean_envi_data = pd.read_csv(clean_envi_path)
cleaneddf = clean_envi_data.drop_duplicates()
cleaneddf.to_csv('new_environmental_dataset.csv')