import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import pickle
import os

# === Config ===
CSV_PATH = r'D:\movieDataset\TMDB_all_movies.csv'  # Path to the dataset
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'movie_recommender.pkl')  # Path to save the model
TOP_K = 50  # Number of top similar movies to store for each movie

def load_dataset():
    """Load the dataset and filter for relevant movies."""
    df = pd.read_csv(CSV_PATH)
    required_columns = ['title', 'original_language', 'original_title','overview' ,'genres', 'imdb_rating', 'release_date', 'runtime', 'imdb_id']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Dataset is missing required columns: {missing_columns}")

    df = df[required_columns]
    df.dropna(subset=['title', 'genres', 'release_date'], inplace=True)

    # Extract release year
    df['release_date'] = pd.to_datetime(df['release_date'], errors='coerce')
    df['release_year'] = df['release_date'].dt.year
    df.dropna(subset=['release_year'], inplace=True)
    df['release_year'] = df['release_year'].astype(int)

    # ✅ New Filters: Recent movies with IMDb rating above 7.5
    df = df[(df['imdb_rating'] >= 7.5) & (df['release_year'] >= 2015)]
    df = df.sort_values(by='release_date', ascending=False)
    print(f"Filtered dataset: {df.shape[0]} movies after applying rating & date constraints.")
    return df

def preprocess_data(df):
    """Prepare the movie metadata for TF-IDF analysis."""
    df['content'] = (
        df['title'].fillna('') + " " +
        df['original_language'].fillna('') + " " +
        df['overview'].fillna('') + " " +
        df['original_title'].fillna('') + " " +
        (df['genres'].fillna('') + " ") * 3 + " " +  # Boost genre relevance
        df['runtime'].astype(str) + " mins " +  # Include runtime
        df['imdb_id'].fillna('')  # Include IMDb ID for linking
    )
    return df

def train_model(df):
    """Train the TF-IDF model and find similar movies."""
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])

    nn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=TOP_K + 1)
    nn.fit(tfidf_matrix)

    distances, indices = nn.kneighbors(tfidf_matrix)

    # Store the top-k similar movies
    top_k_similarities = {}
    for idx, (similar_indices, similar_distances) in enumerate(zip(indices, distances)):
        top_k_similarities[idx] = list(zip(similar_indices[1:], 1 - similar_distances[1:]))  # Exclude self

    return top_k_similarities, df

def save_model(similarity_matrix, df):
    """Save the trained model and dataset."""
    metadata = {
        "columns": df.columns.tolist(),
        "num_movies": len(df),
        "top_k": TOP_K
    }
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump((similarity_matrix, df, metadata), f)
    print(f"Model saved at {MODEL_PATH}")

def main():
    try:
        print("Loading dataset...")
        df = load_dataset()

        print("Preprocessing data...")
        df = preprocess_data(df)

        print("Training model...")
        similarity_matrix, df = train_model(df)

        print("Saving model...")
        save_model(similarity_matrix, df)

        print("✅ Model training complete.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    main()
