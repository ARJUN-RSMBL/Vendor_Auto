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
    setTouched({ expiryDate: true }); // Only mark required field as touched

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a new object with only non-empty values
      const submitData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value.trim && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Ensure expiryDate is always included
      submitData.expiryDate = formData.expiryDate;

      await vendorService.createVendor(submitData);
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
        tradeLicenseAuthority: ''
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="iqama-form-container">
      <div className="form-header">
        <div className="form-icon-wrapper">
          <i className="bi bi-person-plus-fill"></i>
        </div>
        <h2 className="form-title">Vendor Registration</h2>
        <p className="form-subtitle">Enter vendor details below</p>
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

        {/* License Information Section */}
        <div className="form-section-divider">
          <h3 className="section-title">License Information</h3>
        </div>

        <div className={`form-group ${errors.vendorLicense && touched.vendorLicense ? 'has-error' : ''}`}>
          <label htmlFor="vendorLicense" className="form-label">
            <i className="bi bi-upc-scan me-2"></i>
            License Number
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="vendorLicense"
              name="vendorLicense"
              className="form-input"
              value={formData.vendorLicense}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter license number"
              required
            />
            {errors.vendorLicense && touched.vendorLicense && (
              <div className="error-message">
                <i className="bi bi-exclamation-circle"></i>
                {errors.vendorLicense}
              </div>
            )}
          </div>
        </div>

        <div className={`form-group ${errors.licenseType && touched.licenseType ? 'has-error' : ''}`}>
          <label htmlFor="licenseType" className="form-label">
            <i className="bi bi-card-text me-2"></i>
            License Type
          </label>
          <div className="input-wrapper">
            <select
              id="licenseType"
              name="licenseType"
              className="form-input"
              value={formData.licenseType}
              onChange={handleChange}
              onBlur={handleBlur}
              // required
            >
              <option value="">Select license type</option>
              <option value="trade">Trade License</option>
              <option value="professional">Professional License</option>
              <option value="commercial">Commercial License</option>
              <option value="industrial">Industrial License</option>
            </select>
            {errors.licenseType && touched.licenseType && (
              <div className="error-message">
                <i className="bi bi-exclamation-circle"></i>
                {errors.licenseType}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className={`form-group ${errors.licenseIssueDate && touched.licenseIssueDate ? 'has-error' : ''}`}>
            <label htmlFor="licenseIssueDate" className="form-label">
              <i className="bi bi-calendar-plus me-2"></i>
              Issue Date
            </label>
            <div className="input-wrapper">
              <input
                type="date"
                id="licenseIssueDate"
                name="licenseIssueDate"
                className="form-input"
                value={formData.licenseIssueDate}
                onChange={handleChange}
                onBlur={handleBlur}
                // required
              />
              {errors.licenseIssueDate && touched.licenseIssueDate && (
                <div className="error-message">
                  <i className="bi bi-exclamation-circle"></i>
                  {errors.licenseIssueDate}
                </div>
              )}
            </div>
          </div>

          <div className={`form-group ${errors.licenseExpiryDate && touched.licenseExpiryDate ? 'has-error' : ''}`}>
            <label htmlFor="licenseExpiryDate" className="form-label">
              <i className="bi bi-calendar-x me-2"></i>
              Expiry Date
            </label>
            <div className="input-wrapper">
              <input
                type="date"
                id="licenseExpiryDate"
                name="licenseExpiryDate"
                className="form-input"
                value={formData.licenseExpiryDate}
                onChange={handleChange}
                onBlur={handleBlur}
                // required
              />
              {errors.licenseExpiryDate && touched.licenseExpiryDate && (
                <div className="error-message">
                  <i className="bi bi-exclamation-circle"></i>
                  {errors.licenseExpiryDate}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`form-group ${errors.tradeLicenseAuthority && touched.tradeLicenseAuthority ? 'has-error' : ''}`}>
          <label htmlFor="tradeLicenseAuthority" className="form-label">
            <i className="bi bi-building me-2"></i>
            Trade License Authority
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="tradeLicenseAuthority"
              name="tradeLicenseAuthority"
              className="form-input"
              value={formData.tradeLicenseAuthority}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter trade license authority"
              // required
            />
            {errors.tradeLicenseAuthority && touched.tradeLicenseAuthority && (
              <div className="error-message">
                <i className="bi bi-exclamation-circle"></i>
                {errors.tradeLicenseAuthority}
              </div>
            )}
          </div>
        </div>

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