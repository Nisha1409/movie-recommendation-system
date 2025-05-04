from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np  # ✅ Ensure `NaN` values are handled

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

MODEL_PATH = r'd:\movie-recommendation-system\backend\recommend\movie_recommender.pkl'

# ✅ Mapping Watchmode Genre IDs to Text Labels
genre_mapping = {
    1: "Action", 2: "Adventure", 3: "Animation", 4: "Comedy",
    7: "Drama", 8: "Fantasy", 10: "Historical", 11: "Horror",
    13: "Mystery", 14: "Romance", 17: "Thriller"
}

def load_model():
    """Load the trained recommendation model."""
    try:
        with open(MODEL_PATH, 'rb') as f:
            similarity_matrix, df, metadata = pickle.load(f)

        df['imdb_id'] = df['imdb_id'].astype(str)
        return similarity_matrix, df

    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, None

def recommend_movies(user_liked_movies, user_watch_history, top_n=10):
    """Generate movie recommendations based on liked movies and watch history."""
    try:
        similarity_matrix, df = load_model()
        if similarity_matrix is None or df is None:
            print("❌ Model loading failed.")
            return []

        if not user_liked_movies and not user_watch_history:
            print("⚠️ No user-specific preferences provided.")
            return []

        user_genres = set()
        for movie in user_liked_movies + user_watch_history:
            genres = movie.get('genres', [])
            if isinstance(genres, list):
                genres = [genre_mapping.get(g, str(g)) for g in genres]
            user_genres.update(genres)

        print(f"📌 Extracted User Genres for Filtering: {user_genres}")

        def match_genres(movie_genres):
            if not isinstance(movie_genres, str):
                return False
            movie_genres_list = [genre.strip() for genre in movie_genres.split(", ")]
            return any(genre in user_genres for genre in movie_genres_list)

        recommendations = df[
            (df['imdb_rating'] >= 7.5) &
            (df['release_year'] >= 2015) &
            df['genres'].apply(match_genres)
        ].sort_values(by='release_date', ascending=False)
    
        if recommendations.empty:
            print("⚠️ No genre-based matches, using fallback recommendations.")
            recommendations = df.sort_values(by='vote_average', ascending=False).head(top_n)

        # ✅ Replace `NaN` values to prevent JSON errors
        recommendations = recommendations.fillna({
            "overview": "No description available",
            "imdb_rating": 0,
            "runtime": 0
        })

        # ✅ Debugging check before returning results
        print(f"🔥 Filtered Recommendations:\n{recommendations[['imdb_id', 'title', 'genres', 'imdb_rating','release_year']].head()}")

        return recommendations.head(top_n)[['imdb_id', 'title', 'genres', 'original_language', 'overview', 'imdb_rating', 'runtime','release_year']].to_dict(orient='records')

    except Exception as e:
        print(f"❌ Error in recommend_movies: {e}")
        return []

@app.route('/recommend', methods=['POST'])
def recommend():
    print("✅ /recommend route is active")

    try:
        data = request.json
        print(f"🔍 Raw request data: {data}")

        if not data:
            return jsonify({"error": "Empty request"}), 400

        liked_movies = data.get('liked_movies', [])
        watch_history = data.get('watch_history', [])
        top_n = int(data.get('top_n', 10))

        #print(f"📌 Processing recommendations for {len(liked_movies)} liked movies & {len(watch_history)} watch history items.")

        recommendations = recommend_movies(liked_movies, watch_history, top_n)

        # print(f"🔥 Final API Response Sent: {recommendations}")

        return jsonify(recommendations) if recommendations else jsonify([])  # ✅ Ensure valid JSON response

    except Exception as e:
        print(f"❌ Error in /recommend endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

# ✅ Register Routes BEFORE Flask Starts
if __name__ == '__main__':
    print("Registered Routes:")
    print(app.url_map)  # ✅ Debug: Check registered routes

    app.run(debug=True)
