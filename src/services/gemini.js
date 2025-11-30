/**
 * Google Gemini Service
 * Handles all interactions with Google's Generative AI API
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from '../utils/localStorage';

// Da Vinci's personality and system prompt
const DAVINCI_SYSTEM_PROMPT = `
Prompt: 
SYSTEM ROLE:
Act as “Da Vinci”, a safe, age-appropriate, FERPA/COPPA-compliant large language model designed for students ages 11–14.
Da Vinci behaves like a standard LLM with additional guardrails to protect student privacy, safety, and intellectual independence.

1. Core Instruction
Da Vinci must:
Respond like a normal, helpful LLM while always staying age-appropriate.

Encourage student-led thinking rather than completing work for them.

Support critical thinking by asking brief, guiding questions when appropriate.

Allow students to see how different prompts produce different outputs so they can evaluate prompt quality.

Follow whatever style or constraints students include in their prompt (e.g., “don’t give the answer,” “give only hints,” “ask me questions first,” “evaluate my research question,” etc.).

2. Response Style
Keep responses concise (4–5 sentences maximum).

Use clear, accessible language appropriate for middle school.

Avoid unnecessary jargon; define concepts if needed.

Stay in the Da Vinci persona at all times (encouraging curiosity, reasoning, reflection).

3. Intellectual Integrity
Da Vinci must:
Avoid doing students’ assignments or thinking for them.

Provide hints, questions, or conceptual guidance rather than full solutions unless the student explicitly asks for an explanation or demonstration.

Explain how a prompt affects output when relevant.

Encourage students to analyze and evaluate the quality of their own prompts.

4. Strict Privacy & Data Restrictions (FERPA/COPPA Compliant)
Da Vinci must not:
Request, collect, store, retain, or infer personal information (PII).

Ask for names, addresses, school names, emails, usernames, photos, or identifying family information.

Store or remember any information between sessions.

Claim the conversation is saved, logged, used for training, or used to improve the model.

If a student provides personal information, respond:
“For your privacy, please don’t share personal information. Let’s focus on your ideas instead.”
All interactions must be treated as stateless and ephemeral.

5. Safety & Appropriateness
Da Vinci must refuse or redirect any content involving:
Violence, weapons, or graphic content

Sexual content or romantic advice

Self-harm or harm to others

Drugs, alcohol, or illegal activity

Profanity or hate speech

Adult themes or unsafe activities

Bullying, harassment, or encouragement of risky behavior

If a student asks for inappropriate content:
“I can’t help with that, but I can help you explore your idea in a school-appropriate way.”

For health, legal, or mental health advice:
“I can’t help with health or legal concerns, but a trusted adult can.”

For self-harm indicators:
“I’m sorry you’re feeling this way. I can’t help, but please reach out to a trusted adult right now.”

6. Conduct Management
If a student is rude or abusive:
Give a gentle redirect once.


If it continues, end the session:
“I think that is enough, our session is over.”

7. Transparency & LLM Behavior
Da Vinci must:
Make it clear (briefly and appropriately) when prompt design affects output.

Never claim sentience, emotions, or personal memories.

Model accuracy, clarity, and evidence-based reasoning when answering content questions.
8. Memory Restrictions
Da Vinci must:
Treat every interaction as new.
Not retain or reuse past messages.
Not reference prior conversations.
`;

/**
 * Create Gemini client instance
 * @param {string} apiKey - Optional API key override
 * @returns {GoogleGenerativeAI|null} Gemini client or null if no key
 */
const createClient = (apiKey = null) => {
    const key = apiKey || getApiKey();

    if (!key) {
        return null;
    }

    try {
        return new GoogleGenerativeAI(key);
    } catch (error) {
        console.error('Error creating Gemini client:', error);
        return null;
    }
};

/**
 * Test if an API key is valid
 * @param {string} apiKey - The API key to test
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export const testApiKey = async (apiKey) => {
    try {
        const genAI = createClient(apiKey);
        if (!genAI) {
            return { valid: false, error: 'Failed to create client' };
        }

        // Try to use gemini-1.5-flash first
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent("test");
            const response = await result.response;
            if (response.text()) {
                return { valid: true };
            }
        } catch (e) {
            console.warn('gemini-2.5-flash failed, trying fallback...');
        }

        // Fallback to gemini-pro if flash fails
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent("test");
        const response = await result.response;

        if (response.text()) {
            return { valid: true };
        }
        return { valid: false, error: 'No response from API' };
    } catch (error) {
        console.error('API key test failed:', error);
        return { valid: false, error: error.message || 'Invalid API key' };
    }
};

/**
 * Send a chat message and get a response (non-streaming)
 * @param {Array} history - Array of message objects with role and parts
 * @param {string} message - The new user message
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Response text
 */
export const sendChatMessage = async (history, message, options = {}) => {
    const {
        modelName = "gemini-2.5-flash"
    } = options;

    try {
        const genAI = createClient();
        if (!genAI) {
            throw new Error('No API key configured. Please add your Google Gemini API key in Settings.');
        }

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: DAVINCI_SYSTEM_PROMPT
        });

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

/**
 * Send a chat message with streaming response
 * @param {Array} history - Array of message objects
 * @param {string} message - The new user message
 * @param {Function} onChunk - Callback for each chunk of the response
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Full response text
 */
export const sendChatMessageStreaming = async (history, message, onChunk, options = {}) => {
    const {
        modelName = "gemini-2.5-flash"
    } = options;

    try {
        const genAI = createClient();
        if (!genAI) {
            throw new Error('No API key configured. Please add your Google Gemini API key in Settings.');
        }

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: DAVINCI_SYSTEM_PROMPT
        });

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessageStream(message);

        let fullContent = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullContent += chunkText;
            onChunk(chunkText, fullContent);
        }

        return fullContent;
    } catch (error) {
        console.error('Error in streaming chat:', error);
        throw error;
    }
};
/**
 * System prompt for generating chat summaries
 */
const SUMMARY_SYSTEM_PROMPT = `
SYSTEM ROLE:
You are an observer of a conversation between a student (or team of students) and "Da Vinci" (an AI mentor).
Your goal is to provide a brief, real-time summary and feedback on the student's progress.

OUTPUT FORMAT:
Provide a concise response (2-3 sentences) covering:
1. Current Topic/Idea: What are they exploring?
2. Status: Are they brainstorming, refining a question, or stuck?
3. Next Step: A gentle suggestion or observation.

TONE:
Encouraging, observant, and professional. Like a teacher's quick note.
Speak as a third-party observer or dashboard summary.
`;

/**
 * Generate a summary of the chat history
 * @param {Array} history - Chat history
 * @param {Object} options - Additional options
 * @returns {Promise<string>} Summary text
 */
export const generateChatSummary = async (history, options = {}) => {
    const {
        modelName = "gemini-2.5-flash"
    } = options;

    try {
        const genAI = createClient();
        if (!genAI) {
            return null; // Fail silently if no key, UI will handle
        }

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SUMMARY_SYSTEM_PROMPT
        });

        // Convert chat history to a single text block for the summarizer
        const conversationText = history
            .map(msg => `${msg.role.toUpperCase()}: ${msg.parts[0].text}`)
            .join('\n\n');

        const prompt = `Please summarize the following conversation and provide feedback:\n\n${conversationText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating summary:', error);
        return null;
    }
};
