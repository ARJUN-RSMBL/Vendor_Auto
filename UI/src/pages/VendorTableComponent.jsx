import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ViewVendorModal from '../components/ViewVendorModal';
import EditVendorModal from '../components/EditVendorModal';
import vendorService from '../services/vendorService';
import { toast } from 'react-toastify';
import '../styles/TableStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function VendorTableComponent() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getAllVendors();
      console.log('Raw response:', response); // Debug log

      // Ensure vendors is an array, or default to empty array if undefined
      const vendorArray = Array.isArray(response) ? response :
        (response?.data ? response.data : []); // Check for response.data

      console.log('Processed vendors:', vendorArray); // Debug log
      setVendors(vendorArray);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
      setVendors([]);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchVendors();
      toast.success('Vendors refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh vendors');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleView = (vendor) => {  
    setSelectedVendor(vendor);
    setIsViewModalOpen(true);
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        const response = await vendorService.deleteVendor(id);
        toast.success('Vendor deleted successfully');
        fetchVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
        const errorMessage = error.response?.data?.message || 
          'Cannot delete this vendor. It might be associated with a user account.';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="vendor-container">
      <div className="vendor-header">
        <h2>Vendor Details</h2>
        <Button
          className="refresh-button"
          onClick={handleRefresh}
        >
          <i className="bi bi-arrow-clockwise"></i>
          {' '}Refresh
        </Button>
      </div>

      <div className="table-responsive">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>License</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>#{vendor.id}</td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.vendorLicense}</td>
                <td>{vendor.expiryDate ? new Date(vendor.expiryDate).toLocaleDateString() : 'Not Set'}</td>
                <td>
                  <span className={`status-badge ${vendor.status.toLowerCase()}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(vendor)}
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(vendor)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(vendor.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vendors.length === 0 && (
          <div className="no-data">
            No vendors found. Please add some vendors.
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedVendor && (
        <ViewVendorModal
          vendor={selectedVendor}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedVendor && (
        <EditVendorModal
          vendor={selectedVendor}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => {
            fetchVendors();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default VendorTableComponent;