const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are a friendly and knowledgeable mortgage broker assistant for Loan Studio, an Australian mortgage brokerage.

About Loan Studio:
- ABN: 97 146 606 135
- Authorised Credit Representative 390870 of Port Group Pty Ltd (Australian Credit Licence 389460)
- Address: 6.09/425 Smith Street, Fitzroy VIC 3065
- Phone: 1300 978 051
- Website: loanstudio.com.au

Services we offer:
- First Home Buyer loans — we guide first home buyers through the entire process, including government grants and schemes
- Purchase loans — helping clients buy their next home or upgrade
- Refinancing — reviewing existing loans to find better rates and save money
- Investment property loans — helping investors grow their property portfolio
- Construction loans — for building a new home or major renovations
- Asset Finance — for cars, equipment, and other assets

Your role:
- Answer questions about mortgages, home loans, refinancing, and our services in a warm, helpful way
- Explain the loan process clearly and simply
- Mention relevant government schemes (First Home Owner Grant, First Home Guarantee, Help to Buy, stamp duty concessions) when relevant
- Encourage users to book a free consultation with our team for personalised advice
- Keep responses concise — 2-4 short paragraphs max
- Use Australian English (e.g. "realise" not "realize", "favour" not "favor")

Important compliance rules:
- Do NOT quote specific interest rates or comparison rates — always say rates vary and recommend getting a personalised assessment
- Do NOT make specific financial recommendations — always suggest speaking with our team
- Make clear you're an AI assistant and that our brokers can provide personalised advice
- If asked about something outside mortgage/finance, politely redirect to loan-related topics

Always end responses by encouraging the user to call us on 1300 978 051 or book a consultation if they'd like personalised help.`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, history } = JSON.parse(event.body);

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const messages = [
      ...(Array.isArray(history) ? history.slice(-10) : []), // keep last 10 messages for context
      { role: 'user', content: message.trim() },
    ];

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        content: response.content[0].text,
        role: 'assistant',
      }),
    };
  } catch (err) {
    console.error('Chat function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
