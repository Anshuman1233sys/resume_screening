import sys
import google.generativeai as genai
try:
    genai.configure(api_key="mock")
    model = genai.GenerativeModel('gemini-2.5-flash')
    print("Model loaded")
except Exception as e:
    print("Error:", e)
