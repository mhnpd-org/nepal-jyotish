// Cloudflare Worker script for Nepal Jyotish Contact Form
// This worker receives form submissions and writes them to Google Sheets

interface ContactFormData {
  timestamp: string;
  name: string;
  email: string;
  description: string;
  source: string;
  userAgent: string;
  ip: string;
}

interface Environment {
  GOOGLE_SHEETS_WEBHOOK_URL: string;
}

const worker = {
  async fetch(request: Request, env: Environment): Promise<Response> {
    // Handle CORS for browser requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // Parse the request body
      const formData: ContactFormData = await request.json();

      // Validate required fields
      if (!formData.name || !formData.email || !formData.description) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Get client IP address from Cloudflare headers
      const clientIP = request.headers.get('CF-Connecting-IP') || 
                       request.headers.get('X-Forwarded-For') || 
                       request.headers.get('X-Real-IP') || 
                       'Unknown';

      // Get Google Sheets webhook URL from environment variables
      const googleSheetsWebhookUrl = env.GOOGLE_SHEETS_WEBHOOK_URL;
      
      if (!googleSheetsWebhookUrl) {
        console.error('GOOGLE_SHEETS_WEBHOOK_URL environment variable is not set');
        return new Response(JSON.stringify({ error: 'Configuration error' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Prepare data for Google Sheets
      const sheetsData = {
        timestamp: formData.timestamp,
        name: formData.name,
        email: formData.email,
        description: formData.description,
        source: formData.source || 'Unknown',
        userAgent: formData.userAgent || 'Unknown',
        ip: clientIP,
      };

      // Send data to Google Sheets via webhook
      const sheetsResponse = await fetch(googleSheetsWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetsData),
      });

      if (!sheetsResponse.ok) {
        console.error('Failed to write to Google Sheets:', {
          status: sheetsResponse.status,
          statusText: sheetsResponse.statusText,
          body: await sheetsResponse.text(),
        });

        return new Response(JSON.stringify({ error: 'Failed to save data' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Success response
      return new Response(JSON.stringify({ 
        message: 'Contact form submitted successfully',
        success: true 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Contact form processing error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

export default worker;