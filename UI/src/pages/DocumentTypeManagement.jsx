import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getAllDocumentTypes,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    toggleMandatory
} from '../services/documentTypeService';

function DocumentTypeManagement() {
    const [documentTypes, setDocumentTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newType, setNewType] = useState({ 
        typeName: '', 
        description: '', // Add description to initial state
        mandatory: false 
      });
    const [editingType, setEditingType] = useState(null);

    useEffect(() => {
        fetchDocumentTypes();
    }, []);

    const fetchDocumentTypes = async () => {
        setLoading(true);
        try {
            const response = await getAllDocumentTypes();
            setDocumentTypes(response.data);
        } catch (error) {
            toast.error('Failed to fetch document types');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (editingType) {
            await updateDocumentType(editingType.typeId, {
              typeName: newType.typeName,
              description: newType.description, // Add description to update
              mandatory: newType.mandatory
            });
            toast.success('Document type updated successfully');
          } else {
            await createDocumentType({
              typeName: newType.typeName,
              description: newType.description, // Add description to create
              mandatory: newType.mandatory
            });
            toast.success('Document type created successfully');
          }
          setNewType({ typeName: '', description: '', mandatory: false }); // Reset with description
          setEditingType(null);
          fetchDocumentTypes();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Operation failed');
        }
      };

      const handleEdit = (type) => {
        setEditingType(type);
        setNewType({ 
          typeName: type.typeName, 
          description: type.description, // Add description when editing
          mandatory: type.mandatory 
        });
      };

    const handleDelete = async (typeId) => {
        if (window.confirm('Are you sure you want to delete this document type?')) {
            try {
                await deleteDocumentType(typeId);
                toast.success('Document type deleted successfully');
                fetchDocumentTypes();
            } catch (error) {
                toast.error('Failed to delete document type');
            }
        }
    };

    const handleToggleMandatory = async (typeId, currentMandatory) => {
        try {
            await updateDocumentType(typeId, {
                mandatory: !currentMandatory
            });
            toast.success('Mandatory status updated successfully');
            fetchDocumentTypes();
        } catch (error) {
            console.error('Toggle mandatory error:', error.response?.data || error);
            toast.error(error.response?.data?.message || 'Failed to toggle mandatory status');
        }
    };
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Document Type Management</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Document Type Name"
                            value={newType.typeName}
                            onChange={(e) => setNewType({ ...newType, typeName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={newType.description}
                            onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="mandatoryCheck"
                                checked={newType.mandatory}
                                onChange={(e) => setNewType({ ...newType, mandatory: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="mandatoryCheck">
                                Mandatory
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary">
                            {editingType ? 'Update' : 'Add'} Document Type
                        </button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th> {/* Add description column */}
                            <th>Mandatory</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentTypes.map((type) => (
                            <tr key={type.typeId}>
                                <td>{type.typeName}</td>
                                <td>{type.description}</td> {/* Add description cell */}
                                <td>
                                    <button
                                        className={`btn btn-sm ${type.mandatory ? 'btn-success' : 'btn-secondary'}`}
                                        onClick={() => handleToggleMandatory(type.typeId, type.mandatory)}
                                    >
                                        {type.mandatory ? 'Yes' : 'No'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(type)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(type.typeId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DocumentTypeManagement;