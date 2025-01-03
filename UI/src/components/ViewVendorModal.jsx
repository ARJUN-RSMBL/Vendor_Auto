import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ViewVendorModal({ vendor, onClose }) {
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Vendor Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="vendor-details">
          <div className="mb-3">
            <strong>ID:</strong> #{vendor.id}
          </div>
          <div className="mb-3">
            <strong>Name:</strong> {vendor.name}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {vendor.email}
          </div>
          <div className="mb-3">
            <strong>License:</strong> {vendor.vendorLicense}
          </div>
          <div className="mb-3">
            <strong>Expiry Date:</strong> {new Date(vendor.expiryDate).toLocaleDateString()}
          </div>
          <div className="mb-3">
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${vendor.status.toLowerCase()}`}>
              {vendor.status}
            </span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewVendorModal;