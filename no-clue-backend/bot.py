import streamlit as st
import requests
from bs4 import BeautifulSoup
from streamlit_chat import message
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import CTransformers
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter



# Function to scrape content from URL
def scrape_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    # Extract text content from HTML
    text = ' '.join([p.text for p in soup.find_all('p')])
    # loader = TextLoader(text)
    # doc = loader.load()
    return text

# Function to split text into chunks
def split_text_into_chunks(text):
    # Split text into chunks (you can adjust the chunk size and overlap as needed)
    print("Splitting text into chunks...#####################################")
    # text = [text]
    # text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

    text_chunks = text_splitter.split_text(text)
    return text_splitter.create_documents(text_chunks)

    print("Text chunks ###########################")
    return text_chunks

# Function to create embeddings
def create_embeddings():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': "cpu"})
    return embeddings

# Function to create vector store
def create_vector_store(text_chunks, embeddings):
    vector_store = FAISS.from_documents(text_chunks, embeddings)
    print("IM done wid vector store creation#####################################")
    return vector_store

# Function to create LLMS model
def create_llms_model():
    llm = CTransformers(model="mistral-7b-instruct-v0.1.Q4_K_M.gguf", config={'max_new_tokens': 128, 'temperature': 0.01})
    return llm