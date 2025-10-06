# REST API - Data Processing & Categorization

A Node.js REST API that processes mixed data arrays and categorizes items into numbers (even/odd), alphabets, and special characters with various data transformations.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoint

**Route:** `POST /bfhl`  
**Status Code:** `200` (on success)

### Request Format
```json
{
  "data": ["a", "1", "334", "4", "R", "$"]
}
```

### Response Format
```json
{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

## Test Examples

### Example A
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["a","1","334","4","R", "$"]}'
```

**Expected Response:**
```json
{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

### Example B
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["2","a", "y", "4", "&", "-", "*", "5","92","b"]}'
```

**Expected Response:**
```json
{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": ["5"],
  "even_numbers": ["2", "4", "92"],
  "alphabets": ["A", "Y", "B"],
  "special_characters": ["&", "-", "*"],
  "sum": "103",
  "concat_string": "ByA"
}
```

### Example C
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A","ABcD","DOE"]}'
```

**Expected Response:**
```json
{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": [],
  "even_numbers": [],
  "alphabets": ["A", "ABCD", "DOE"],
  "special_characters": [],
  "sum": "0",
  "concat_string": "EoDdCbAa"
}
```

## Configuration

Before deploying, update the following constants in `index.js`:

```javascript
const FULL_NAME = 'your_name';        // Use your name in lowercase with underscores
const DOB_DDMMYYYY = '17091999';      // Your DOB in ddmmyyyy format
const EMAIL = 'your@email.com';       // Your email
const ROLL_NUMBER = 'YOUR_ROLL';      // Your roll number
```

## Logic Explanation

### Data Classification
- **Numbers:** Items matching `^-?\d+$` (integers only)
  - Classified as even or odd
  - Returned as strings in arrays
  - Summed numerically, result returned as string

- **Alphabets:** Items matching `^[A-Za-z]+$` (only letters)
  - Converted to uppercase in response
  - Original characters used for concat_string

- **Special Characters:** Everything else

### concat_string Algorithm
1. Extract all characters from alphabet-only elements (preserve original order and case)
2. Reverse the entire character sequence
3. Apply alternating case: UPPERCASE at index 0, lowercase at index 1, UPPERCASE at index 2, etc.

### Example for concat_string
Input: `["A", "ABcD", "DOE"]`
- Flattened chars: `['A', 'A', 'B', 'c', 'D', 'D', 'O', 'E']`
- Reversed: `['E', 'O', 'D', 'D', 'c', 'B', 'A', 'A']`
- Alternating caps: `"EoDdCbAa"`

## Error Handling

- Returns `400` if `data` is not an array
- Returns `500` on unexpected server errors
- All errors include `is_success: false`

