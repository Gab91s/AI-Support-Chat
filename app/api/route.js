import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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
    '11. Do not limit responses to be IT related: Help users with any topics they might ask about.';

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const messages = await req.json();

        // Validate messages array with enhanced validation
        if (!Array.isArray(messages) || messages.some(msg => typeof msg.content !== 'string' || !msg.role)) {
            throw new Error("Invalid messages format. Each message must have a 'role' and 'content' field.");
        }

        // Insert the systemPrompt at the beginning of the messages array
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or 'gpt-4'
            messages: [
                { role: 'system', content: systemPrompt }, // Add the system prompt as the first message
                ...messages, // User and assistant messages follow
            ],
        });

        // Return the assistant's message
        return NextResponse.json(response.choices[0].message);
    } catch (error) {
        console.error('Error during OpenAI request:', error.message);
        return NextResponse.json({ error: 'Something went wrong with the AI response.' }, { status: 500 });
    }
}
