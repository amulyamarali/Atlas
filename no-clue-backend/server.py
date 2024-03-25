from flask import Flask, jsonify, request
from flask_cors import CORS
from helper import scrape_content_from_url, query_openai_api
import openai
import requests
from bs4 import BeautifulSoup
# from googletrans import Translator
from deep_translator import GoogleTranslator

from dotenv import load_dotenv
import os




url_list = []

app = Flask(__name__)
CORS(app)  

load_dotenv()  
API_KEY = os.getenv('API_KEY')

openai.api_key = API_KEY


@app.route('/chatbot', methods=['POST'])
def get_data():
    data = request.json
    url = data.get('url')
    query = data.get('query')
    print('Received URL:', url)

    print("URL LIST", url_list)

    # Scrape content from URL
    if url not in url_list:
        ucontent = scrape_content_from_url(url)
        response = query_openai_api(ucontent, query)
    
    return jsonify({'message': response})

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text')
    lang1 = data.get('lang1')
    # lang2 = data.get('lang2')
    print('Received Text:', text)
    translator1 = GoogleTranslator(source='en', target=lang1)
    # translator2 = GoogleTranslator(source='en', target=lang2)

    translation1 = translator1.translate(text)
    # translation2 = translator2.translate(text)
    return jsonify({'lang1': translation1,})

# @app.route('/url', methods=['POST'])   
# def post_url():
#     data = request.json
#     url = data.get('url')
#     url_list.append(url)
#     return jsonify({'message': 'URL added successfully'})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000)