import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { getVendorDocuments, getDocument } from '../services/vendorDocumentService';
import { hasVendorAccess } from '../services/authService';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import '../styles/TableStyles.css';

function VendorDocumentsComponent() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // Add error state

    useEffect(() => {
        if (hasVendorAccess()) {
            fetchDocuments();
        }
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);  // Clear any existing errors
            const response = await getVendorDocuments();

            if (response?.data) {
                setDocuments(Array.isArray(response.data) ? response.data : []);
            } else {
                setDocuments([]);
                setError('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setError(error.message || 'Failed to fetch documents');
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (documentId, fileName) => {
        try {
            const response = await getDocument(documentId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Document downloaded successfully');
        } catch (error) {
            console.error('Error downloading document:', error);
            toast.error('Failed to download document');
        }
    };

    if (!hasVendorAccess()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Vendor Documents</h2>
                <Button
                    variant="outline-primary"
                    onClick={fetchDocuments}
                    disabled={loading}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Document ID</th>
                                <th>Vendor Name</th>
                                <th>Document Type</th>
                                <th>File Name</th>
                                <th>Upload Date</th>
                                <th>Expiry Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>#{doc.id}</td>
                                    <td>{doc.vendorName}</td>
                                    <td>{doc.documentType}</td>
                                    <td>{doc.fileName}</td>
                                    <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                    <td>{new Date(doc.expiryDate).toLocaleDateString()}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleDownload(doc.id, doc.fileName)}
                                        >
                                            <i className="bi bi-download me-1"></i>
                                            Download
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {documents.length === 0 && (
                        <div className="text-center p-4 bg-light rounded">
                            <i className="bi bi-inbox fs-1 text-muted"></i>
                            <p className="mt-2 text-muted">No documents found.</p>
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}

export default VendorDocumentsComponent;