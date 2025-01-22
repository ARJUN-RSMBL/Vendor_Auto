import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { getVendorDocuments, getDocument } from '../services/vendorDocumentService';
import { hasVendorAccess, isAdminUser } from '../services/authService';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import '../styles/TableStyles.css';

function VendorDocumentsComponent() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // Add error state
    const [groupedDocuments, setGroupedDocuments] = useState({});

    useEffect(() => {
        if (hasVendorAccess()) {
            fetchDocuments();
        }
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getVendorDocuments();
            
            // Even if the request returns 404, we'll just treat it as empty documents
            if (response?.data) {
                const docs = Array.isArray(response.data) ? response.data : [];
                
                if (isAdminUser()) {
                    const grouped = docs.reduce((acc, doc) => {
                        const vendorName = doc.vendorName || 'Unknown Vendor';
                        if (!acc[vendorName]) {
                            acc[vendorName] = [];
                        }
                        acc[vendorName].push(doc);
                        return acc;
                    }, {});
                    setGroupedDocuments(grouped);
                } else {
                    setDocuments(docs);
                }
            } else {
                // If no data or 404 response, just set empty arrays
                setDocuments([]);
                setGroupedDocuments({});
            }
        } catch (error) {
            // Don't show error message for 404 responses
            if (error.response?.status === 404) {
                setDocuments([]);
                setGroupedDocuments({});
            } else {
                console.error('Error fetching documents:', error);
                setError('Unable to fetch documents. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (documentId, fileName) => {
        try {
            const response = await getDocument(documentId);

            // Check if response has data and it's a valid blob
            if (!response?.data || !(response.data instanceof Blob)) {
                throw new Error('Invalid document data received');
            }

            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            // Clean up the URL object
            window.URL.revokeObjectURL(url);

            toast.success('Document downloaded successfully');
        } catch (error) {
            console.error('Error downloading document:', error);
            const errorMessage = error.response?.status === 500
                ? 'Server error occurred while downloading the document. Please try again later.'
                : 'Failed to download document. Please try again.';
            toast.error(errorMessage);
        }
    };

    if (!hasVendorAccess()) {
        return <Navigate to="/login" replace />;
    }

    const renderDocumentsTable = (docs) => (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Document ID</th>
                    {isAdminUser() && <th>Vendor Name</th>}
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>Upload Date</th>
                    <th>Expiry Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {docs.map((doc) => (
                    <tr key={doc.id}>
                        <td>#{doc.id}</td>
                        {isAdminUser() && <td>{doc.vendorName}</td>}
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
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }

        const EmptyStateMessage = () => (
            <div className="text-center p-5 bg-light rounded shadow-sm">
                <i className="bi bi-cloud-upload text-primary" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-primary">No Documents Yet</h4>
                <p className="text-muted">No documents have been uploaded yet.</p>
                <p className="text-muted">Please upload your required documents to get started.</p>
                <Button
                    variant="primary"
                    href="/form"
                    className="mt-3"
                >
                    <i className="bi bi-upload me-2"></i>
                    Upload Documents
                </Button>
            </div>
        );

        if (isAdminUser()) {
            // Admin view - grouped by vendor
            if (Object.keys(groupedDocuments).length === 0) {
                return <EmptyStateMessage />;
            }
            return Object.entries(groupedDocuments).map(([vendorName, vendorDocs]) => (
                <div key={vendorName} className="mb-4">
                    <h3 className="mb-3">{vendorName}</h3>
                    <div className="table-responsive">
                        {renderDocumentsTable(vendorDocs)}
                    </div>
                </div>
            ));
        } else {
            // Vendor view - single table
            return (
                <div className="table-responsive">
                    {documents.length > 0 ? (
                        renderDocumentsTable(documents)
                    ) : (
                        <EmptyStateMessage />
                    )}
                </div>
            );
        }
    };

    // if (!hasVendorAccess()) {
    //     return <Navigate to="/login" replace />;
    // }

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

            {renderContent()}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}

export default VendorDocumentsComponent;