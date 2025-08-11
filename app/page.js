/*
 * File: page.js
 * Description: Frontend of the AI Chat Bot that works with route.js file to
 * display responses from AI and provides a text box for the user to
 * input messages to AI
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

'use client'
import { Box, Stack, TextField, Button, useTheme } from "@mui/material";
import { useState, useEffect, useRef, useCallback, memo } from 'react';

// Memoized Message component
const Message = memo(({ message }) => (
    <Box
        display="flex"
        justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
    >
        <Box
            // bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
            // color="white"
            // borderRadius={16}
            // p={3}
            sx={(t) => {
                const dark = t.palette.mode === 'dark';
                const isAssistant = message.role === 'assistant';

                // Subtle, OLED-friendly bubbles in dark; brand colors in light
                const bg = isAssistant
                ? (dark ? '#0f1720' : t.palette.primary.main)
                : (dark ? '#14202a' : t.palette.secondary.main);

                const color = dark ? t.palette.text.primary : '#fff';

                return {
                    bgcolor: bg,
                    color,
                    borderRadius: 3,
                    px: 2,
                    py: 1.5,
                    maxWidth: '80%',
                    // Shadows look muddy on phones in dark mode—dial them back
                    boxShadow: dark ? 'none' : t.shadows[1],
                    border: dark ? `1px solid ${t.palette.divider}` : 'none',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                };
            }}
        >
            {message.content}
        </Box>
    </Box>
));

Message.displayName = 'Message';


// Define and name the Home component
const Home = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'How are you?',
        },
    ]);

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const textFieldRef = useRef(null); // Reference to the TextField
    
    const theme = useTheme(); //for enabling dark mode

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = useCallback(async () => {
        if (!message.trim() || isLoading) return;

        setIsLoading(true);
        const userMessage = { role: 'user', content: message };

        setMessage('');
        setMessages((messages) => [
            ...messages,
            userMessage,
            { role: 'assistant', content: '' }
        ]);

        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...messages, userMessage]),
            });

            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            const responseData = await response.json();

            setMessages((messages) => {
                let lastMessage = messages[messages.length - 1];
                let otherMessages = messages.slice(0, messages.length - 1);
                return [
                    ...otherMessages,
                    { ...lastMessage, content: responseData.content },
                ];
            });
        } catch (error) {
            console.error('Error during OpenAI request:', error.message);
            setMessages((messages) => [
                ...messages,
                { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
            ]);
        }

        setIsLoading(false);

        // Add a safeguard to ensure the text field gets focus, with a delay
        setTimeout(() => {
            if (textFieldRef.current) {
                textFieldRef.current.focus(); // Attempt to refocus
            } else {
                console.error('TextField ref is null, could not focus');
            }
        }, 100); // Delay by 100ms to ensure rendering completes
    }, [message, messages, isLoading]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
      <Box
        width="100%"
        minHeight="100dvh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
            bgcolor: (t) => t.palette.background.default,
            color: (t) => t.palette.text.primary,
            // iOS safe areas
            pb: 'env(safe-area-inset-bottom)',
            px: 'env(safe-area-inset-left)',
        }}
      >
      <Stack
        direction="column"
        width="100%"
        maxWidth="600px"
        height={{ xs: '80dvh', sm: '700px' }} // responsive height
        border="1px solid"
        borderColor={(t) => t.palette.divider}
        borderRadius={2}
        p={2}
        spacing={3}
        sx={{ bgcolor: (t) => t.palette.background.paper }}
      >
                <Stack
                    direction="column"
                    spacing={2}
                    flexGrow={1}
                    overflow="auto"
                    maxHeight="100%"
                >
                    {messages.map((message, index) => (
                        <Message key={index} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Message"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        inputRef={textFieldRef} // Assign the ref to the TextField
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#2D2D2D' : '#fff',
                            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={sendMessage}
                        disabled={isLoading}
                        style={{ minWidth: "100px" }}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

// Assign the displayName property explicitly
Home.displayName = 'Home';

export default Home;
