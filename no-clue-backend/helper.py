import openai
import requests
from bs4 import BeautifulSoup

from dotenv import load_dotenv
import os

load_dotenv()  
API_KEY = os.getenv('API_KEY')

openai.api_key = API_KEY

# Function to scrape text content from a URL
def scrape_content_from_url(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    # Extract text content from HTML
    text = ' '.join([p.text for p in soup.find_all('p')])
    return text

# Function to interact with OpenAI API
def query_openai_api(content, query):
    response = openai.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=content + "User: " + query + "AI:",
        max_tokens=150,
        temperature=0.5
    )
    return response.choices[0].text

def scrape_url(url):
    # find only http and https links
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    links = []
    for link in soup.find_all('a'):
        if link.get('href') is not None:
            if 'http' in link.get('href'):
                links.append(link.get('href'))
            if 'https' in link.get('href'):
                links.append(link.get('href'))
    return links



# links = scrape_url('https://medium.com/ai-insights-cobet/exploring-mistral-large-with-function-calling-code-1aa0894db4d4')
# print(links)