from fastapi import FastAPI

# Create a minimal FastAPI app for testing
app = FastAPI(title="Voice AI Healthcare - Test")

@app.get("/")
def root():
    return {"message": "FastAPI on Vercel is working!", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy", "platform": "vercel"}

# Vercel automatically detects FastAPI as ASGI application
