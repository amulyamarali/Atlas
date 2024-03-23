from flask import Flask, jsonify, request
from flask_cors import CORS
from bot import scrape_content, split_text_into_chunks, create_embeddings, create_vector_store, create_llms_model
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain


url_list = []
chain = None

app = Flask(__name__)
CORS(app)  

def conversation_chat(query, chain):
            result = chain({"question": query, "chat_history": []})
            return result["answer"]


@app.route('/chatbot', methods=['GET'])
def get_data():
    data = request.json
    url = data.get('url')
    query = data.get('query')
    print('Received URL:', url)

    print("URL LIST", url_list)

    # Scrape content from URL
    if url not in url_list:
        url_list.append(url)
        scraped_text = scrape_content(url)
        text_chunks = split_text_into_chunks(scraped_text)
        embeddings = create_embeddings()
        vector_store = create_vector_store(text_chunks, embeddings)
        llm = create_llms_model()
        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        global chain 
        chain = ConversationalRetrievalChain.from_llm(llm=llm, chain_type='stuff',
                                                        retriever=vector_store.as_retriever(search_kwargs={"k": 2}),
                                                        memory=memory)
    answer = conversation_chat(query, chain)
    return jsonify({'message': answer})









    return jsonify({'message': url})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000)