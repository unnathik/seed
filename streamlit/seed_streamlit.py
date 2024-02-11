import streamlit as st
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
from sklearn.decomposition import PCA

st.set_option('deprecation.showPyplotGlobalUse', False)

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

#New data visualization for company breakdown into causes:

file_path_market_cap = '../data/cleaned_market_cap_values.csv'
data_market_cap = pd.read_csv(file_path_market_cap)

def plot1(data_market_cap):
    labels = ['Weapons Free Funds: Nuclear weapons screen',
              'Weapons Free Funds: Military contractors screen',
              'Gun Free Funds: Gun manufacturers screen',
              'Gun Free Funds: Gun retailers screen']
    label_counts = data_market_cap[labels].astype(bool).sum(axis=0)
    counts = label_counts.values
    bar_labels = ['Nuclear weapons screen', 'Military contractors screen', 'Gun manufacturers screen', 'Gun retailers screen']
    bar_colors = ['tab:red', 'tab:blue', 'tab:green', 'tab:orange']

    fig, ax = plt.subplots()
    ax.bar(bar_labels, counts, color=bar_colors)
    ax.set_ylabel('Number of Companies')
    ax.set_title('Companies Providing Weapons & Military Support')
    ax.set_xticklabels(bar_labels, rotation=45, ha='right')
    return fig

# Plot 2
def plot2(data_market_cap):
    labels = ['Fossil Free Funds: Coal screen',
              'Fossil Free Funds: Oil / gas screen',
              'Fossil Free Funds: Fossil-fired utility screen']
    label_counts = data_market_cap[labels].astype(bool).sum(axis=0)
    counts = label_counts.values
    bar_labels = ['Coal screen', 'Oil / gas screen', 'Fossil-fired utility screen']
    bar_colors = ['tab:red', 'tab:blue', 'tab:green']

    fig, ax = plt.subplots()
    ax.bar(bar_labels, counts, color=bar_colors)
    ax.set_ylabel('Number of Companies')
    ax.set_title('Companies with Dependencies on Non-Renewable Energy')
    ax.set_xticklabels(bar_labels, rotation=45, ha='right')
    return fig

# Plot 3
def plot3(data_market_cap):
    labels = [
        'Deforestation Free Funds: Producer screen',
        'Deforestation Free Funds: Financier screen',
        'Deforestation Free Funds: Consumer brand screen'
    ]
    label_counts = data_market_cap[labels].astype(bool).sum(axis=0)
    counts = label_counts.values
    bar_labels = ['Producer screen', 'Banks and lenders screen', 'Major consumer brands screen']
    bar_colors = ['tab:red', 'tab:blue', 'tab:green']

    fig, ax = plt.subplots()
    ax.bar(bar_labels, counts, color=bar_colors)
    ax.set_ylabel('Number of Companies')
    ax.set_title('Companies with Deforestation Supporting Operations')
    ax.set_xticklabels(bar_labels, rotation=45, ha='right')
    return fig

# Plot 4
def plot4(data_market_cap):
    labels = ['Deforestation Free Funds: Palm oil producer screen',
              'Deforestation Free Funds: Palm oil consumer brand screen',
              'Deforestation Free Funds: Paper / pulp producer screen',
              'Deforestation Free Funds: Paper / pulp consumer brand screen',
              'Deforestation Free Funds: Rubber producer screen',
              'Deforestation Free Funds: Rubber consumer brand screen',
              'Deforestation Free Funds: Timber producer screen',
              'Deforestation Free Funds: Timber consumer brand screen',
              'Deforestation Free Funds: Cattle producer screen',
              'Deforestation Free Funds: Cattle consumer brand screen',
              'Deforestation Free Funds: Soy producer screen',
              'Deforestation Free Funds: Soy consumer brand screen']
    label_counts = data_market_cap[labels].astype(bool).sum(axis=0)
    counts = label_counts.values
    bar_labels = ['Palm oil producer screen', 'Palm oil consumer brand screen', 'Paper / pulp producer screen', 
                  'Paper / pulp consumer brand screen', 'Rubber producer screen', 'Rubber consumer brand screen', 
                  'Timber producer screen', 'Timber consumer brand screen', 'Cattle producer screen', 
                  'Cattle consumer brand screen', 'Soy producer screen', 'Soy consumer brand screen']

    fig, ax = plt.subplots()
    ax.bar(bar_labels, counts)
    ax.set_ylabel('Number of Companies')
    ax.set_title('Retailers of Consumer Goods Related to Deforestation')
    ax.set_xticklabels(bar_labels, rotation=45, ha='right')
    return fig

# Load data
clean_market_dataset = '../data/cleaned_market_cap_values.csv'
data_market_cap = pd.read_csv(clean_market_dataset)

# Display the plots in Streamlit
st.header("Analysis of Companies with Ethical Concerns")

st.subheader("Companies Providing Weapons & Military Support")
fig1 = plot1(data_market_cap)
st.pyplot(fig1)

st.subheader("Companies with Dependencies on Non-Renewable Energy")
fig2 = plot2(data_market_cap)
st.pyplot(fig2)

st.subheader("Companies with Deforestation Supporting Operations")
fig3 = plot3(data_market_cap)
st.pyplot(fig3)

st.subheader("Retailers of Consumer Goods Related to Deforestation")
fig4 = plot4(data_market_cap)
st.pyplot(fig4)

# Function to generate 2D PCA plot
def plot_2d_pca(features_for_pca, cluster_labels):
    pca_2d = PCA(n_components=2)
    X_pca_2d = pca_2d.fit_transform(features_for_pca)

    plt.figure(figsize=(10, 8))
    plt.scatter(X_pca_2d[:, 0], X_pca_2d[:, 1], c=cluster_labels, cmap='viridis', marker='o', alpha=0.7, edgecolor='k')
    plt.title('Clusters Visualized in PCA-Reduced 2D Space')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.colorbar(label='Cluster Label')
    st.pyplot()

# Function to generate 3D PCA plot
def plot_3d_pca(features_for_pca, cluster_labels):
    pca_3d = PCA(n_components=3)
    X_pca_3d = pca_3d.fit_transform(features_for_pca)

    fig = plt.figure(figsize=(12, 10))
    ax = fig.add_subplot(111, projection='3d')

    scatter = ax.scatter(X_pca_3d[:, 0], X_pca_3d[:, 1], X_pca_3d[:, 2], 
                         c=cluster_labels, cmap='viridis', marker='o', alpha=0.7, edgecolor='k')

    ax.set_title('Clusters Visualized in PCA-Reduced 3D Space')
    ax.set_xlabel('Principal Component 1')
    ax.set_ylabel('Principal Component 2')
    ax.set_zlabel('Principal Component 3')

    cbar = plt.colorbar(scatter, ax=ax, pad=0.1)
    cbar.set_label('Cluster Label')

    st.pyplot()

st.title('Clustering Analysis with PCA Visualization')

# Read data
clean_df = pd.read_csv('../Clustering-Hierarcal/clusters_added_clean_data_revised.csv')
features_for_pca = clean_df.drop(columns=['Cluster_Labels', 'Company_Name', 'Ticker', 'Company_Name_Encoded', 'Industry_Encoded'])
cluster_labels = clean_df['Cluster_Labels']

st.header('2D PCA Visualization')
plot_2d_pca(features_for_pca, cluster_labels)
st.header('3D PCA Visualization')
plot_3d_pca(features_for_pca, cluster_labels)