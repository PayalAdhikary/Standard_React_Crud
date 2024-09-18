import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CrudServices from '../Services/CrudServices'; 
//import './FileUpload.scss'; 

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImagePreview = styled('div')({
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  img: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
});

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please choose a file before uploading');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('File', file);

    const crudServices = new CrudServices();
    crudServices.ImageUpload( formData) 
      .then(response => {
        setResponse(response.data);
        alert('File uploaded successfully');
      })
      .catch(error => {
        setError('File upload failed, please try again');
      })
      .finally(() => {
        setUploading(false);
        setFile(null);
        setPreview(null);
      });
  };

  return (
    <div className="file-upload-container">
      <Button
        component="label"
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        style={{
          backgroundColor: '#1976d2',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '8px',
        }}
      >
        Choose File
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {preview && (
        <ImagePreview>
          <h3>File Preview:</h3>
          <img src={preview} alt="File Preview" />
        </ImagePreview>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>File Upload Details:</h3>
          <p><strong>File URL:</strong> <a href={response.fullUrlPath} target="_blank" rel="noopener noreferrer">{response.fullUrlPath}</a></p>
          <p><strong>Filename:</strong> {response.filename}</p>
          <p><strong>Content Type:</strong> {response.contentType}</p>
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          marginTop: '20px',
          backgroundColor: '#4caf50',
          color: '#fff',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
};

export default FileUpload;
