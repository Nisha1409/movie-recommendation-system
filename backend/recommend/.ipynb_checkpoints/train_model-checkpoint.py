import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pickle
import os
import numpy as np

# === Config ===
CSV_PATH = r'D:\movieDataset\TMDB_all_movies.csv'  # Path to the dataset
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'movie_recommender.pkl')  # Path to save the model
TOP_K = 50  # Number of top similar movies to store for each movie


def load_dataset():
    """Load the dataset and select relevant columns."""
    df = pd.read_csv(CSV_PATH)
    required_columns = ['id', 'title', 'original_language', 'original_title', 'genres']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Dataset is missing required columns: {missing_columns}")

    # Select relevant columns and drop rows with missing critical data
    df = df[required_columns]
    df.dropna(subset=['title', 'genres'], inplace=True)

    return df


def preprocess_data(df):
    """Combine title, original language, original title, and genres for better context."""
    df['content'] = (
        df['title'].fillna('') + " " +
        df['original_language'].fillna('') + " " +
        df['original_title'].fillna('') + " " +
        df['genres'].fillna('')
    )
    return df


def train_model(df):
    """Train the TF-IDF model and calculate sparse cosine similarity."""
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])

    # Compute cosine similarity in a sparse manner
    top_k_similarities = {}
    for idx in range(tfidf_matrix.shape[0]):
        cosine_similarities = linear_kernel(tfidf_matrix[idx], tfidf_matrix).flatten()
        similar_indices = np.argsort(cosine_similarities)[-TOP_K-1:-1][::-1]  # Get top-k indices
        similar_scores = cosine_similarities[similar_indices]
        top_k_similarities[idx] = list(zip(similar_indices, similar_scores))

    return top_k_similarities, df


def save_model(similarity_matrix, df):
    """Save the trained model and processed dataset."""
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump((similarity_matrix, df), f)
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
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
    except ValueError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")


if __name__ == '__main__':
    main()