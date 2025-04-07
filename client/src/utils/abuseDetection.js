// List of abusive words to detect
// This is a basic implementation - in production, you might want a more comprehensive list
// or use a third-party content moderation API
const abusiveWords = [
    'badword1', 'badword2', 'offensive', 'inappropriate', 'insult'
    // Add more words as needed
  ];
  
  /**
   
  Checks if a message contains abusive language
  @param {string} message - The message to check
  @returns {boolean} - True if abusive content is detected, false otherwise*/
  export const detectAbusiveContent = (message) => {
    if (!message || typeof message !== 'string') return false;
  
    const lowerCaseMessage = message.toLowerCase();
  
    // Check if any abusive word is in the message
    return abusiveWords.some(word => 
      lowerCaseMessage.includes(word.toLowerCase())
    );
  };    