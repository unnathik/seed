import streamlit as st
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

clean_environmental_dataset = '../data/cleaned_environmental_dataset_no_duplicates.csv'

st.image("seed_logo.png", width=100)
st.title("Seed: Socially Responsible Investing")
st.write("Authors: Unnathi U Kumar, Adhira Choudhury, Abhishek Pillai, Neil Goyal")
st.write("")

st.header("Introduction")
st.write("text about the problem here")

st.header("More About Our Data")
st.write("text about data here")
st.write("normalisation, fuzzy matching")

# SDG Analysis
st.header("Preliminary Analysis on SDG (Sustainable Development Goals) Performance")
st.write("First, we conducted an analysis on the relationships between the different SDG metrics.")
data = pd.read_csv(clean_environmental_dataset)

sdg_columns = [col for col in data.columns if col.startswith('SDG')]
sdg_data = data[sdg_columns]
correlation_matrix = sdg_data.corr()
fig = plt.figure(figsize=(12, 10))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation between Different SDG Metrics')
st.pyplot(fig)
st.write("We found that...")

# Industry Analysis
st.header("Industry Analysis")
data['Industry (Exiobase)'] = data['Industry (Exiobase)'].str.replace('\(\d+\)', '', regex=True) \
                                                                 .str.replace('\d+', '', regex=True) \
                                                                 .str.strip()  # Remove leading/trailing spaces

industry_counts = data['Industry (Exiobase)'].value_counts()

industries_more_than_10 = industry_counts[industry_counts > 5].index
data_filtered = data[data['Industry (Exiobase)'].isin(industries_more_than_10)]
data_filtered_reset_index = data_filtered.reset_index()

sns.set(style="whitegrid")

fig2 = plt.figure(figsize=(10, 8))
s2 = sns.scatterplot(x='Industry (Exiobase)', y='Environmental Index', data=data_filtered_reset_index, hue="Industry (Exiobase)", legend=False)

s2.set(xticklabels=[])
plt.title('Environmental Index across Different Industries')
plt.xlabel('Industry')
plt.ylabel('Environmental Index')
plt.tight_layout() 

st.pyplot(fig2)
st.image('company_legend.png')
st.write("With respect to the environmental performance of different industries, we found that...")

# Environmental Index vs. Environmental Factors
st.header("Environmental Index vs. Environmental Factors")
st.markdown("#### Biodiversity")

fig3 = plt.figure(figsize=(14, 10))
sns.scatterplot(x='Biodiversity', y='Environmental Index', data=data_filtered, alpha = 0.7, s=100)
plt.title('Environmental Index as a Function of Biodiversity', fontsize=16)
plt.xlabel('Biodiversity', fontsize=14)
plt.ylabel('Environmental Index', fontsize=14)
plt.tight_layout()
st.pyplot(fig3)

st.markdown("#### Abiotic Resources")
fig4 = plt.figure(figsize=(14, 10))

data_filtered2 = data_filtered[data_filtered['Abiotic Resources'] >= 0.98]
sns.scatterplot(x='Abiotic Resources', y='Environmental Index', data=data_filtered2, alpha = 0.7, s=100)
plt.title('Environmental Index as a Function of Abiotic Resources', fontsize=16)
plt.xlabel('Abiotic Resources', fontsize=14)
plt.ylabel('Environmental Index', fontsize=14)
plt.tight_layout()
st.pyplot(fig4)

st.header("Clustering")