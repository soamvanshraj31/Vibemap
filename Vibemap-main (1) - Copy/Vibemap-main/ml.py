import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from textblob import TextBlob
import matplotlib.pyplot as plt
import seaborn as sns
import joblib  # For model saving/loading

class VibeAnalyzer:
    def __init__(self, num_vibes=5):
        """
        Initialize the Vibe Analyzer
        
        Parameters:
        num_vibes (int): Number of vibe clusters to identify (default: 5)
        """
        self.num_vibes = num_vibes
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)  # Consider single words and phrases
        )
        self.kmeans = KMeans(n_clusters=num_vibes, random_state=42)
        self.vibe_names = {}  # To store human-readable vibe names
        self.vibe_profiles = None
        
    def preprocess_text(self, text):
        """Basic text cleaning"""
        if not isinstance(text, str):
            return ""
        text = text.lower().strip()
        text = ' '.join([word for word in text.split() if len(word) > 2])
        return text
    
    def analyze_sentiment(self, text):
        """Enhanced sentiment analysis with intensity"""
        analysis = TextBlob(text)
        polarity = analysis.sentiment.polarity
        subjectivity = analysis.sentiment.subjectivity
        
        # Simple intensity calculation
        intensity = min(1.0, len(text.split()) / 20)  # Longer reviews more impactful
        weighted_polarity = polarity * intensity
        
        return {
            'polarity': polarity,
            'subjectivity': subjectivity,
            'weighted_polarity': weighted_polarity
        }
    
    def fit(self, df, text_col='review', rating_col='rating'):
        """
        Train the vibe analysis model
        
        Parameters:
        df (pd.DataFrame): DataFrame containing reviews
        text_col (str): Column name for review text
        rating_col (str): Column name for ratings (optional)
        """
        # Preprocess text
        df['cleaned_review'] = df[text_col].apply(self.preprocess_text)
        
        # Sentiment analysis
        sentiment_results = df['cleaned_review'].apply(self.analyze_sentiment).apply(pd.Series)
        df = pd.concat([df, sentiment_results], axis=1)
        
        # Vectorize text
        X = self.vectorizer.fit_transform(df['cleaned_review'])
        
        # Cluster reviews
        self.kmeans.fit(X)
        df['vibe_cluster'] = self.kmeans.labels_
        
        # Evaluate clustering quality
        silhouette_avg = silhouette_score(X, self.kmeans.labels_)
        print(f"Clustering quality (silhouette score): {silhouette_avg:.2f}")
        
        # Analyze each cluster's characteristics
        self.vibe_profiles = df.groupby('vibe_cluster').agg({
            'weighted_polarity': ['mean', 'std'],
            'subjectivity': 'mean',
            text_col: 'count',
            rating_col: 'mean' if rating_col in df.columns else None
        }).droplevel(0, axis=1)
        
        self.vibe_profiles.columns = [
            'avg_sentiment', 'sentiment_std',
            'subjectivity', 'review_count', 'avg_rating'
        ] if rating_col in df.columns else [
            'avg_sentiment', 'sentiment_std',
            'subjectivity', 'review_count'
        ]
        
        # Extract top keywords for each vibe
        self._extract_vibe_keywords(X)
        
        return self
    
    def _extract_vibe_keywords(self, X):
        """Identify most important words for each vibe"""
        feature_names = self.vectorizer.get_feature_names_out()
        self.vibe_keywords = {}
        
        for i in range(self.num_vibes):
            # Get reviews in this cluster
            cluster_indices = np.where(self.kmeans.labels_ == i)[0]
            
            # Sum TF-IDF scores for words in these reviews
            cluster_tfidf = X[cluster_indices].sum(axis=0).A1
            
            # Get top 10 words
            top_word_indices = cluster_tfidf.argsort()[-10:][::-1]
            top_words = [feature_names[idx] for idx in top_word_indices]
            
            self.vibe_keywords[i] = top_words
        
        # Assign automatic vibe names based on keywords
        self._generate_vibe_names()
    
    def _generate_vibe_names(self):
        """Generate human-readable names for each vibe"""
        for cluster, words in self.vibe_keywords.items():
            positive_words = [w for w in words if TextBlob(w).sentiment.polarity > 0]
            negative_words = [w for w in words if TextBlob(w).sentiment.polarity < 0]
            
            if len(positive_words) > len(negative_words):
                self.vibe_names[cluster] = f"Positive: {'/'.join(positive_words[:3])}"
            else:
                self.vibe_names[cluster] = f"Negative: {'/'.join(negative_words[:3])}"
    
    def predict_vibe(self, new_reviews):
        """
        Analyze new reviews and predict their vibes
        
        Parameters:
        new_reviews (list or pd.Series): New reviews to analyze
        
        Returns:
        dict: Vibe analysis results
        """
        if isinstance(new_reviews, str):
            new_reviews = [new_reviews]
            
        new_df = pd.DataFrame({'review': new_reviews})
        new_df['cleaned_review'] = new_df['review'].apply(self.preprocess_text)
        
        # Sentiment analysis
        sentiment_results = new_df['cleaned_review'].apply(self.analyze_sentiment).apply(pd.Series)
        new_df = pd.concat([new_df, sentiment_results], axis=1)
        
        # Vectorize and predict
        X_new = self.vectorizer.transform(new_df['cleaned_review'])
        new_df['vibe_cluster'] = self.kmeans.predict(X_new)
        new_df['vibe_name'] = new_df['vibe_cluster'].map(self.vibe_names)
        
        # Calculate vibe distribution
        vibe_dist = new_df['vibe_cluster'].value_counts(normalize=True).to_dict()
        
        # Get most common vibe
        dominant_vibe = new_df['vibe_cluster'].mode()[0]
        
        return {
            'dominant_vibe': int(dominant_vibe),
            'dominant_vibe_name': self.vibe_names[dominant_vibe],
            'vibe_distribution': vibe_dist,
            'average_sentiment': new_df['weighted_polarity'].mean(),
            'detailed_results': new_df.to_dict('records')
        }
    
    def visualize_vibes(self):
        """Create visualization of the vibe clusters"""
        if not hasattr(self, 'vibe_profiles'):
            raise Exception("Model must be fit first")
            
        plt.figure(figsize=(10, 6))
        sns.scatterplot(
            x='avg_sentiment',
            y='subjectivity',
            size='review_count',
            hue=self.vibe_profiles.index,
            data=self.vibe_profiles,
            palette='viridis',
            sizes=(100, 1000),
            alpha=0.8
        )
        
        # Annotate with vibe names
        for i, row in self.vibe_profiles.iterrows():
            plt.text(
                row['avg_sentiment'] + 0.01,
                row['subjectivity'] + 0.01,
                f"Vibe {i}\n{self.vibe_names.get(i, '')}",
                fontsize=9
            )
            
        plt.title("Vibe Cluster Characteristics")
        plt.xlabel("Average Sentiment")
        plt.ylabel("Subjectivity")
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.tight_layout()
        return plt
    
    def save_model(self, filepath):
        """Save the trained model to disk"""
        joblib.dump({
            'vectorizer': self.vectorizer,
            'kmeans': self.kmeans,
            'vibe_names': self.vibe_names,
            'vibe_profiles': self.vibe_profiles,
            'vibe_keywords': self.vibe_keywords
        }, filepath)
    
    @classmethod
    def load_model(cls, filepath):
        """Load a trained model from disk"""
        data = joblib.load(filepath)
        analyzer = cls(num_vibes=data['kmeans'].n_clusters)
        analyzer.vectorizer = data['vectorizer']
        analyzer.kmeans = data['kmeans']
        analyzer.vibe_names = data['vibe_names']
        analyzer.vibe_profiles = data['vibe_profiles']
        analyzer.vibe_keywords = data['vibe_keywords']
        return analyzer


