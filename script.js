// DOM Elements
const resumeForm = document.getElementById('resumeForm');
const fileUploadArea = document.getElementById('fileUploadArea');
const resumeFile = document.getElementById('resumeFile');
const jobDescription = document.getElementById('jobDescription');
const submitBtn = document.getElementById('submitBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultsSection = document.getElementById('resultsSection');
const closeResults = document.getElementById('closeResults');

// Results elements
const totalScore = document.getElementById('totalScore');
const skillsScore = document.getElementById('skillsScore');
const experienceScore = document.getElementById('experienceScore');
const educationScore = document.getElementById('educationScore');
const skillsProgress = document.getElementById('skillsProgress');
const experienceProgress = document.getElementById('experienceProgress');
const educationProgress = document.getElementById('educationProgress');
const suggestions = document.getElementById('suggestions');

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const skillsContent = document.getElementById('skillsContent');
const experienceContent = document.getElementById('experienceContent');
const educationContent = document.getElementById('educationContent');
const projectsContent = document.getElementById('projectsContent');

// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// File Upload Handling
fileUploadArea.addEventListener('click', () => {
    resumeFile.click();
});

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
            resumeFile.files = files;
            updateFileDisplay(file);
        } else {
            showError('Please upload a PDF file only.');
        }
    }
});

resumeFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        updateFileDisplay(file);
    }
});

function updateFileDisplay(file) {
    const placeholder = fileUploadArea.querySelector('.upload-placeholder');
    placeholder.innerHTML = `
        <i class="fas fa-file-pdf"></i>
        <p><strong>${file.name}</strong></p>
        <span class="file-size-limit">Size: ${formatFileSize(file.size)}</span>
    `;
    fileUploadArea.style.borderColor = '#667eea';
    fileUploadArea.style.background = '#f0f4ff';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form Submission
resumeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = resumeFile.files[0];
    const jobDesc = jobDescription.value.trim();
    
    if (!file) {
        showError('Please select a resume file.');
        return;
    }
    
    if (!jobDesc) {
        showError('Please enter a job description.');
        return;
    }
    
    if (file.size > 16 * 1024 * 1024) {
        showError('File size must be less than 16MB.');
        return;
    }
    
    await analyzeResume(file, jobDesc);
});

async function analyzeResume(file, jobDescription) {
    try {
        showLoading(true);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', jobDescription);
        
        const response = await fetch(`${API_BASE_URL}/upload-and-match`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to analyze resume');
        }
        
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred while analyzing the resume.');
    } finally {
        showLoading(false);
    }
}

function displayResults(data) {
    // Update scores
    const scores = data.scores;
    totalScore.textContent = Math.round(scores.total_score * 100);
    skillsScore.textContent = Math.round(scores.skills_score * 100) + '%';
    experienceScore.textContent = Math.round(scores.experience_score * 100) + '%';
    educationScore.textContent = Math.round(scores.education_score * 100) + '%';
    
    // Animate progress bars
    setTimeout(() => {
        skillsProgress.style.width = (scores.skills_score * 100) + '%';
        experienceProgress.style.width = (scores.experience_score * 100) + '%';
        educationProgress.style.width = (scores.education_score * 100) + '%';
    }, 100);
    
    // Update suggestions
    suggestions.innerHTML = `<p>${data.suggestions}</p>`;
    
    // Update parsed data
    updateParsedData(data.parsed_data);
    
    // Show results
    resultsSection.style.display = 'flex';
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function updateParsedData(parsedData) {
    // Skills
    if (parsedData.skills) {
        const skills = Array.isArray(parsedData.skills) ? parsedData.skills : [parsedData.skills];
        skillsContent.innerHTML = skills.length > 0 
            ? skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
            : '<p>No skills found in the resume.</p>';
    } else {
        skillsContent.innerHTML = '<p>No skills found in the resume.</p>';
    }
    
    // Experience
    experienceContent.innerHTML = parsedData.experience 
        ? `<p>${parsedData.experience}</p>`
        : '<p>No experience information found in the resume.</p>';
    
    // Education
    educationContent.innerHTML = parsedData.education 
        ? `<p>${parsedData.education}</p>`
        : '<p>No education information found in the resume.</p>';
    
    // Projects
    projectsContent.innerHTML = parsedData.projects 
        ? `<p>${parsedData.projects}</p>`
        : '<p>No projects information found in the resume.</p>';
}

// Tab functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        btn.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

// Close results
closeResults.addEventListener('click', () => {
    resultsSection.style.display = 'none';
});

// Utility functions
function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
    submitBtn.disabled = show;
}

function showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        max-width: 300px;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Add skill tag styling
const style = document.createElement('style');
style.textContent = `
    .skill-tag {
        display: inline-block;
        background: #667eea;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        margin: 4px;
        font-size: 0.9rem;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Health check on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
            console.warn('Backend server might not be running');
        }
    } catch (error) {
        console.warn('Cannot connect to backend server. Make sure it\'s running on http://localhost:5000');
    }
}); 