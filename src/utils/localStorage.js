/**
 * Utility functions for localStorage operations
 * Handles secure storage of API keys and user settings
 */

const STORAGE_KEYS = {
    GEMINI_API_KEY: 'davinci_gemini_api_key',
    USER_SETTINGS: 'davinci_user_settings'
};

/**
 * Save Gemini API key to localStorage
 * @param {string} apiKey - The Gemini API key
 * @returns {boolean} Success status
 */
export const saveApiKey = (apiKey) => {
    try {
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('Invalid API key');
        }
        localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
        return true;
    } catch (error) {
        console.error('Error saving API key:', error);
        return false;
    }
};

/**
 * Retrieve Gemini API key from localStorage or environment
 * @returns {string|null} The API key or null if not found
 */
export const getApiKey = () => {
    try {
        // First check localStorage
        const storedKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
        if (storedKey) {
            return storedKey;
        }

        return null;
    } catch (error) {
        console.error('Error retrieving API key:', error);
        return null;
    }
};

/**
 * Clear Gemini API key from localStorage
 * @returns {boolean} Success status
 */
export const clearApiKey = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing API key:', error);
        return false;
    }
};

/**
 * Check if an API key exists
 * @returns {boolean} True if API key exists
 */
export const hasApiKey = () => {
    return getApiKey() !== null;
};

/**
 * Save user settings to localStorage
 * @param {Object} settings - User settings object
 * @returns {boolean} Success status
 */
export const saveSettings = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
};

/**
 * Retrieve user settings from localStorage
 * @returns {Object|null} User settings or null
 */
export const getSettings = () => {
    try {
        const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
        return settings ? JSON.parse(settings) : null;
    } catch (error) {
        console.error('Error retrieving settings:', error);
        return null;
    }
};

/**
 * Clear all application data from localStorage
 * @returns {boolean} Success status
 */
export const clearAllData = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
};
