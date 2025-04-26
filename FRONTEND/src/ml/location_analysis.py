import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

# Load the dataset
df = pd.read_csv('../data/locations.csv')

# Part 1: K-means Clustering based on Geographical Coordinates
print("\n=== Geographical Clustering Analysis ===")

# Prepare data for clustering
X = df[['latitude', 'longitude']].values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Find optimal number of clusters using silhouette score
max_clusters = 10
silhouette_scores = []
for n_clusters in range(2, max_clusters + 1):
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    cluster_labels = kmeans.fit_predict(X_scaled)
    silhouette_avg = silhouette_score(X_scaled, cluster_labels)
    silhouette_scores.append(silhouette_avg)
    print(f"Silhouette score for {n_clusters} clusters: {silhouette_avg:.3f}")

# Plot silhouette scores
plt.figure(figsize=(10, 6))
plt.plot(range(2, max_clusters + 1), silhouette_scores, marker='o')
plt.xlabel('Number of Clusters')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Score vs Number of Clusters')
plt.savefig('silhouette_scores.png')
plt.close()

# Get optimal number of clusters
optimal_clusters = silhouette_scores.index(max(silhouette_scores)) + 2
print(f"\nOptimal number of clusters: {optimal_clusters}")

# Perform final clustering with optimal number of clusters
kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
df['Cluster'] = kmeans.fit_predict(X_scaled)

# Plot geographical clusters
plt.figure(figsize=(12, 8))
scatter = plt.scatter(df['longitude'], df['latitude'], c=df['Cluster'], 
                     cmap='viridis', alpha=0.6)
plt.colorbar(scatter)
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.title('Geographical Clusters of Locations in Uttarakhand')
for i, row in df.iterrows():
    plt.annotate(row['name'], (row['longitude'], row['latitude']), 
                xytext=(5, 5), textcoords='offset points', fontsize=8)
plt.savefig('geographical_clusters.png')
plt.close()

# Part 2: NLP Analysis
print("\n=== NLP Analysis ===")

# Preprocess text data
def preprocess_text(text):
    # Tokenization
    tokens = word_tokenize(text.lower())
    # Remove stopwords and lemmatize
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(token) for token in tokens 
             if token.isalnum() and token not in stop_words]
    return ' '.join(tokens)

# Combine description and features for NLP analysis
df['text_data'] = df['description'] + ' ' + df['features']
df['processed_text'] = df['text_data'].apply(preprocess_text)

# TF-IDF Vectorization
tfidf = TfidfVectorizer(max_features=100)
text_features = tfidf.fit_transform(df['processed_text'])

# Get most common terms
print("\nMost common terms across all locations:")
feature_names = tfidf.get_feature_names_out()
for cluster in range(optimal_clusters):
    cluster_docs = df[df['Cluster'] == cluster]['processed_text']
    cluster_text = ' '.join(cluster_docs)
    words = word_tokenize(cluster_text)
    word_freq = Counter(words).most_common(5)
    print(f"\nCluster {cluster} most common terms:")
    print(word_freq)

# Part 3: Vibe Analysis
print("\n=== Vibe Analysis ===")

# Extract unique vibes
all_vibes = []
for vibes in df['vibe'].str.split(','):
    all_vibes.extend([v.strip() for v in vibes])
vibe_counts = Counter(all_vibes)

# Plot vibe distribution
plt.figure(figsize=(12, 6))
vibe_df = pd.DataFrame.from_dict(vibe_counts, orient='index')
vibe_df.plot(kind='bar')
plt.title('Distribution of Vibes across Locations')
plt.xlabel('Vibe Type')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('vibe_distribution.png')
plt.close()

# Analyze vibe combinations
print("\nMost common vibe combinations:")
vibe_combinations = df['vibe'].value_counts().head()
print(vibe_combinations)

# Part 4: Location Type Analysis
print("\n=== Location Type Analysis ===")

# Analyze distribution of location types
type_counts = df['type'].value_counts()
print("\nDistribution of location types:")
print(type_counts)

# Plot location type distribution
plt.figure(figsize=(10, 6))
type_counts.plot(kind='bar')
plt.title('Distribution of Location Types')
plt.xlabel('Location Type')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('location_types.png')
plt.close()

# Part 5: Intensity Analysis
print("\n=== Intensity Analysis ===")

# Calculate average intensity by location type
intensity_by_type = df.groupby('type')['intensity'].mean().sort_values(ascending=False)
print("\nAverage intensity by location type:")
print(intensity_by_type)

# Plot intensity distribution
plt.figure(figsize=(10, 6))
plt.hist(df['intensity'], bins=9, edgecolor='black')
plt.title('Distribution of Location Intensities')
plt.xlabel('Intensity')
plt.ylabel('Count')
plt.savefig('intensity_distribution.png')
plt.close()

# Save cluster information
cluster_info = df.groupby('Cluster').agg({
    'name': list,
    'type': lambda x: list(x.value_counts().index),
    'intensity': 'mean'
}).round(2)

print("\n=== Cluster Analysis ===")
print("\nCluster Information:")
print(cluster_info)

# Save results to a file
with open('analysis_results.txt', 'w') as f:
    f.write("=== Uttarakhand Location Analysis Results ===\n\n")
    f.write(f"Total locations analyzed: {len(df)}\n")
    f.write(f"Optimal number of geographical clusters: {optimal_clusters}\n\n")
    
    f.write("=== Cluster Information ===\n")
    f.write(cluster_info.to_string())
    f.write("\n\n=== Most Common Vibes ===\n")
    for vibe, count in vibe_counts.most_common():
        f.write(f"{vibe}: {count}\n")
    
    f.write("\n=== Location Type Distribution ===\n")
    f.write(type_counts.to_string())
    
    f.write("\n\n=== Average Intensity by Location Type ===\n")
    f.write(intensity_by_type.to_string())

print("\nAnalysis complete! Results have been saved to 'analysis_results.txt'")
print("Visualizations have been saved as PNG files.") 