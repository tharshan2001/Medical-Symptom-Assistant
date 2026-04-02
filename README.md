# Disease Prediction RAG System

A symptom-based disease prediction system using RAG (Retrieval Augmented Generation).

## Setup

1. **Download the dataset:**
   - Go to https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning
   - Download `Training.csv` and place it in the project root

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure OpenAI API key:**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`

4. **Build the index (first run):**
   ```bash
   python main.py
   ```
   This will create the FAISS index automatically.

## Usage

### CLI Interface
```bash
python main.py
```

### Web Interface (Streamlit)
```bash
streamlit run app.py
```

## Project Structure
- `data_preprocessing.py` - Load and prepare symptom data
- `vector_store.py` - FAISS vector database with embeddings
- `rag_generator.py` - LLM response generation
- `main.py` - CLI interface
- `app.py` - Streamlit web app

## Warning
This system is for educational purposes only. Always consult a medical professional for proper diagnosis.