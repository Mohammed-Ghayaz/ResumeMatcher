from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import tempfile
from werkzeug.utils import secure_filename
import logging

from model import model, get_resume_score
from resume_parser import parse_resume
from suggestions import suggestion

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Serve frontend static files
@app.route('/')
def serve_index():
    return send_from_directory(os.path.dirname(__file__), 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.dirname(__file__), path)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'Resume Matcher API is running'
    }), 200

@app.route('/upload-and-match', methods=['POST'])
def upload_and_match():
    """Upload a resume PDF and match it against a job description in one request."""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'error': 'No file provided',
                'message': 'Please upload a PDF file'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'error': 'No file selected',
                'message': 'Please select a PDF file to upload'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'Invalid file type',
                'message': 'Only PDF files are allowed'
            }), 400
        
        # Get job description from form data
        job_description = request.form.get('job_description', '')
        if not job_description:
            return jsonify({
                'error': 'No job description provided',
                'message': 'Please provide a job description'
            }), 400
        
        # Save file temporarily
        filename = secure_filename(file.filename or 'uploaded_file.pdf')
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name
        
        try:
            # Parse the resume
            parsed_data = parse_resume(temp_file_path)
            
            # Get matching scores
            scores = get_resume_score(parsed_data, job_description, model)
            
            # Get suggestions for improvement
            resume_skills = parsed_data.get('skills', [])
            if isinstance(resume_skills, str):
                resume_skills = [skill.strip() for skill in resume_skills.split(',')]
            
            improvement_suggestions = suggestion(job_description, resume_skills)
            
            return jsonify({
                'success': True,
                'parsed_data': parsed_data,
                'scores': scores,
                'suggestions': improvement_suggestions,
                'message': 'Resume uploaded and matched successfully'
            }), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        logger.error(f"Error in upload and match: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'Failed to process resume'
        }), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error."""
    return jsonify({
        'error': 'File too large',
        'message': 'File size exceeds the maximum allowed limit of 16MB'
    }), 413

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors."""
    return jsonify({
        'error': 'Not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors."""
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
