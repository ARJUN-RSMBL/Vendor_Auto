import React, { useState, useEffect } from 'react'
import '../styles/FormStyles.css'
import vendorService from '../services/vendorService'
// import roleService from '../services/roleService'

function VendorFormComponent() {
  // Add state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expiryDate: '',
    roleId: ''
  })
  const [roles, setRoles] = useState([])

  // Fetch roles on component mount
  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const response = await roleService.getAllRoles()
      setRoles(response.data)
    } catch (error) {
      console.error('Error loading roles:', error)
    }
  }
  

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await vendorService.createEmployee(formData)
      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        expiryDate: '',
        roleId: ''
      })
      alert('Employee registered successfully!')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error registering employee')
    }
  }


  return (
    <div className="iqama-form-container">
      <h2 className="form-title">Employee Registration Form</h2>
      <form className="iqama-form" onSubmit={handleSubmit}>  {/* Add onSubmit handler here */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate" className="form-label">Expiry Date:</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {/* <div className="form-group">
          <label htmlFor="roleId" className="form-label">Role:</label>
          <select
            id="roleId"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select a Role</option>
            {roles && roles.length > 0 ? ( // Add conditional rendering
              roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                </option>
              ))
            ) : (
              <option value="" disabled>No roles available</option>
            )}
          </select>
        </div> */}

        <br />
        <button type="submit" className="form-button">Submit</button>
      </form>
      <br />
    </div>
  )
}

export default VendorFormComponent