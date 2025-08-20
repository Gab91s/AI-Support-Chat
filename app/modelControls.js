/*
 * File: modelControls.js
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

'use client';

import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Stack, Typography, Avatar,
  ToggleButton, ToggleButtonGroup,
  Switch, FormControlLabel,
  FormControl, InputLabel, Select, MenuItem,
  Chip, Alert, Skeleton
} from '@mui/material';

const MODE_LABELS = { responses: 'Responses Mode', chat: 'Chat Mode' };
const MODEL_LABELS = {
  'gpt-4o-mini': '4o Mini (Balanced)',
  'gpt-5-mini': '5 Mini (Newest)',
  'gpt-5-nano': '5 Nano (Tiny)',
  'gpt-3.5-turbo-0125': '3.5 Turbo (Legacy)',
};
const PROMPT_LABELS = { supportPrompt: 'support', fredPrompt: 'Fred', beautyPrompt: 'Beauty' };

function PersonalityToggle({ value, onChange, allowedPrompts = [] }) {
  const options = allowedPrompts.filter(p => p === 'supportPrompt' || p === 'fredPrompt' || p === 'beautyPrompt');
  if (!options.length) return null;

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">Assistant Persona</Typography>
      <ToggleButtonGroup
        size="large"
        exclusive
        value={value}
        onChange={(_, v) => v && onChange(v)}
        sx={{
          gap: 1,
          '& .MuiToggleButton-root': {
            px: 2, py: 1.25, borderRadius: 3, textTransform: 'none',
            border: '1px solid', borderColor: 'divider',
            '&.Mui-selected': { boxShadow: 2 },
          },
        }}
      >
        {options.includes('supportPrompt') && (
          <ToggleButton value="supportPrompt">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar>IT Support</Avatar>
              <Box textAlign="left">
                <Typography fontWeight={700}>IT Support</Typography>
                <Typography variant="caption" color="text.secondary">
                  Witty • High‑energy
                </Typography>
              </Box>
            </Stack>
          </ToggleButton>
        )}
        {options.includes('fredPrompt') && (
          <ToggleButton value="fredPrompt">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar>F</Avatar>
              <Box textAlign="left">
                <Typography fontWeight={700}>Fred</Typography>
                <Typography variant="caption" color="text.secondary">
                  Calm • Straightforward
                </Typography>
              </Box>
            </Stack>
          </ToggleButton>
        )}
        {options.includes('beautyPrompt') && (
          <ToggleButton value="beautyPrompt">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar>Beauty</Avatar>
              <Box textAlign="left">
                <Typography fontWeight={700}>Beauty Subscription Customer Service</Typography>
                <Typography variant="caption" color="text.secondary">
                  Friendly • Helpful
                </Typography>
              </Box>
            </Stack>
          </ToggleButton>
        )}  
      </ToggleButtonGroup>
    </Box>
  );
}

export default function ModelControls() {
  const [mode, setMode] = useState('responses');
  const [model, setModel] = useState('gpt-4o-mini');
  const [systemPrompt, setSystemPrompt] = useState('beautyPrompt');
  const [allowed, setAllowed] = useState({ modes: [], models: [], prompts: [] });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch config (with error handling)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error(`GET /api/config ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setMode(data.config.mode);
        setModel(data.config.model);
        setSystemPrompt(data.config.systemPrompt);
        setAllowed(data.allowed || { modes: [], models: [], prompts: [] });
      } catch (e) {
        console.error(e);
        if (mounted) setError('Could not load config. Is /api/config set up?');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const updateConfig = async (patch) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(`POST /api/config ${res.status}`);
      const data = await res.json();
      setMode(data.config.mode);
      setModel(data.config.model);
      setSystemPrompt(data.config.systemPrompt);
      setError('');
    } catch (e) {
      console.error(e);
      setError('Failed to update config.');
    }
  };

  return (
    <Card elevation={2} sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          {error && <Alert severity="warning">{error}</Alert>}

          {/* Skeleton while loading */}
          {loading ? (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={56} />
              <Skeleton variant="rounded" height={40} />
              <Skeleton variant="text" width={220} />
            </Stack>
          ) : (
            <>
              <PersonalityToggle
                value={systemPrompt}
                onChange={(val) => updateConfig({ systemPrompt: val })}
                allowedPrompts={allowed.prompts}
              />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'responses'}
                      onChange={(e) => updateConfig({ mode: e.target.checked ? 'responses' : 'chat' })}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{MODE_LABELS[mode] || mode}</Typography>
                      <Chip size="small" label={mode === 'responses' ? 'Reasoning' : 'Classic'} />
                    </Stack>
                  }
                />

                <FormControl size="small" sx={{ minWidth: 240 }}>
                  <InputLabel>Model</InputLabel>
                  <Select
                    label="Model"
                    value={model}
                    onChange={(e) => updateConfig({ model: e.target.value })}
                  >
                    {allowed.models.map((m) => (
                      <MenuItem key={m} value={m}>
                        {MODEL_LABELS[m] || m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Active: {PROMPT_LABELS[systemPrompt]} • {MODE_LABELS[mode]} • {MODEL_LABELS[model] || model}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
