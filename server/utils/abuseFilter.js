// List of abusive words to filter
// This should be more comprehensive in a production environment
const abusiveWords = [
    'badword1', 'badword2', 'offensive', 'inappropriate', 'insult'
    // Add more words as needed
  ];
  
  /**
   
  Checks if a message contains abusive language
  @param {string} message - The message to check
  @returns {boolean} - True if abusive content is detected, false otherwise*/
  const containsAbusiveContent = (message) => {
    if (!message || typeof message !== 'string') return false;
  
    const lowerCaseMessage = message.toLowerCase();
  
    // Check if any abusive word is in the message
    return abusiveWords.some(word => 
      lowerCaseMessage.includes(word.toLowerCase())
    );
  };
  
  module.exports = { containsAbusiveContent };