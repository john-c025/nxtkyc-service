import { BotRules } from '../utils/precontext';

const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;




interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

export async function getGeminiResponse(requestData: { description: string }) {
  // Parse the description JSON if needed
  let promptText = '';
  try {
    const descObj = JSON.parse(requestData.description);
    promptText = descObj.details || descObj.text || requestData.description;
  } catch {
    promptText = requestData.description;
  }

  const body: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: 'Turn into proper text the json:' + promptText,
          },
        ],
      },
    ],
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Gemini API');
  }

  const data = await response.json();
  // Adjust this based on the actual Gemini API response structure
  return data;
}