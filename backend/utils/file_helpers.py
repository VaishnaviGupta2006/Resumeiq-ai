import os
import uuid
from werkzeug.utils import secure_filename
from config import Config

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def generate_unique_filename(original_filename):
    """Generate a unique filename to prevent overwriting."""
    secure_name = secure_filename(original_filename)
    name, ext = os.path.splitext(secure_name)
    unique_name = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
    return unique_name

def save_uploaded_file(file, upload_folder):
    """Save an uploaded file with a unique filename."""
    if not allowed_file(file.filename):
        return None, "Invalid file type. Only PDF and DOCX files are allowed."
    
    unique_filename = generate_unique_filename(file.filename)
    filepath = os.path.join(upload_folder, unique_filename)
    
    # Ensure upload folder exists
    os.makedirs(upload_folder, exist_ok=True)
    
    file.save(filepath)
    
    return unique_filename, None
