'use client'
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef, useCallback, memo } from 'react';

// Memoized Message component
const Message = memo(({ message }) => (
    <Box
        display="flex"
        justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
    >
        <Box
            bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
            color="white"
            borderRadius={16}
            p={3}
        >
            {message.content}
        </Box>
    </Box>
));

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
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                direction="column"
                width="100%" /* Responsive width */
                maxWidth="600px" /* Max width on larger screens */
                height="700px"
                border="1px solid black"
                p={2}
                spacing={3}
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
