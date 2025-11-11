#!/bin/bash

echo "🚀 Setting up SMS Integration for ElevenLabs Voice Agent"
echo "========================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing Twilio and dependencies..."
pip install twilio python-dotenv

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cat > .env << 'EOF'
# Database
DATABASE_URL=sqlite:///./voice_ai_healthcare.db

# CORS Origins
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# ElevenLabs Configuration
ELEVENLABS_API_KEY=sk_3000e356cd710bce36e9fae1454ea9429e38f2bcf63d8e90
EOF
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please update .env with your Twilio credentials:"
    echo "   - TWILIO_ACCOUNT_SID"
    echo "   - TWILIO_AUTH_TOKEN"
    echo "   - TWILIO_PHONE_NUMBER"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Check if ngrok is installed
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok is installed"
else
    echo "⚠️  ngrok not found. You'll need it to expose your local server."
    echo "   Download from: https://ngrok.com/download"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Update backend/.env with your Twilio credentials"
echo "2. Start the backend server: python -m uvicorn app.main:app --reload"
echo "3. In another terminal, expose with ngrok: ngrok http 8000"
echo "4. Copy the ngrok HTTPS URL"
echo "5. Configure ElevenLabs Server Tools with the webhook URLs"
echo "6. Update your agent's system prompt"
echo ""
echo "📖 See ELEVENLABS_SMS_SETUP_GUIDE.md for detailed instructions"
echo ""
echo "✅ Setup complete!"
