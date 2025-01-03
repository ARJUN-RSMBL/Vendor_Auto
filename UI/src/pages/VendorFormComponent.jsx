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
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Expiry date validation
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      expiryDate: true
    });

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      await vendorService.createVendor(formData);
      toast.success('Vendor registered successfully!');
      // Reset form
      setFormData({
        name: '',
        email: '',
        expiryDate: ''
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