# Resume Matcher

An AI-powered resume analysis and job matching application that helps you understand how well your resume matches specific job descriptions.

## Features

- **PDF Resume Upload**: Drag and drop or click to upload your resume
- **AI-Powered Analysis**: Uses advanced NLP to extract and analyze resume content
- **Job Description Matching**: Compare your resume against any job description
- **Detailed Scoring**: Get scores for skills, experience, and education matches
- **Improvement Suggestions**: Receive personalized suggestions to improve your resume
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Project Structure

```
Resume Matcher/
├── Backend/
│   ├── app.py              # Flask API server
│   ├── model.py            # AI model for similarity scoring
│   ├── resume_parser.py    # PDF parsing and text extraction
│   ├── suggestions.py      # Improvement suggestions generator
│   └── utils/
│       ├── extract_keyword.py  # Keyword extraction from job descriptions
│       └── text_extractor.py   # PDF text extraction utilities
├── index.html              # Main frontend page
├── styles.css              # Frontend styling
├── script.js               # Frontend JavaScript functionality
└── README.md               # This file
```

## Setup Instructions

### Backend Setup

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install flask flask-cors sentence-transformers spacy keybert PyMuPDF torch
   ```

3. **Download spaCy model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Start the Flask server:**
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Open the frontend files:**
   - Simply open `index.html` in your web browser
   - Or serve it using a local server for better development experience

2. **Using Python's built-in server:**
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## How to Use

1. **Upload Your Resume:**
   - Click the upload area or drag and drop your PDF resume
   - Maximum file size: 16MB

2. **Enter Job Description:**
   - Paste the job description you want to match against
   - The more detailed the description, the better the analysis

3. **Analyze:**
   - Click "Analyze Resume" to start the analysis
   - Wait for the AI to process your resume

4. **Review Results:**
   - **Overall Score**: Your total match percentage
   - **Detailed Scores**: Breakdown by skills, experience, and education
   - **Suggestions**: Personalized improvement recommendations
   - **Extracted Information**: View what the AI found in your resume

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /upload-and-match` - Upload resume and match against job description

## Technical Details

### Backend Technologies
- **Flask**: Web framework for the API
- **Sentence Transformers**: AI model for semantic similarity
- **spaCy**: Natural language processing for text extraction
- **PyMuPDF**: PDF text extraction
- **KeyBERT**: Keyword extraction from job descriptions

### Frontend Technologies
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Interactive functionality
- **Font Awesome**: Icons
- **Google Fonts**: Typography

### AI Model
- Uses `all-MiniLM-L6-v2` for semantic similarity scoring
- Weighted scoring system:
  - Skills: 53%
  - Experience: 42%
  - Education: 5%

## Troubleshooting

### Common Issues

1. **Backend not running:**
   - Make sure you're in the Backend directory
   - Check that all dependencies are installed
   - Verify the server is running on port 5000

2. **File upload errors:**
   - Ensure the file is a PDF
   - Check file size (max 16MB)
   - Try refreshing the page

3. **Analysis not working:**
   - Check browser console for errors
   - Verify backend is accessible
   - Ensure job description is provided

### Dependencies Issues

If you encounter issues with dependencies:

```bash
# Create a virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Enhancing the AI model

## License

This project is open source and available under the MIT License. 