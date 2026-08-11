import React, { useState } from 'react';
import api from '../services/api';
import { Upload, X, RefreshCw, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ImageUploader = ({
  label = "Upload Image",
  value = "",
  fileId = "",
  onChange,
  onRemove,
  aspectRatio = "aspect-video",
  maxSizeMB = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateAndUpload = async (file) => {
    setError('');

    if (!file) return;

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError('Please upload a JPG, PNG or WEBP image.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit. Please select a smaller image.`);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.success) {
        const { url, fileId: newFileId } = res.data.data;

        // If replacing an existing file, old file will be safely checked and cleaned up by backend upon saving
        if (onChange) {
          onChange(url, newFileId);
        }
      } else {
        setError(res.data.message || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = async () => {
    const confirmDelete = window.confirm(
      "Delete this image? This will remove the image from the website and, if it is no longer used elsewhere, permanently remove it from ImageKit."
    );

    if (!confirmDelete) return;

    try {
      setRemoving(true);
      setError('');

      if (fileId && !fileId.startsWith('local_')) {
        await api.delete(`/upload/${fileId}`);
      }

      if (onRemove) {
        onRemove();
      } else if (onChange) {
        onChange('', '');
      }
    } catch (err) {
      console.error('CDN file delete error:', err);
      setError('Unable to delete image. Please try again.');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        /* Image Preview & Replace / Remove Controls */
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 space-y-2">
          <div className={`relative w-full ${aspectRatio} rounded-lg overflow-hidden bg-slate-900`}>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            
            {(uploading || removing) && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-gold-400 mb-2" />
                <span className="text-xs font-semibold">
                  {uploading ? 'Uploading to ImageKit...' : 'Cleaning up ImageKit file...'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                disabled={uploading || removing}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading || removing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold transition"
            >
              {removing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              <span>{removing ? 'Removing...' : 'Remove'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* File Picker & Drag-and-Drop Area */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer relative ${
            isDragOver ? 'border-gold-500 bg-gold-50/50' : 'border-slate-300 hover:border-navy-900 bg-slate-50'
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {uploading ? (
            <div className="py-4 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-gold-600 mx-auto" />
              <p className="text-xs font-semibold text-navy-900">Uploading image file to ImageKit...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">Click to Select File or Drag & Drop</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, JPEG, PNG, WEBP (Max {maxSizeMB}MB)</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
