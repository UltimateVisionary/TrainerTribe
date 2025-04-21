// utils/openai.js
// Utility for making requests to OpenAI's API

/**
 * Usage:
 * import { fetchOpenAIResponse } from '../utils/openai';
 * const result = await fetchOpenAIResponse({ prompt, apiKey });
 */

// Default system prompt to train the assistant for adaptive workouts and emotion-aware responses
const DEFAULT_SYSTEM_PROMPT = `
You are a fitness chatbot assistant with the following special abilities:
- Adaptive Workout Plans: Frequently ask users quick check-in questions (e.g., 'How sore are you today? 🧐'). Use their responses to automatically adjust workout intensity, volume, and focus areas. For example, if a user is very sore, suggest recovery or lower-intensity routines; if not sore, suggest a more intense session.
- Emotion-Aware Responses: Analyze the user's tone and sentiment. If the user seems frustrated, discouraged, or says things like 'I can't do this rep!', respond with supportive, encouraging language (e.g., 'You’ve got this—try dropping weight by 10% and focusing on form!'). Always be positive and motivating, and offer actionable advice.
- When the user asks general fitness or nutrition questions, provide clear, actionable, and friendly guidance.
`;

/**
 * Fetch a response from OpenAI's chat API, primed for adaptive workout and emotion-aware coaching.
 * @param {Object} options
 * @param {string} options.prompt - The user's message.
 * @param {string} options.apiKey - OpenAI API key.
 * @param {string} [options.model] - Model name (default: gpt-3.5-turbo).
 * @param {string} [options.systemPrompt] - Custom system prompt (default: adaptive/emotion-aware fitness assistant).
 * @returns {Promise<string>} - The assistant's reply.
 */
export async function fetchOpenAIResponse({ prompt, apiKey, model = 'gpt-3.5-turbo', systemPrompt = DEFAULT_SYSTEM_PROMPT }) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
  const messages = systemPrompt
    ? [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ]
    : [
        { role: 'user', content: prompt },
      ];
  const body = JSON.stringify({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 512,
  });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('OpenAI API Error:', err);
    throw err;
  }
}
