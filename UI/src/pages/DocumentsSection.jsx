import React from 'react';

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
                  className="form-input"
                  value={doc.expiryDate}
                  onChange={(e) => onDocumentChange(index, 'expiryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
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