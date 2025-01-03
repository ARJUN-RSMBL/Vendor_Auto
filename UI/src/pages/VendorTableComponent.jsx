import React, { useEffect, useState } from 'react'
import "../styles/TableStyles.css"
import vendorService from '../services/vendorService'
function VendorTableComponent() {

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getAllVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };
  return (
    <div className="vendor-container">
      <div className="vendor-header">
        <h2>Vendor Details</h2>
        <button className="refresh-button" onClick={fetchVendors}>
          <i className="fas fa-sync"></i> Refresh
        </button>
      </div>

      {vendors.length === 0 ? (
        <div className="no-data">
          <p>No vendors found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>#{vendor.id}</td>
                  <td>{vendor.name}</td>
                  <td>
                    <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
                  </td>
                  <td>{new Date(vendor.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${vendor.status.toLowerCase()}`}>
                      {vendor.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default VendorTableComponent