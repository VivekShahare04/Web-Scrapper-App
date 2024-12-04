import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [url, setUrl] = useState('');
    const [scrapedData, setScrapedData] = useState(null);
    const [error, setError] = useState(null);
    const [copyMessage, setCopyMessage] = useState('');

    const handleScrape = async () => {
        setError(null);
        setScrapedData(null);
        setCopyMessage('');

        try {
            const response = await axios.post('http://localhost:5000/scrape', { url });
            setScrapedData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    const handleCopy = () => {
        if (scrapedData?.html_content) {
            navigator.clipboard.writeText(scrapedData.html_content);
            setCopyMessage('HTML content copied to clipboard!');
            setTimeout(() => setCopyMessage(''), 3000); // Clear message after 3 seconds
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Web Scraper</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginBottom: '10px',
                    }}
                />
                <button
                    onClick={handleScrape}
                    style={{
                        display: 'block',
                        width: '25%',
                        padding: '10px',
                        backgroundColor: 'rgb(255,255,0)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        
                    }}
                >
                    Scrape
                </button>
            </div>

            {error && (
                <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            {scrapedData && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Scraped Data</h2>

                    <div style={{ marginBottom: '20px' }}>
                        <h3>Page Title:</h3>
                        <p style={{ fontSize: '16px', fontStyle: 'italic' }}>{scrapedData.title}</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3>Links Found:</h3>
                        <ul style={{ paddingLeft: '20px' }}>
                            {scrapedData.links.map((link, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#007BFF', textDecoration: 'none' }}
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3>HTML Content:</h3>
                        <div
                            style={{
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                background: '#f9f9f9',
                                overflowY: 'auto',
                                maxHeight: '400px',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                position: 'relative',
                            }}
                        >
                            {scrapedData.html_content}
                        </div>
                        <button
                            onClick={handleCopy}
                            style={{
                                marginTop: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Copy HTML Content
                        </button>
                        {copyMessage && (
                            <p style={{ color: 'green', marginTop: '10px', fontWeight: 'bold' }}>
                                {copyMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
