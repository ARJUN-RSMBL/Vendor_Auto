import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ViewVendorModal from '../components/ViewVendorModal';
import EditVendorModal from '../components/EditVendorModal';
import vendorService from '../services/vendorService';
import { toast } from 'react-toastify';
import '../styles/TableStyles.css';

function VendorTableComponent() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getAllVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
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
        await vendorService.deleteVendor(id);
        toast.success('Vendor deleted successfully');
        fetchVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
        toast.error('Failed to delete vendor');
      }
    }
  };

  return (
    <div className="vendor-container">
      <div className="vendor-header">
        <h2>Vendor Details</h2>
        <button className="refresh-button" onClick={fetchVendors}>
          <i className="bi bi-arrow-clockwise"></i>
          Refresh
        </button>
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
                <td>{new Date(vendor.expiryDate).toLocaleDateString()}</td>
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