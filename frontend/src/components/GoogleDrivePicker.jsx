import { useState } from 'react';

const FileUpload = ({ onFilesSelected, label = 'Select Images from Device', maxFiles = 4 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedFiles = [];

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login first to upload images');
        setUploading(false);
        return;
      }

      for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
        const file = files[i];
        
        // Validate file is image
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', file);

        // Construct full API URL
        const uploadUrl = `${API_URL}/admin/upload-image`;
        console.log('Uploading to:', uploadUrl);

        // Upload to backend endpoint with auth header
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || `Upload failed for ${file.name}`);
        }

        const imageUrl = responseData.data.imageUrl;
        console.log('Image URL:', imageUrl);
        
        uploadedFiles.push({
          id: `img-${Date.now()}-${i}`,
          name: file.name,
          originalName: responseData.data.fileName || file.name,
          size: file.size,
          mimeType: file.type,
          url: imageUrl,
          filename: responseData.data.fileName
        });

        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }

      if (uploadedFiles.length > 0) {
        onFilesSelected(uploadedFiles);
      } else {
        alert('No images were uploaded');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-blue-400 rounded px-6 py-8 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <span className="text-3xl">📤</span>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {uploading ? '⏳ Uploading...' : label}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click to select up to {maxFiles} images from your device
          </p>
        </div>
      </label>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName}>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{fileName}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;






