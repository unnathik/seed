from flask import Flask, request, jsonify
import yfinance as yf
import requests
import pandas as pd
from bs4 import BeautifulSoup

app = Flask(__name__)


@app.route('/stock', methods=['GET'])
def get_stock_info():
    # Get ticker symbol from query parameter
    ticker_symbol = request.args.get('ticker', '').upper()


# Parse the HTML content of the page
    
    # Fetch stock information using yfinance
    stock = yf.Ticker(ticker_symbol)
    # Attempt to fetch stock info; if unavailable, return an error message
    try:
        stock_info = stock.info
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
            "news": stock.news[0:2]
        }

        return jsonify(relevant_info)
    except ValueError:
        return jsonify({"error": "Stock information not found for the provided ticker symbol."}), 404

if __name__ == '__main__':
    app.run(debug=True)
