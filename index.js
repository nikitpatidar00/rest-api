// index.js
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// === Configure these for your submission ===
const FULL_NAME = 'john_doe';          // lowercase, underscore separated
const DOB_DDMMYYYY = '17091999';      // ddmmyyyy format
const USER_ID = `${FULL_NAME}_${DOB_DDMMYYYY}`;
const EMAIL = 'john@xyz.com';
const ROLL_NUMBER = 'ABCD123';
// =========================================

/**
 * Check if string represents an integer (positive or negative)
 */
function isIntegerString(s) {
  return /^-?\d+$/.test(s);
}

/**
 * Check if string contains only alphabetic characters
 */
function isAlphaString(s) {
  return /^[A-Za-z]+$/.test(s);
}

/**
 * POST /bfhl endpoint
 * Processes an array of mixed data and categorizes items
 */
app.post('/bfhl', (req, res) => {
  try {
    const data = req.body && req.body.data;
    
    // Validate input
    if (!Array.isArray(data)) {
      return res.status(400).json({ 
        is_success: false, 
        message: '`data` must be an array' 
      });
    }

    // Initialize result arrays
    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];

    let sumNumeric = 0;
    // For concat_string: flatten characters from ALL alphabet-only elements
    const flattenedAlphabetChars = [];

    // Process each item in the data array
    for (let item of data) {
      // Convert item to string safely
      const str = (item === null || item === undefined) ? '' + item : String(item);
      
      if (isIntegerString(str)) {
        // Process numeric items
        const val = parseInt(str, 10);
        if (val % 2 === 0) {
          even_numbers.push(str); // Keep as string
        } else {
          odd_numbers.push(str); // Keep as string
        }
        sumNumeric += val;
      } else if (isAlphaString(str)) {
        // Process alphabetic items
        alphabets.push(str.toUpperCase()); // Store uppercase version
        // Flatten characters for concat_string (preserve original case)
        for (let ch of str) {
          flattenedAlphabetChars.push(ch);
        }
      } else {
        // Everything else is a special character
        special_characters.push(str);
      }
    }

    // Build concat_string: reverse flattened chars and alternate caps
    const reversedChars = flattenedAlphabetChars.reverse();
    const concatArr = reversedChars.map((ch, idx) => {
      return (idx % 2 === 0) ? ch.toUpperCase() : ch.toLowerCase();
    });
    const concat_string = concatArr.join('');

    // Build response object
    const response = {
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sumNumeric), // Return sum as string
      concat_string
    };

    return res.status(200).json(response);
    
  } catch (err) {
    console.error('Processing error:', err);
    return res.status(500).json({ 
      is_success: false, 
      message: 'internal server error' 
    });
  }
});

// Optional: GET endpoint for testing if service is alive
app.get('/bfhl', (req, res) => {
  res.status(200).json({ 
    operation_code: 1 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 POST endpoint available at: http://localhost:${PORT}/bfhl`);
});
