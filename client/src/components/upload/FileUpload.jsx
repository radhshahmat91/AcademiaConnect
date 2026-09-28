import { useRef, useState } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';
import api, { fileUrl } from '../../services/api';

// Generic upload control: shows a preview (image or file-name chip), uploads
// on selection, and reports the resulting server path back to the parent.
export default function FileUpload({ label, value, onChange, accept = 'image/*', kind = 'image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url, file.name);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="flex items-center gap-3">
        {kind === 'image' && value && (
          <img src={fileUrl(value)} alt="Preview" className="h-14 w-14 rounded object-cover border border-hairline" />
        )}
        {kind === 'file' && value && (
          <span className="flex items-center gap-1.5 rounded border border-hairline bg-parchment px-2.5 py-1.5 text-xs text-ink-muted">
            <FileText size={14} /> Attached
          </span>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? 'Uploading...' : value ? 'Replace' : 'Upload'}
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      </div>
      {error && <p className="mt-1 text-xs text-brick">{error}</p>}
    </div>
  );
}