# Example Usage
if __name__ == "__main__":
    # 1. Load your Mockaroo dataset
    df = pd.read_csv('google_reviews_mockaroo.csv')
    
    # 2. Initialize and train the analyzer
    analyzer = VibeAnalyzer(num_vibes=5)
    analyzer.fit(df, text_col='review', rating_col='rating')
    
    # 3. See the discovered vibes
    print("\nDiscovered Vibe Profiles:")
    print(analyzer.vibe_profiles)
    
    print("\nVibe Keywords:")
    for vibe, words in analyzer.vibe_keywords.items():
        print(f"Vibe {vibe}: {', '.join(words)}")
    
    print("\nVibe Names:")
    print(analyzer.vibe_names)
    
    # 4. Visualize the vibes
    analyzer.visualize_vibes().show()
    
    # 5. Analyze new reviews
    test_reviews = [
        "This place has amazing ambiance and friendly staff!",
        "Too crowded and noisy, couldn't enjoy my time",
        "Average experience, nothing special"
    ]
    
    results = analyzer.predict_vibe(test_reviews)
    print("\nAnalysis Results:")
    print(f"Dominant Vibe: {results['dominant_vibe_name']}")
    print(f"Vibe Distribution: {results['vibe_distribution']}")
    print(f"Average Sentiment: {results['average_sentiment']:.2f}")
    
    # 6. Save the trained model
    analyzer.save_model('vibe_analyzer_model.joblib')
