import React, { useEffect, useState } from 'react';
import '../styles/DocumentStyles.css';

function DocumentsSection({
  documents,
  documentTypes,
  errors,
  touched,
  onDocumentChange,
  onFileChange,
  onRemoveDocument,
  onAddDocument
}) {

  useEffect(() => {
    return () => {
      documents.forEach(doc => {
        if (doc.file) {
          const previewUrl = getFilePreview(doc.file);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        }
      });
    };
  }, [documents]);

  // Add helper function to get preview URL
  const getFilePreview = (file) => {
    if (!file) return null;

    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }

    // For PDFs
    if (file.type === 'application/pdf') {
      return URL.createObjectURL(file);
    }

    // For other document types, return null or a placeholder
    return null;
  };

  return (
    <>
      <div className="form-section-divider">
        <h3 className="section-title">Documents</h3>
      </div>
      {documents.map((doc, index) => (
        <div key={index} className="document-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`documentType-${index}`} className="form-label">
                <i className="bi bi-file-text me-2"></i>
                Document Type
              </label>
              <div className="input-wrapper">
                <select
                  id={`documentType-${index}`}
                  className={`form-input ${errors[`documents[${index}]`]?.documentTypeId ? 'error' : ''}`}
                  value={doc.documentTypeId || ''}
                  onChange={(e) => onDocumentChange(index, 'documentTypeId', e.target.value)}
                  required
                >
                  <option value="">Select Document Type</option>
                  {documentTypes.map(type => (
                    <option key={type.typeId} value={type.typeId}>
                      {type.typeName} {type.mandatory ? '*' : ''}
                    </option>
                  ))}
                </select>
                {touched[`documents[${index}]`] && errors[`documents[${index}]`]?.documentTypeId && (
                  <div className="error-message">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors[`documents[${index}]`].documentTypeId}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`document-${index}`} className="form-label">
                <i className="bi bi-upload me-2"></i>
                Upload Document
              </label>
              <div className="input-wrapper">
                <input
                  type="file"
                  id={`document-${index}`}
                  className="form-input"
                  onChange={(e) => onFileChange(index, e)}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required={documentTypes.find(t => t.typeId === doc.documentTypeId)?.mandatory}
                />
                {doc.file && (
                  <div className="file-preview">
                    <div className="file-info">
                      <i className={`bi ${doc.file.type.startsWith('image/') ? 'bi-file-image' :
                          doc.file.type === 'application/pdf' ? 'bi-file-pdf' :
                            'bi-file-text'
                        } me-2`}></i>
                      <span>{doc.file.name}</span>
                      <span className="file-size">({(doc.file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                    {getFilePreview(doc.file) && (
                      <div className="preview-container">
                        {doc.file.type.startsWith('image/') ? (
                          <img
                            src={getFilePreview(doc.file)}
                            alt="Preview"
                            className="file-preview-image"
                          />
                        ) : doc.file.type === 'application/pdf' && (
                          <iframe
                            src={getFilePreview(doc.file)}
                            title="PDF preview"
                            className="pdf-preview"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`expiryDate-${index}`} className="form-label">
                <i className="bi bi-calendar me-2"></i>
                Expiry Date
              </label>
              <div className="input-wrapper">
                <input
                  type="date"
                  id={`expiryDate-${index}`}
                  className={`form-input ${errors[`documents[${index}]`]?.expiryDate ? 'error' : ''}`}
                  value={doc.expiryDate}
                  onChange={(e) => onDocumentChange(index, 'expiryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {touched[`documents[${index}]`] && errors[`documents[${index}]`]?.expiryDate && (
                  <div className="error-message">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors[`documents[${index}]`].expiryDate}
                  </div>
                )}
              </div>
            </div>

            {index > 0 && (
              <button
                type="button"
                className="remove-document-btn"
                onClick={() => onRemoveDocument(index)}
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="add-document-btn"
        onClick={onAddDocument}
      >
        <i className="bi bi-plus-circle me-2"></i>
        Add Document
      </button>
    </>
  );
}

export default DocumentsSection;