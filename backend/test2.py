from utils import analyze_with_gemini
try:
    print(analyze_with_gemini("Software Engineer", "John is a great engineer."))
except Exception as e:
    print("FATAL ERROR", e)
