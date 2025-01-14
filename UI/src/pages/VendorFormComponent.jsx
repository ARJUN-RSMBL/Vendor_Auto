import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/FormStyles.css';
import vendorService from '../services/vendorService';
import { getAllDocumentTypes } from '../services/documentTypeService';
import DocumentsSection from '../pages/DocumentsSection';
import { isVendorUser, getLoggedInUser } from '../services/authService';

function VendorFormComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expiryDate: '',
    vendorLicense: '',
    documents: [{ file: null, expiryDate: '', documentTypeId: '' }],
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isVendor, setIsVendor] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);

  // Add useEffect to fetch document types when component mounts
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        // console.log('Starting to fetch document types');
        const response = await getAllDocumentTypes();
        // console.log('Response received:', response);

        if (!response.data || response.data.length === 0) {
          console.warn('No document types found');
        }

        setDocumentTypes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error in component:', error);
        toast.error('Failed to fetch document types');
        setDocumentTypes([]);
      }
    };

    fetchDocumentTypes();
  }, []);

  useEffect(() => {
    setIsVendor(isVendorUser());
  }, []);

  // Add this useEffect to fetch vendor details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (isVendor) {
        try {
          const username = getLoggedInUser();
          // console.log('Fetching details for username:', username);
          const response = await vendorService.getVendorDetails(username);
          // console.log('Vendor details received:', response);
          setVendorDetails(response);
        } catch (error) {
          console.error('Error fetching vendor details:', error);
          toast.error('Failed to fetch vendor details');
        }
      }
    };

    fetchVendorDetails();
  }, [isVendor]);


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
    // console.log('Starting validation with data:', formData);

    // Only validate vendor fields if not a vendor user
    if (!isVendor) {
      // Required field validations
      if (!formData.name?.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 3) {
        newErrors.name = 'Name must be at least 3 characters';
      }

      if (!formData.vendorLicense?.trim()) {
        newErrors.vendorLicense = 'Vendor license is required';
      }

      if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Document validations
    formData.documents.forEach((doc, index) => {
      const documentErrors = {};
      let hasError = false;

      if (!doc.documentTypeId) {
        documentErrors.documentTypeId = 'Document type is required';
        hasError = true;
      }

      if (!doc.expiryDate) {
        documentErrors.expiryDate = 'Document expiry date is required';
        hasError = true;
      } else {
        const selected = new Date(doc.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          documentErrors.expiryDate = 'Expiry date cannot be in the past';
          hasError = true;
        }
      }

      const selectedType = documentTypes.find(t => t.typeId === doc.documentTypeId);
      if (selectedType?.mandatory && !doc.file) {
        documentErrors.file = 'This document is mandatory';
        hasError = true;
      }

      if (hasError) {
        newErrors[`documents[${index}]`] = documentErrors;
      }
    });

    console.log('Validation complete. Errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form submission started');

    const isValid = validateForm();
    // console.log('Form validation result:', isValid);

    if (!isValid) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Add basic vendor fields
      // formDataToSend.append('name', formData.name.trim());
      // formDataToSend.append('vendorLicense', formData.vendorLicense.trim());
      // if (formData.email) {
      //   formDataToSend.append('email', formData.email.trim());
      // }
      if (!isVendor) {
        formDataToSend.append('name', formData.name.trim());
        formDataToSend.append('vendorLicense', formData.vendorLicense.trim());
        if (formData.email) {
          formDataToSend.append('email', formData.email.trim());
        }
      } else if (vendorDetails) {
        // Append vendor details from logged-in user
        console.log('Appending vendor details:', vendorDetails);
        formDataToSend.append('name', vendorDetails.name);
        formDataToSend.append('email', vendorDetails.email);
        if (vendorDetails.vendorLicense) {
          formDataToSend.append('vendorLicense', vendorDetails.vendorLicense);
        }
      }
      // Add documents array as JSON string first to maintain structure
      // Create and log documents data before sending
      const documentsData = formData.documents.map(doc => ({
        documentTypeId: doc.documentTypeId,
        expiryDate: new Date(doc.expiryDate).toISOString().split('T')[0]
      }));
      console.log('Documents data being sent:', documentsData);
      formDataToSend.append('documents', JSON.stringify(documentsData));

      // Log files being sent
      formData.documents.forEach((doc, index) => {
        if (doc.file) {
            console.log(`Adding file ${index}:`, doc.file);
            formDataToSend.append(`files`, doc.file);
            formDataToSend.append(`fileIndices`, index);
        }
    });

      // Log complete FormData contents
      // console.log('Complete form data entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[0] === 'files' ? 'File object' : pair[1]}`);
      }

      // const response = await vendorService.createVendor(formDataToSend);
      const response = isVendor
        ? await vendorService.updateVendorDocuments(formDataToSend)
        : await vendorService.createVendor(formDataToSend);
      console.log('Full response:', response);

      if (response.data) {
        toast.success(isVendor ? 'Documents updated successfully!' : 'Vendor registered successfully!');
        setFormData({
          name: '',
          email: '',
          vendorLicense: '',
          documents: [{ file: null, expiryDate: '', documentTypeId: '' }]
        });
      }

    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = 'Failed to register vendor';
      if (error.response) {
        console.error('Error response:', error.response);
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

  // Add error display for document file
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should not exceed 5MB');
      e.target.value = ''; // Reset input
      return;
    }
    handleDocumentChange(index, 'file', file);
  };

  const addDocumentField = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { file: null, expiryDate: '', documentTypeId: '' }] // Changed documentName to documentTypeId
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

      {/* <form className="iqama-form" onSubmit={handleSubmit} noValidate> */}
      <form className="iqama-form" onSubmit={handleSubmit} noValidate>
        {!isVendor && (
          <>
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

            <div className={`form-group ${errors.vendorLicense && touched.vendorLicense ? 'has-error' : ''}`}>
              <label htmlFor="vendorLicense" className="form-label">
                <i className="bi bi-card-text me-2"></i>
                Vendor License
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="vendorLicense"
                  name="vendorLicense"
                  value={formData.vendorLicense}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter vendor license number"
                  required
                  className="form-input"
                />
                {errors.vendorLicense && touched.vendorLicense && (
                  <div className="error-message">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.vendorLicense}
                  </div>
                )}
              </div>
            </div>
          </>)}


        {/* Documents Section */}
        <DocumentsSection
          documents={formData.documents}
          documentTypes={documentTypes}
          errors={errors}
          touched={touched}
          onDocumentChange={handleDocumentChange}
          onFileChange={handleFileChange}
          onRemoveDocument={removeDocumentField}
          onAddDocument={addDocumentField}
        />

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
              {isVendor ? 'Update Documents' : 'Register Vendor'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default VendorFormComponent;