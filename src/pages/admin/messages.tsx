// src/pages/Messages.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase/firebase';
import axios from 'axios';

type Inquiry = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    property: string;
    inquiryType: string;
    awareness: string;
    message: string;
    createdAt: any;
};

const Messages = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
            } else {
                fetchInquiries();
            }
            setAuthLoading(false);
        });

        return () => unsub();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await axios.get('/api/inquiry');
            setInquiries(response.data);
        } catch (err) {
            console.error('Error fetching inquiries:', err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <p>Checking authentication...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">Submitted Inquiries</h1>
            {loading ? (
                <p>Loading...</p>
            ) : inquiries.length === 0 ? (
                <p>No inquiries found.</p>
            ) : (
                <div className="grid gap-4">
                    {inquiries.map((inq) => (
                        <div key={inq.id} className="border rounded-lg p-4 shadow bg-white">
                            <h2 className="text-xl font-medium">
                                {inq.firstName} {inq.lastName}
                            </h2>
                            <p><strong>Email:</strong> {inq.email}</p>
                            <p><strong>Phone:</strong> {inq.phone}</p>
                            <p><strong>Country:</strong> {inq.country}</p>
                            <p><strong>Property:</strong> {inq.property}</p>
                            <p><strong>Type:</strong> {inq.inquiryType}</p>
                            <p><strong>Awareness:</strong> {inq.awareness}</p>
                            <p><strong>Message:</strong> {inq.message}</p>
                            <p className="text-sm text-gray-500">
                                Submitted: {inq.createdAt?.toDate?.().toLocaleString() || 'N/A'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
