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

# Initialize Streamlit app
st.title("Ask Questions")
st.markdown('<style>h1{color: orange; text-align: center;}</style>', unsafe_allow_html=True)
st.subheader('Chat Bot 💪')
st.markdown('<style>h3{color: pink; text-align: center;}</style>', unsafe_allow_html=True)

# Input URL from user
url = st.text_input("Enter URL to scrape content:", "https://example.com")

# Scrape content from URL
if url:
    scraped_text = scrape_content(url)
    st.write("Scraped Content:")
    st.write(scraped_text)

    # Split text into chunks\
    text_chunks = split_text_into_chunks(scraped_text)
    st.write("Text Chunks:")
    st.write(text_chunks)

    # Create embeddings
    embeddings = create_embeddings()
    st.write("Embeddings:")
    st.write(embeddings)

    # Create vector store
    vector_store = create_vector_store(text_chunks, embeddings)
    st.write("Vector Store:")
    st.write(vector_store.index.ntotal)

    # Create LLMS model
    llm = create_llms_model()

    # Initialize conversation history
    if 'history' not in st.session_state:
        st.session_state['history'] = []

    if 'generated' not in st.session_state:
        st.session_state['generated'] = ["Hello! Ask me anything about 🤗"]

    if 'past' not in st.session_state:
        st.session_state['past'] = ["Hey! 👋"]

    # Create memory
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    # Create chain
    chain = ConversationalRetrievalChain.from_llm(llm=llm, chain_type='stuff',
                                                  retriever=vector_store.as_retriever(search_kwargs={"k": 2}),
                                                  memory=memory)

    # Define chat function
    def conversation_chat(query):
        result = chain({"question": query, "chat_history": st.session_state['history']})
        st.session_state['history'].append((query, result["answer"]))
        return result["answer"]

    # Display chat history
    reply_container = st.container()
    container = st.container()

    with container:
        with st.form(key='my_form', clear_on_submit=True):
            user_input = st.text_input("Question:", placeholder="Ask about your Job Interview", key='input')
            submit_button = st.form_submit_button(label='Send')

        if submit_button and user_input:
            output = conversation_chat(user_input)
            st.session_state['past'].append(user_input)
            st.session_state['generated'].append(output)

    if st.session_state['generated']:
        with reply_container:
            for i in range(len(st.session_state['generated'])):
                message(st.session_state["past"][i], is_user=True, key=str(i) + '_user', avatar_style="thumbs")
                message(st.session_state["generated"][i], key=str(i), avatar_style="fun-emoji")
