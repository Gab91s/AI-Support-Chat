/*
 * AI-Support-Chat | Copyright (c) 2025 Gabrielle Saab
 * Licensed under Apache License 2.0 | http://www.apache.org/licenses/LICENSE-2.0
 * Portions generated with ChatGPT, reviewed/modified by the author.
 */

// Maps prompt names to specific API keys and optional greetings
export const API_KEY_MAP = {
  supportPrompt: {
    apiKey: process.env.OPENAI_API_KEY,
    //greeting: "How are you?",
  },
  fredPrompt: {
    apiKey: process.env.FRED_API_KEY,
    //greeting: "Bonjour. What subject shall we explore today?",
  },
  beautyPrompt: {
    apiKey: process.env.BEAUTY_API_KEY,
    //greeting: "Hi there, gorgeous! 🌸 What can I help you with?",
  },
  chiroPrompt: {
    apiKey: process.env.CHIRO_API_KEY,
    //greeting: "Hello! I\'m here to help you learn about chiropractic care.",
  },
};

// Optional: Default fallback
export const getApiKeyForPrompt = (promptKey) =>
  API_KEY_MAP[promptKey] || process.env.BEAUTY_API_KEY;