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
    <div>
      <h2>Vendor Details</h2>
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
          {vendors.map((vendors) => (
            <tr key={vendors.id}>
              <td>{vendors.id}</td>
              <td>{vendors.name}</td>
              <td>{vendors.email}</td>
              <td>{vendors.expiryDate}</td>
              <td>{vendors.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VendorTableComponent