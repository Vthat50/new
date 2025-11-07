import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, FileText, Image, FileArchive } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface FileUploadProps {
  patientId: string;
  category?: 'document' | 'image' | 'consent' | 'insurance' | 'prescription' | 'other';
  maxSizeMB?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onClose?: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: string;
  url: string;
}

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  uploadedFile?: UploadedFile;
}

export default function FileUpload({
  patientId,
  category = 'document',
  maxSizeMB = 10,
  allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
  multiple = true,
  onUploadComplete,
  onClose,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validatedFiles: FileWithProgress[] = newFiles.map((file) => {
      let error: string | undefined;
      let status: 'pending' | 'error' = 'pending';

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        error = `File size exceeds ${maxSizeMB}MB`;
        status = 'error';
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        error = 'File type not allowed';
        status = 'error';
      }

      return {
        file,
        progress: 0,
        status,
        error,
      };
    });

    setFiles((prev) => (multiple ? [...prev, ...validatedFiles] : validatedFiles));

    // Auto-start upload for valid files
    validatedFiles.forEach((fileWithProgress) => {
      if (fileWithProgress.status === 'pending') {
        uploadFile(fileWithProgress);
      }
    });
  };

  const uploadFile = async (fileWithProgress: FileWithProgress) => {
    const { file } = fileWithProgress;

    // Update status to uploading
    updateFileStatus(file.name, 'uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);
      formData.append('category', category);

      // Simulate upload progress
      const uploadPromise = fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        updateFileProgress(file.name, (prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await uploadPromise;
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Mock uploaded file data
      const uploadedFile: UploadedFile = {
        id: data.id || Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        category,
        uploadedAt: new Date().toISOString(),
        url: data.url || URL.createObjectURL(file),
      };

      // Complete upload
      updateFileProgress(file.name, 100);
      updateFileStatus(file.name, 'success', uploadedFile);

      if (onUploadComplete) {
        onUploadComplete([uploadedFile]);
      }
    } catch (err) {
      updateFileStatus(file.name, 'error', undefined, err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const updateFileProgress = (fileName: string, progressOrUpdater: number | ((prev: number) => number)) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.file.name === fileName
          ? {
              ...f,
              progress: typeof progressOrUpdater === 'function' ? progressOrUpdater(f.progress) : progressOrUpdater,
            }
          : f
      )
    );
  };

  const updateFileStatus = (
    fileName: string,
    status: 'pending' | 'uploading' | 'success' | 'error',
    uploadedFile?: UploadedFile,
    error?: string
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.file.name === fileName
          ? {
              ...f,
              status,
              uploadedFile,
              error,
            }
          : f
      )
    );
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== fileName));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image style={{ width: '24px', height: '24px', color: colors.primary[500] }} />;
    } else if (fileType === 'application/pdf') {
      return <FileText style={{ width: '24px', height: '24px', color: colors.status.error }} />;
    } else if (fileType.includes('zip') || fileType.includes('archive')) {
      return <FileArchive style={{ width: '24px', height: '24px', color: colors.neutral[500] }} />;
    } else {
      return <File style={{ width: '24px', height: '24px', color: colors.neutral[500] }} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const allUploadsComplete = files.length > 0 && files.every((f) => f.status === 'success' || f.status === 'error');

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        padding: spacing[4],
        backgroundColor: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing[4],
        }}
      >
        <div>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
            Upload Files
          </h3>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            Max size: {maxSizeMB}MB • Allowed: {allowedTypes.map((t) => t.split('/')[1]).join(', ')}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? colors.primary[500] : colors.neutral[300]}`,
          borderRadius: '8px',
          padding: spacing[8],
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? colors.primary[50] : colors.neutral[50],
          transition: 'all 0.2s',
          marginBottom: spacing[4],
        }}
      >
        <Upload
          style={{
            width: '48px',
            height: '48px',
            color: isDragging ? colors.primary[500] : colors.neutral[400],
            margin: '0 auto',
            marginBottom: spacing[3],
          }}
        />
        <div style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </div>
        <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
          or click to browse
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div>
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
            }}
          >
            Files ({files.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {files.map((fileWithProgress, index) => (
              <div
                key={`${fileWithProgress.file.name}-${index}`}
                style={{
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: '6px',
                  backgroundColor: 'white',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                  {/* File Icon */}
                  <div>{getFileIcon(fileWithProgress.file.type)}</div>

                  {/* File Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        marginBottom: spacing[1],
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fileWithProgress.file.name}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      {formatFileSize(fileWithProgress.file.size)}
                    </div>

                    {/* Progress Bar */}
                    {fileWithProgress.status === 'uploading' && (
                      <div
                        style={{
                          marginTop: spacing[2],
                          height: '4px',
                          backgroundColor: colors.neutral[200],
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${fileWithProgress.progress}%`,
                            backgroundColor: colors.primary[500],
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                    )}

                    {/* Error Message */}
                    {fileWithProgress.error && (
                      <div
                        style={{
                          marginTop: spacing[2],
                          fontSize: typography.fontSize.xs,
                          color: colors.status.error,
                        }}
                      >
                        {fileWithProgress.error}
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div>
                    {fileWithProgress.status === 'success' && (
                      <CheckCircle style={{ width: '20px', height: '20px', color: colors.status.success }} />
                    )}
                    {fileWithProgress.status === 'error' && (
                      <AlertCircle style={{ width: '20px', height: '20px', color: colors.status.error }} />
                    )}
                    {fileWithProgress.status === 'uploading' && (
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.primary[500] }}>
                        {fileWithProgress.progress}%
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileWithProgress.file.name);
                    }}
                    style={{
                      padding: spacing[1],
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    <X style={{ width: '16px', height: '16px', color: colors.neutral[400] }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {allUploadsComplete && (
        <div
          style={{
            marginTop: spacing[4],
            padding: spacing[3],
            backgroundColor: colors.status.successBg,
            border: `1px solid ${colors.status.success}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <CheckCircle style={{ width: '20px', height: '20px', color: colors.status.success }} />
          <span style={{ fontSize: typography.fontSize.sm, color: colors.status.success, fontWeight: typography.fontWeight.medium }}>
            {files.filter((f) => f.status === 'success').length} file(s) uploaded successfully
          </span>
        </div>
      )}
    </div>
  );
}
