# 🎬 Movie Recommendation System

An AI-powered movie recommendation system utilizing **MongoDB for user authentication**, multiple APIs (**Watchmode, OMDB, YouTube**) for fetching movie data, and an **ML-based recommendation engine** trained on a movie dataset using **TF-IDF vectorization and cosine similarity**.

## 🚀 Features
- **User Authentication** – Secure login system with MongoDB.
- **API Integrations** – Fetch movie metadata via Watchmode, OMDB, and YouTube (for trailers).
- **Personalized Recommendations** – ML model suggests movies based on liked movies and trailer watch history.
- **Movie Search & Interaction** – Users can search for movies, like them, and view trailers.
- **User Profiles** – Stores liked movies and trailer watch history for a tailored experience.

## 🛠️ Tech Stack
- **Frontend:** React.js, Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Machine Learning:** TF-IDF vectorization & cosine similarity-based recommendation model
- **APIs Used:** Watchmode API, OMDB API, YouTube API

## 🔧 Installation & Setup
```sh
git clone https://github.com/Nisha1409/movie-recommendation-system.git
cd movie-recommendation-system
npm install
npm start
```

## 📌 Usage
1. **Sign up & log in** to the platform.
2. **Search for movies** using the search functionality.
3. **Like movies** to save them to your profile.
4. **Watch trailers** retrieved via the YouTube API.
5. **Receive recommendations** based on liked movies and trailer watch history.
6. **Explore your profile** with personalized movie lists.


## 📡 API Integration Details
- **Watchmode API** – Fetches metadata about movies, including streaming availability.
- **OMDB API** – Provides additional details such as ratings, descriptions, and cast information.
- **YouTube API** – Retrieves official trailers, allowing users to preview movies before watching.


## 🤝 Contributing
Contributions are welcome! Follow these steps:
1. **Fork** the repository.
2. **Create a new branch** for your changes.
3. **Commit & push** your updates.
4. **Submit a pull request** for review.
