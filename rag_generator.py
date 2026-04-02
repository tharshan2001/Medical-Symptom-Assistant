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
        """Generate optimized response with 3-5 diseases and 4 suggestions."""
        context = "\n".join(
            [f"- {row.symptom_text} → {row.prognosis}" 
             for _, row in retrieved_data.iterrows()]
        )
        
        prompt = f"""Based on these symptoms: "{query}"

Relevant cases:
{context}

Respond in exactly this format (no markdown, no asterisks):

[One short sentence about the symptoms]

Possible Conditions:
- disease 1
- disease 2
- disease 3
- disease 4
- disease 5 (if applicable)

What to Do:
1. Rest and stay hydrated
2. Monitor your symptoms
3. Consult a doctor if symptoms persist
4. Avoid self-medication

This is not a medical diagnosis.
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
    
    store = VectorStore()
    store.load_index()
    
    generator = RAGGenerator()
    results = store.retrieve("headache fever cough", k=8)
    answer = generator.generate("headache fever cough", results)
    print(answer)