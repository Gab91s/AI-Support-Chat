/*
 * File: _config/route.js
 * Description: This file reads updates from the front end to send updates
 * to the _config/aiConfig.js file
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
import { aiConfig, ALLOWED } from '../_config/aiConfig';

// GET: always fresh, includes allowed lists
export async function GET() {
  return NextResponse.json(
    { config: aiConfig, allowed: ALLOWED },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

// POST: validate + update, then return latest state AND allowed lists
export async function POST(req) {
  try {
    const body = await req.json();

    if (body.mode !== undefined) {
      if (!ALLOWED.modes.includes(body.mode)) {
        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
      }
      aiConfig.mode = body.mode;
    }

    if (body.model !== undefined) {
      if (!ALLOWED.models.includes(body.model)) {
        return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
      }
      aiConfig.model = body.model;
    }

    if (body.systemPrompt !== undefined) {
      if (!ALLOWED.prompts.includes(body.systemPrompt)) {
        return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
      }
      aiConfig.systemPrompt = body.systemPrompt;
    }

    return NextResponse.json(
      { config: aiConfig, allowed: ALLOWED },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
