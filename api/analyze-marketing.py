from http.server import BaseHTTPRequestHandler
import json
import os
from openai import OpenAI

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))

            website_contents = request_data.get('website_contents', [])
            total_words = request_data.get('total_words', 0)

            # Get OpenAI API key from environment
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'OpenAI API key not configured'
                }).encode())
                return

            # Initialize OpenAI client
            client = OpenAI(api_key=api_key)

            # Define patient barriers
            patient_barriers = [
                {'name': 'Cost & Insurance Support', 'keywords': 'affordability, cost, pricing, insurance, copay, financial assistance, patient assistance programs'},
                {'name': 'Injection Support & Training', 'keywords': 'injection, self-administration, needle anxiety, injection training, how to inject'},
                {'name': 'Side Effects Management', 'keywords': 'side effects, adverse events, safety, tolerability, what to expect'},
                {'name': 'Access & Logistics', 'keywords': 'access, availability, delivery, logistics, pharmacy, specialty pharmacy'},
                {'name': 'Efficacy & Clinical Results', 'keywords': 'efficacy, effectiveness, clinical trials, results, outcomes, benefits'},
                {'name': 'Dosing & Convenience', 'keywords': 'dosing, dosing schedule, convenience, frequency, administration'}
            ]

            # Build the prompt
            prompt = f"""You are analyzing pharmaceutical website content. Determine what percentage of the content focuses on each category below.

CRITICAL INSTRUCTIONS:
1. Read the website content VERY carefully
2. The percentages MUST add up to approximately 100%
3. If a category is not mentioned AT ALL, use 0%
4. Be REALISTIC - don't inflate numbers

CATEGORIES TO ANALYZE:

1. Cost & Insurance Support ({patient_barriers[0]['keywords']})
   - Look for: patient assistance programs, copay cards, financial help, eligibility for assistance, affordability programs, insurance coverage, cost reduction, "cares" programs, application for financial aid
   - If the website is primarily about applying for financial assistance or a patient assistance program, this should be 80-90%

2. Injection Support & Training ({patient_barriers[1]['keywords']})
   - Look for: how to inject, injection techniques, self-administration guides, overcoming fear of needles, injection tutorials

3. Side Effects Management ({patient_barriers[2]['keywords']})
   - Look for: managing side effects, what to expect, adverse events, safety information, dealing with reactions

4. Access & Logistics ({patient_barriers[3]['keywords']})
   - Look for: where to get medication, pharmacy information, delivery, prescription fulfillment

5. Efficacy & Clinical Results ({patient_barriers[4]['keywords']})
   - Look for: how well the drug works, clinical trial data, effectiveness, treatment outcomes, scientific evidence

6. Dosing & Convenience ({patient_barriers[5]['keywords']})
   - Look for: how often to take/inject, dosing schedule, treatment regimen

WEBSITE CONTENT TO ANALYZE:
{chr(10).join(website_contents)}

EXAMPLES:
- If website is a patient assistance program (e.g., "LillyCares", "JanssenCares"), use ~85% Cost Support
- If website is about clinical trials/efficacy, use ~60-70% Efficacy
- If website is an injection training portal, use ~70-80% Injection Support

Return ONLY valid JSON (no other text):
{{
  "topics": [
    {{"name": "Cost & Insurance Support", "percentage": 85}},
    {{"name": "Injection Support & Training", "percentage": 0}},
    {{"name": "Side Effects Management", "percentage": 5}},
    {{"name": "Access & Logistics", "percentage": 10}},
    {{"name": "Efficacy & Clinical Results", "percentage": 0}},
    {{"name": "Dosing & Convenience", "percentage": 0}}
  ],
  "total_words": {total_words}
}}"""

            # Call OpenAI API
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a marketing analyst that helps pharmaceutical companies understand how well their marketing aligns with patient needs. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )

            # Parse response
            response_text = completion.choices[0].message.content
            if not response_text:
                raise Exception("Empty response from OpenAI")

            analysis_data = json.loads(response_text)

            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(analysis_data).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': f'Error analyzing content: {str(e)}'
            }).encode())
