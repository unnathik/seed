from flask import Flask, request, jsonify
import yfinance as yf
import requests
import urllib.request
import pandas as pd
import json
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all domains on all routes. For production, specify the domain of your frontend.
CORS(app)


@app.route('/stock', methods=['GET'])
def get_stock_info():
    # Get ticker symbol from query parameter
    ticker_symbol = request.args.get('ticker', '').upper()
    url = "https://query2.finance.yahoo.com/v1/finance/esgChart?symbol=" + ticker_symbol

# Parse the HTML content of the page
    
    # Fetch stock information using yfinance
    stock = yf.Ticker(ticker_symbol)
    # Attempt to fetch stock info; if unavailable, return an error message
    stock_info = stock.info
    hist = stock.history()
    connection = urllib.request.urlopen(url)
    data = connection.read()
    data_2 = json.loads(data)

    try:
        Formatdata = data_2["esgChart"]["result"][0]["symbolSeries"]
        Formatdata_2 = pd.DataFrame(Formatdata)
    except: 
        Formatdata = "N/A"

    try: 
        esg = float(Formatdata_2.iloc[-1]["esgScore"])
        gs = float(Formatdata_2.iloc[-1]["governanceScore"])
        es = float(Formatdata_2.iloc[-1]["environmentScore"])
        ss = float(Formatdata_2.iloc[-1]["socialScore"])
    except: 
        esg = 0
        gs = 0
        es = 0
        ss = 0

    # Extracting relevant fields
    relevant_info = {
        "symbol": stock_info.get("symbol"),
        "companyName": stock_info.get("longName"),
        "sector": stock_info.get("sector"),
        "currentPrice": stock_info.get("currentPrice"),
        "marketCap": stock_info.get("marketCap"),
        "forwardPE": stock_info.get("forwardPE"),
        "dividendYield": stock_info.get("dividendYield"),
        "52WeekLow": stock_info.get("fiftyTwoWeekLow"),
        "52WeekHigh": stock_info.get("fiftyTwoWeekHigh"),
        "openPrice": stock_info.get("open"),
        "previousClose": stock_info.get("previousClose"),
        "volume": stock_info.get("volume"),
        "averageVolume": stock_info.get("averageVolume"),
        "marketCap": stock_info.get("marketCap"),
        "peRatio": stock_info.get("trailingPE"),
        "beta": stock_info.get("beta"),
        "dividendRate": stock_info.get("dividendRate"),
        "dividendYield": stock_info.get("dividendYield"),
        "exDividendDate": stock_info.get("exDividendDate"),
        "payoutRatio": stock_info.get("payoutRatio"),
        "fiftyDayAverage": stock_info.get("fiftyDayAverage"),
        "twoHundredDayAverage": stock_info.get("twoHundredDayAverage"),
        "news": stock.news[0:2],
        "day5": float(hist.iloc[-1]['Close']),
        "day4": float(hist.iloc[-2:-1]['Close']),
        "day3": float(hist.iloc[-3:-2]['Close']),
        "day2": float(hist.iloc[-4:-3]['Close']),
        "day1": float(hist.iloc[-5:-4]['Close']),
        "day0": float(hist.iloc[-6:-5]['Close']),
        "esg": esg, # give default values
        "gs": gs,
        "es": es,
        "ss": ss
    }

    return jsonify(relevant_info)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
