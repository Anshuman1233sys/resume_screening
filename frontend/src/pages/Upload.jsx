import { useState } from 'react';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './pages.css';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!files.length || !jobDesc) return alert("Please provide job description and files.");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('job_description', jobDesc);
    Array.from(files).forEach(f => formData.append('files', f));

    try {
      await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/shortlisted');
    } catch (e) {
      console.error(e);
      alert("Error uploading to Gemini backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="job-desc-section card-plain">
        <h3>Job Description</h3>
        <textarea 
          rows={4} 
          placeholder="Paste job description here..."
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
        />
      </div>

      <div className="upload-section card-plain">
        <p className="subtitle">Drag and drop files or click to browse. Supports PDF, DOCX formats.</p>
        
        <div className="drop-zone">
          <input 
            type="file" 
            multiple 
            accept=".pdf,.docx,.txt"
            onChange={e => setFiles(e.target.files)}
          />
          <div className="drop-content">
            <div className="upload-circle">
              <UploadIcon size={24} color="#8b5cf6" />
            </div>
            <h3>Upload Resume Files</h3>
            <p>Drag and drop your files here or click the button below</p>
            <button className="btn-primary browse-btn">
              <UploadIcon size={16} /> Browse Files
            </button>
            <p className="max-size">Maximum file size: 10MB per file</p>
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
         <div className="ready-actions">
           <button onClick={handleUpload} className="btn-primary start-process-btn" disabled={loading}>
             {loading ? <Loader2 className="spinner" /> : 'Process Resumes with Gemini AI'}
           </button>
         </div>
      )}

      <div className="guidelines">
        <h3>Upload Guidelines</h3>
        <div className="guideline-cards">
          <div className="g-card">
            <div className="num">1</div>
            <div>
              <strong>Supported Formats</strong>
              <p>Upload PDF, DOC, or DOCX files</p>
            </div>
          </div>
          <div className="g-card">
            <div className="num num-pink">2</div>
            <div>
              <strong>Multiple Upload</strong>
              <p>Upload multiple resumes at once</p>
            </div>
          </div>
          <div className="g-card">
            <div className="num num-green">3</div>
            <div>
              <strong>Auto Processing</strong>
              <p>Automatic screening and ranking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
