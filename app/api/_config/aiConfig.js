/*
 * File: ./_config/aiConfig
 * Description: [short description of the file's purpose]
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

import { beautyPrompt, supportPrompt, fredPrompt } from './systemPromptVariants';

export const PROMPT_MAP = {
  supportPrompt, // string content
  fredPrompt,  // string content
  beautyPrompt, // string content
};
// Single in-memory config shared by API routes
export const aiConfig = {
  mode: 'responses',         // 'chat' | 'responses'
  model: 'gpt-4o-mini',      // default matches your current choice
  systemPrompt: 'beautyPrompt',
};

// (Optional) allowlists for basic validation in the API route
export const ALLOWED = {
  modes: ['chat', 'responses'],
  models: ['gpt-3.5-turbo-0125', 'gpt-4o-mini', 'gpt-5-mini', 'gpt-5-nano'],
  prompts: ['supportPrompt', 'fredPrompt', 'beautyPrompt'],
};

// Future option to switch systemPrompts