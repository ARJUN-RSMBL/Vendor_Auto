import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/FormStyles.css';
import vendorService from '../services/vendorService';

function VendorFormComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expiryDate: '',
    vendorLicense: '',
    licenseType: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    tradeLicenseAuthority: '',
    documents: [{ file: null, expiryDate: '', documentName: '' }],
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});



  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (touched[name]) {
      validateForm();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate required fields
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const selected = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.expiryDate = 'Expiry date cannot be in the past';
      }
    }

    // Optional field validations (only if they have values)
    if (formData.name && formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.vendorLicense && formData.vendorLicense.length < 5) {
      newErrors.vendorLicense = 'License number must be at least 5 characters';
    }

    if (formData.licenseExpiryDate && formData.licenseIssueDate) {
      const issueDate = new Date(formData.licenseIssueDate);
      const expiryDate = new Date(formData.licenseExpiryDate);
      if (expiryDate < issueDate) {
        newErrors.licenseExpiryDate = 'License expiry date must be after issue date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ expiryDate: true });

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Add regular form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'documents' && value && value.trim && value.trim() !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Add documents
      formData.documents.forEach((doc, index) => {
        if (doc.file) {
          formDataToSend.append(`documents[${index}]file`, doc.file);
          formDataToSend.append(`documents[${index}]expiryDate`, doc.expiryDate);
          formDataToSend.append(`documents[${index}]documentName`, doc.documentName);
        }
      });

      await vendorService.createVendor(formDataToSend);
      toast.success('Vendor registered successfully!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        expiryDate: '',
        vendorLicense: '',
        licenseType: '',
        licenseIssueDate: '',
        licenseExpiryDate: '',
        tradeLicenseAuthority: '',
        documents: [{ file: null, expiryDate: '', documentName: '' }]
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      let errorMessage = 'Failed to register vendor';
      if (error.response) {
        // Handle specific HTTP error responses
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data.message || 'Invalid vendor data';
            break;
          case 401:
            errorMessage = 'Please login to continue';
            break;
          case 403:
            errorMessage = 'You do not have permission to register vendors';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...formData.documents];
    newDocuments[index] = {
      ...newDocuments[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      documents: newDocuments
    }));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    handleDocumentChange(index, 'file', file);
  };

  const addDocumentField = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { file: null, expiryDate: '', documentName: '' }]
    }));
  };

  const removeDocumentField = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="iqama-form-container">
      <div className="form-header">
        <div className="form-icon-wrapper">
          <i className="bi bi-person-plus-fill"></i>
        </div>
        <h2 className="form-title">Vendor Documents</h2>
        <p className="form-subtitle">Enter details below</p>
      </div>

      <form className="iqama-form" onSubmit={handleSubmit} noValidate>
        <div className={`form-group ${errors.name && touched.name ? 'has-error' : ''}`}>
          <label htmlFor="name" className="form-label">
            <i className="bi bi-person me-2"></i>
            Name
          </label>
          <div className="input-wrapper">
            <input
              className="form-input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter vendor name"
              required
            />
            {errors.name && touched.name && (
              <div className="error-message">
                <i className="bi bi-exclamation-circle"></i>
                {errors.name}
              </div>
            )}
          </div>
        </div>

        <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''}`}>
          <label htmlFor="email" className="form-label">
            <i className="bi bi-envelope me-2"></i>
            Email
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email address"
              required
              className="form-input"
            />
            {errors.email && touched.email && (
              <div className="error-message">
                <i className="bi bi-exclamation-circle"></i>
                {errors.email}
              </div>
            )}
          </div>
        </div>

        {/* <div className={`form-group ${errors.expiryDate && touched.expiryDate ? 'has-error' : ''}`}>
          <label htmlFor="expiryDate" className="form-label">
            <i className="bi bi-calendar me-2"></i>
            Expiry Date
          </label>
          <div className="input-wrapper">
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.expiryDate && touched.expiryDate && (
              <div className="error-message">
                <i className="bi bi-exclamation-circle"></i>
                {errors.expiryDate}
              </div>
            )}
          </div>
        </div> */}



        {/* Documents Section */}
        <div className="form-section-divider">
          <h3 className="section-title">Documents</h3>
        </div>

        {formData.documents.map((doc, index) => (
          <div key={index} className="document-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`documentName-${index}`} className="form-label">
                  <i className="bi bi-file-text me-2"></i>
                  Document Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id={`documentName-${index}`}
                    className="form-input"
                    value={doc.documentName}
                    onChange={(e) => handleDocumentChange(index, 'documentName', e.target.value)}
                    placeholder="Enter document name"
                  />
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
                    onChange={(e) => handleFileChange(index, e)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              <div className={`form-group ${errors.expiryDate && touched.expiryDate ? 'has-error' : ''}`}>
                <label htmlFor="expiryDate" className="form-label">
                  <i className="bi bi-calendar me-2"></i>
                  Expiry Date
                </label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.expiryDate && touched.expiryDate && (
                    <div className="error-message">
                      <i className="bi bi-exclamation-circle"></i>
                      {errors.expiryDate}
                    </div>
                  )}
                </div>
              </div>

              {index > 0 && (
                <button
                  type="button"
                  className="remove-document-btn"
                  onClick={() => removeDocumentField(index)}
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
          onClick={addDocumentField}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Document
        </button>

        <button
          type="submit"
          className="form-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="bi bi-hourglass-split me-2 spinning"></i>
              Submitting...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Register Vendor
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default VendorFormComponent;