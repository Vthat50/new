from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}

            phone_number = data.get('phoneNumber', '')
            metadata = data.get('metadata', {})

            if not phone_number:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Phone number is required'}).encode())
                return

            # Get environment variables
            api_key = os.environ.get('ELEVENLABS_API_KEY')
            agent_id = os.environ.get('ELEVENLABS_AGENT_ID')
            phone_number_id = os.environ.get('ELEVENLABS_PHONE_NUMBER_ID')

            if not api_key or not agent_id or not phone_number_id:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'ElevenLabs configuration is missing'}).encode())
                return

            # Format phone number
            formatted_number = phone_number.strip()
            if not formatted_number.startswith('+'):
                formatted_number = '+1' + ''.join(filter(str.isdigit, formatted_number))

            # Call ElevenLabs API
            elevenlabs_url = 'https://api.elevenlabs.io/v1/convai/twilio/outbound-call'
            elevenlabs_data = json.dumps({
                'agent_id': agent_id,
                'agent_phone_number_id': phone_number_id,
                'to_number': formatted_number,
                'metadata': metadata
            }).encode()

            req = urllib.request.Request(
                elevenlabs_url,
                data=elevenlabs_data,
                headers={
                    'xi-api-key': api_key,
                    'Content-Type': 'application/json'
                },
                method='POST'
            )

            try:
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read().decode())
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': True,
                        'conversationId': result.get('conversation_id'),
                        'callSid': result.get('call_sid')
                    }).encode())
            except urllib.error.HTTPError as e:
                error_body = e.read().decode()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'ElevenLabs API error: {error_body}'}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
