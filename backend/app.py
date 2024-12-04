from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    try:
        # Fetch the webpage
        response = requests.get(url)
        response.raise_for_status()

        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract title, links, and the full HTML content
        title = soup.title.string if soup.title else 'No title found'
        links = [a['href'] for a in soup.find_all('a', href=True)]
        html_content = soup.prettify()  # Beautify HTML content for better readability

        return jsonify({
            'title': title,
            'links': links,
            'html_content': html_content
        })
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
