/*
 * AI-Support-Chat | Copyright (c) 2025 Gabrielle Saab
 * Licensed under Apache License 2.0 | http://www.apache.org/licenses/LICENSE-2.0
 * Portions generated with ChatGPT, reviewed/modified by the author.
 */

//this is a helper

import OpenAI from 'openai';
import { Agent, setGlobalDispatcher } from 'undici'; // for the keepAliveDispatcher
import { systemPrompt } from './systemPrompt'


// keep-alive for faster back-to-back calls
setGlobalDispatcher(new Agent({
  keepAliveTimeout: 10_000,
  keepAliveMaxTimeout: 60_000,
  connections: 100,
}));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


function toResponsesParts(role, content) {
  // Responses wants typed parts:
  // - user/system/developer -> input_text
  // - assistant             -> output_text
  const isAssistant = role === "assistant";
  const partType = isAssistant ? "output_text" : "input_text";

  if (Array.isArray(content)) {
    return content.map(p => {
      if (typeof p === "string") return { type: partType, text: p };
      // Convert any legacy {type:"text"} parts to Responses' types
      if (p && p.type === "text") return { ...p, type: partType };
      // If you already produce typed parts (e.g., input_image), pass through
      return p;
    });
  }
    if (typeof content === "string" || content == null) {
    return [{ type: partType, text: String(content ?? "") }];
  }
  // Fallback: stringify odd shapes
  return [{ type: partType, text: String(content) }];
}

function mapForResponses(messages) {
  // Preserve roles exactly: "system" | "developer" | "user" | "assistant"
  return messages.map(m => ({
    role: m.role,
    content: toResponsesParts(m.role, m.content)
  }));
}

// Optional guard: ensures the first item is a system message
function ensureSystemFirst(input, systemPrompt) {
  if (!input.length || input[0].role !== "system") {
    return [{ role: "system", content: [{ type: "input_text", text: systemPrompt }] }, ...input];
  }
  return input;
}

/* function normalizeContentToParts(content) {
  if (Array.isArray(content)) {
    return content.map(p => (typeof p === "string" ? { type: "text", text: p } : p));
  }
  if (typeof content === "string") return [{ type: "text", text: content }];
  return [{ type: "text", text: String(content ?? "") }];
}

function mapForResponses(messages) {
  return messages.map(m => ({
    role: m.role,
    content: normalizeContentToParts(m.content),
  }));
}
*/

const MODEL_CONFIG = {
  'gpt-3.5-turbo-0125': { maxChat: 256, maxResp: 256, allowTemp: true, background: true},
  'gpt-4o-mini': { maxChat: 384, maxResp: 384, allowTemp: true, background: true },
  'gpt-5-mini': { maxChat: 512, maxResp: 512, allowTemp: false, background: true },   // some 5-series lock temp/top_p
  'gpt-5-nano': { maxChat: 384, maxResp: 384, allowTemp: false, background: true },
};

function cfgFor(model) {
  // fall back to a conservative default
  return MODEL_CONFIG[model] || { maxChat: 256, maxResp: 256, allowTemp: false, background: true };
}

function buildResponsesParams({ model, messages, systemPrompt }) {
    const cfg = cfgFor(model);
    const input = ensureSystemFirst(
    mapForResponses([{ role: "system", content: systemPrompt }, ...messages]),
    systemPrompt
  );

  return {
    model,
    instructions: systemPrompt,      // belt-and-suspenders: models weight this highly
    input,
    max_output_tokens: cfg.maxResp,
    // temperature/top_p often locked on nano -> omit unless verified
    // seed: 1, // if supported
  };
}

function buildChatParams({ model, messages, systemPrompt }) {
    const cfg = cfgFor(model);
    return {
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_completion_tokens: cfg.maxResp,
        // temperature/top_p often locked on nano -> omit unless verified
        // seed: 1, // if supported
    };
}

function withTimeout(ms) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  return { signal: ac.signal, done: () => clearTimeout(t) };
}

/*
// Converts Chat Completions format → Responses format
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
*/



/**
 * Runs either Chat Completions or Responses API and returns
 * a unified message object: { role: 'assistant', content: '...' }
 *
 * @param {Array} messages - Chat-style messages from your frontend
 * @param {Object} options
 * @param {'chat'|'responses'} options.mode - Which API to use
 * @param {string} options.model - Model name to use
 */
export async function runAI(messages, { mode = 'responses', model = 'gpt-5-nano' } = {}) {
  if (mode === 'chat') {
    /*const resp = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      //temperature: 0.2,
      //top_p: 1,
      max_completion_tokens: 1024,
      // seed: 1 // only if supported in your SDK on this path
    }); */
    const params = buildChatParams({ model, messages, systemPrompt });
    console.time('chattime');
    {
    const { signal, done } = withTimeout(15000);
    try {
        const resp = await openai.chat.completions.create(params);
        console.timeEnd('chattime');
        console.log("Resolved model (Chat):", resp.model); // ✅ log model version
        return resp.choices[0].message;
      } finally { done(); }
    }
  } else {
    /*const input = mapForResponses(messages);
    const resp = await openai.responses.create({
      model,
      instructions: systemPrompt,           // ✅ global rules (highest weight)
      input,                                // ✅ full history with explicit system as 1st item
      //temperature: 0.2,
      //top_p: 1,
      max_output_tokens: 1024,
      // Optional: seed for reproducibility across endpoints
      // seed: 1
    });*/
    const params = buildResponsesParams({ model, messages, systemPrompt });
    console.time('responsestime');
    {
    const { signal, done } = withTimeout(15000);
    try {
        const resp = await openai.responses.create(params);
        console.timeEnd('responsestime');
        console.log("Resolved model (Responses):", resp.model); // ✅ log model version
        return { role: 'assistant', content: resp.output_text ?? '' };
    } finally { done(); }
  }
  }
}
