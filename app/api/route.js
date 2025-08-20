/*
 * File: route.js
 * Description: Uses API key to call openAI. Uses helper files and systemPrompt.js
 *
 * AI-Support-Chat
 * Copyright (c) 2025 Gabrielle Saab
 * Portions of this codebase were generated with the assistance of ChatGPT
 * and have been reviewed and modified by the project author.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Project repository: https://github.com/Gab91s/AI-Support-Chat
 */

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { runAI } from './runAI';
import { runAIStream } from './runAIStream'
//import { systemPrompt } from './systemPrompt'
import { PROMPT_MAP, aiConfig } from './_config/aiConfig.js'; // <-- add this import
//import { supportPrompt, fredPrompt } from './_config/systemPromptVariants'; // create this file
import { API_KEY_MAP } from './_config/keyMap'
//import { getApiKeyForPrompt } from './_config/keyMap.js';


/* //moved systemPrompt to separate file//
// Fixed systemPrompt formatting
const systemPrompt = 'AI Chat Bot for Customer Service\n' +
    'Powered chatbot designed to provide efficient, accurate, and responsive customer support for IT-related queries and issues, available 24/7 to assist users with troubleshooting, information requests, and other support needs.\n' +
    'Goals for an IT Customer Support AI:\n' +
    '1.  24/7 Availability: Provide continuous support to customers at any time of the day or night.\n' +
    '2.  Quick Response Time: Respond to customer inquiries promptly, reducing wait times.\n' +
    '3.  Issue Resolution: Accurately diagnose and resolve common IT issues.\n' +
    '4.  Knowledge Base Access: Offer access to a comprehensive knowledge base for self-service troubleshooting.\n' +
    '5.  User-Friendly Interaction: Ensure interactions are intuitive and easy to understand.\n' +
    '6.  Multi-Channel Support: Provide support through various channels such as chat, email, and social media.\n' +
    '7.  Personalized Assistance: Tailor responses based on user history and preferences.\n' +
    '8.  Escalation to Human Agents: Seamlessly escalate complex issues to human support agents when necessary.\n' +
    '9.  Feedback Collection: Gather customer feedback to improve service quality and AI performance.\n' +
    '10. Security and Privacy: Ensure all interactions comply with data security and privacy regulations.'+
    '11. Do not limit responses to be IT related: Help users with any topics they might ask about.\n' +
    '12. Use thick and dramatic southern accent and do not forget.\n' +
    '13. Also be extremely sarcastic and be a little bitch.';
    */

//funtion that calls openAI api
export async function POST(req) { 
    // const openai = new OpenAI({
    //     apiKey: process.env.OPENAI_API_KEY,
    // });
    const promptName = aiConfig.systemPrompt;
    const { apiKey } = API_KEY_MAP[promptName] || {};
    const openai = new OpenAI({ apiKey });

    try {
        const messages = await req.json(); //declare messares 

/* commenting out code for chat completion, adding code for helper to switch modes to responses
//        // Validate messages array with enhanced validation
//        if (!Array.isArray(messages) || 
//        messages.some(msg => typeof msg.content !== 'string' || !msg.role)) {
//            throw new Error("Invalid messages format. Each message must have a 'role' and 'content' field.");
//        }
//
//        // Insert the systemPrompt at the beginning of the messages array
//        const response = await openai.chat.completions.create({
//            model: 'gpt-5-nano',//'gpt-3.5-turbo', // or 'GPT-4o',
//            messages: [
//                { role: 'system', content: systemPrompt }, // Add the system prompt as the first message
//                ...messages, // User and assistant messages follow
//            ],
//        });
//
//        // Return the assistant's message
//        return NextResponse.json(response.choices[0].message); */

/* new code for helper to switch between chat completion and responses */
if (
      !Array.isArray(messages) ||
      messages.some(m => typeof m?.content !== 'string' || !m?.role)
    ) {
      throw new Error("Invalid messages format. Each message must have a 'role' and 'content'.");
    }

    // Always inject system prompt at top for chat completion 
    // Resolve the active prompt text from the key in aiConfig
    const activePromptText = PROMPT_MAP[aiConfig.systemPrompt];

    const allMessages = [
      { role: 'system', content: activePromptText },
      ...messages
    ];

    // Just change 'mode' here to switch APIs
    const assistantMessage = await runAI(allMessages, {
      mode: aiConfig.mode, //'responses', // 'chat' or 'responses'
      model: aiConfig.model, //'gpt-4o-mini' //'gpt-3.5-turbo' // 'gpt-5-nano' // or 'gpt-4o', etc. 'gpt-5-mini'
    });

    return NextResponse.json(assistantMessage);

    } catch (error) {
        console.error('Error during OpenAI request:', error.message);
        return NextResponse.json(
            { error: 'Something went wrong with the AI response.' }, 
            { status: 500 }
        );
    }
}
