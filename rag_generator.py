import os
import pandas as pd
from dotenv import load_dotenv
from google import genai

load_dotenv()

class RAGGenerator:
    def __init__(self, model_name: str = "gemini-flash-latest"):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_name = model_name
    
    def generate(self, query: str, retrieved_data: 'pd.DataFrame') -> str:
        """Generate response based on retrieved context."""
        context = "\n".join(
            [f"Symptoms: {row.symptom_text} -> Disease: {row.prognosis}" 
             for _, row in retrieved_data.iterrows()]
        )
        
        prompt = f"""User symptoms: {query}

Relevant medical data:
{context}

Based on this, suggest possible diseases.
Do NOT give a final diagnosis. Be cautious. Recommend seeking professional medical advice.
"""
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        
        return response.text

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    from vector_store import VectorStore
    from data_preprocessing import load_and_prepare_data
    
    store = VectorStore()
    store.load_index()
    
    generator = RAGGenerator()
    results = store.retrieve("headache fever cough", k=5)
    answer = generator.generate("headache fever cough", results)
    print(answer)