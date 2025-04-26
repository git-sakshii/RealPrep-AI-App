# FastAPI for RAG Question Generation
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
from typing import List, Optional
import logging
from fastapi.middleware.cors import CORSMiddleware

# Langchain Imports
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()

# --- Configuration ---
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
if not AZURE_OPENAI_API_KEY:
    raise ValueError("AZURE_OPENAI_API_KEY environment variable is not set")
AZURE_OPENAI_BASE = "https://saksh-m9wmtwqc-swedencentral.cognitiveservices.azure.com"
AZURE_OPENAI_API_VERSION = "2025-01-01-preview"
AZURE_EMBEDDING_DEPLOYMENT = "text-embedding-ada-002"
AZURE_CHAT_DEPLOYMENT = "gpt-4o"

PDF_FILE = "QUESTIONS.pdf"
FAISS_INDEX_PATH = "faiss_index_colab"
CHUNK_SIZE = 400
CHUNK_OVERLAP = 40

# Configure logging
logger = logging.getLogger(__name__)

# --- Pydantic Models ---
class InterviewInput(BaseModel):
    emotion: str = Field(..., description="Perceived emotion...")
    tech_stack: List[str] = Field(..., description="List of relevant technical skills/topics for PDF query.")
    previous_questions: Optional[List[str]] = Field(None, description="List of questions already asked.")

class InterviewResponse(BaseModel):
    question: str

# --- FastAPI App ---
app = FastAPI(
    title="AI Interview Assistant API",
    version="1.7.0"
)

# --- CORS ---
origins = [
    "http://localhost:3000", "http://localhost", "http://localhost:8080", "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# --- Core Logic ---
def load_or_create_vector_store(pdf_path: str, index_path: str, embeddings_model):
    # Load existing index or create new one from PDF
    if os.path.exists(index_path):
        try:
            vectorstore = FAISS.load_local(index_path, embeddings_model, allow_dangerous_deserialization=True)
            return vectorstore
        except Exception as e:
            logger.warning(f"Failed to load existing index: {e}. Recreating index.")
    
    # Create new index from PDF
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    text_chunks = text_splitter.split_documents(documents)
    vectorstore = FAISS.from_documents(text_chunks, embeddings_model)
    vectorstore.save_local(index_path)
    return vectorstore

def generate_interview_question(llm, retriever, emotion: str, tech_stack: List[str], previous_questions: List[str]) -> str:
    # Generate specific query combining tech stack and emotion
    tech_stack_str = " ".join(tech_stack)
    query = f"Interview questions for {tech_stack_str} when candidate is feeling {emotion}"
    
    # Retrieve relevant context from vector store
    docs = retriever.get_relevant_documents(query)
    context = "\n\n---\n\n".join([f"Retrieved Context Snippet {i+1}:\n{doc.page_content}" for i, doc in enumerate(docs[:3])])
    
    # Format history of previous questions
    history_string = "None yet."
    if previous_questions:
        history_string = "\n".join([f"- {q}" for q in previous_questions])
    
    # Create prompt for question generation
    prompt = f"""
You are an AI generating the *next* interview question for a candidate interested in {', '.join(tech_stack)}.
The candidate seems {emotion}.

**CONTEXT:**
- The 'Reference Context' below was specifically retrieved from a PDF section containing questions for candidates interested in '{", ".join(tech_stack)}' who seem '{emotion}'.
- 'Previously Asked Questions' lists questions already asked in this session.

**YOUR TASK:**
1.  **Select the BEST question snippet** from the 'Reference Context' below that fits the situation.
2.  **Rephrase** the selected question slightly to make it conversational, while keeping the core meaning.
3.  The generated question **MUST NOT** be identical or substantially similar to any question in 'Previously Asked Questions'.
4.  If the 'Reference Context' is empty, shows an error, or contains no usable question snippets despite the specific search, then output ONLY the exact phrase: "Tell me about a project you're proud of using {tech_stack_str}."

**Reference Context:**
---
{context}
---

**Previously Asked Questions:**
---
{history_string}
---

**Next Interview Question:**
"""
    
    # Generate question using LLM
    response = llm.invoke(prompt)
    question = response.content.strip()
    
    # Clean up response and return
    return question

# --- FastAPI Endpoints ---
@app.post("/next-question", response_model=InterviewResponse)
async def get_next_question(interview_input: InterviewInput, request: Request):
    # Process request and generate next question
    llm = request.app.state.llm
    retriever = request.app.state.retriever
    previous_questions = interview_input.previous_questions or []
    
    question = generate_interview_question(
        llm=llm, 
        retriever=retriever, 
        emotion=interview_input.emotion,
        tech_stack=interview_input.tech_stack, 
        previous_questions=previous_questions
    )
    
    return InterviewResponse(question=question)

@app.on_event("startup")
async def startup_event():
    embeddings_model = AzureOpenAIEmbeddings(
        azure_deployment=AZURE_EMBEDDING_DEPLOYMENT,
        api_key=AZURE_OPENAI_API_KEY,
        azure_endpoint=AZURE_OPENAI_BASE,
        api_version=AZURE_OPENAI_API_VERSION
    )

    llm = AzureChatOpenAI(
        api_key=AZURE_OPENAI_API_KEY,
        azure_endpoint=AZURE_OPENAI_BASE,
        azure_deployment=AZURE_CHAT_DEPLOYMENT,
        api_version=AZURE_OPENAI_API_VERSION
    )

    vectorstore = load_or_create_vector_store(PDF_FILE, FAISS_INDEX_PATH, embeddings_model)
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})

    app.state.llm = llm
    app.state.retriever = retriever
