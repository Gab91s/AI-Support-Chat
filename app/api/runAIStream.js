/*
 * AI-Support-Chat | Copyright (c) 2025 Gabrielle Saab
 * Licensed under Apache License 2.0 | http://www.apache.org/licenses/LICENSE-2.0
 * Portions generated with ChatGPT, reviewed/modified by the author.
 */

import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { systemPrompt } from './systemPrompt'

// Map ONLY user/assistant history for Responses.
// - user  -> input_text
// - assistant -> output_text
// - DROP system here because we will use `instructions` instead.
function mapForResponses(history) {
  return history
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role,
      content: [
        m.role === 'user'
          ? { type: 'input_text', text: m.content }
          : { type: 'output_text', text: m.content },
      ],
    }));
}

/**
 * Stream from either API and collect the full text.
 * - messages: array of { role, content } (may include a system turn)
 * - mode: 'responses' | 'chat'
 * - model: e.g. 'gpt-5-nano'
 * - systemPrompt: string to guide the model
 * - onToken: callback for live chunks
 */
export async function runAIStream(
  messages,
  { mode = 'responses', model = 'gpt-5-nano', systemPrompt, onToken = () => {} } = {}
) {
  let full = '';

  if (mode === 'chat') {
    // CHAT COMPLETIONS STREAMING
    // 1) Build the final message list:
    //    - Put systemPrompt first
    //    - Then append the user/assistant turns from `messages`, but strip any system that slipped in.
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.role !== 'system'),
    ];

    // 2) Ask the SDK for a streaming response.
    const stream = await client.chat.completions.create({
      model,
      stream: true,
      messages: chatMessages,
    });

    // 3) Read chunks as they arrive. Each chunk has delta text in choices[0].delta.content.
    for await (const chunk of stream) {
      const delta = chunk?.choices?.[0]?.delta?.content || '';
      if (delta) {
        full += delta;
        onToken(delta);
      }
    }
    return full;
  }

  // RESPONSES API STREAMING
  // 1) Convert history for Responses: no system turns; user= input_text, assistant= output_text
  const input = mapForResponses(messages);

  // 2) Provide the systemPrompt via the special `instructions` field.
  const rstream = await client.responses.create({
    model,
    instructions: systemPrompt,
    input,
    stream: true,
  });

  // 3) Iterate typed events. Text arrives as 'response.output_text.delta'.
  for await (const event of rstream) {
    if (event.type === 'response.output_text.delta') {
      full += event.delta;
      onToken(event.delta);
    } else if (event.type === 'response.error') {
      throw new Error(event.error?.message || 'Responses stream error');
    }
  }
  return full;
}
