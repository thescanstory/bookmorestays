/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, CheckCircle, XCircle, Clock, Truck, Package, MoreVertical, MessageSquare, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type TourRequestStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';

interface TourRequest {
    id: string;
    property_name: string;
    city: string | null;
    requested_by: string | null;
    status: TourRequestStatus;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    user_email?: string;
}

const statusConfig: Record<TourRequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
    approved: { label: 'Approved', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-4 h-4" /> },
    in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-4 h-4" /> },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: <Package className="w-4 h-4" /> },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
};

const statusOrder: TourRequestStatus[] = ['pending', 'approved', 'in_progress', 'completed', 'rejected'];

export default function TourRequestsAdmin() {
    const [requests, setRequests] = useState<TourRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [showNotesModal, setShowNotesModal] = useState<{ request: TourRequest | null; newStatus: TourRequestStatus }>({ request: null, newStatus: 'pending' });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const { data, error } = await supabase
            .from('tour_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error('Failed to fetch tour requests');
            console.error(error);
        } else if (data) {
            // Fetch user emails for requested_by
            const userIds = Array.from(new Set(data.map(r => r.requested_by).filter(Boolean)));
            let userEmails: Record<string, string> = {};

            if (userIds.length > 0) {
                try {
                    const { data: users } = await (supabase.auth as any).admin?.listUsers();
                    if (users?.users) {
                        userEmails = users.users.reduce((acc: Record<string, string>, u: any) => {
                            if (userIds.includes(u.id)) acc[u.id] = u.email || '';
                            return acc;
                        }, {} as Record<string, string>);
                    }
                } catch {
                    // Client anon key does not have admin listUsers access
                }
            }

            setRequests(data.map(r => ({ ...r, user_email: r.requested_by ? userEmails[r.requested_by] : null })));
        }
        setLoading(false);
    };

    const updateStatus = async (requestId: string, newStatus: TourRequestStatus, adminNotes?: string) => {
        setUpdatingId(requestId);
        try {
            const { error } = await supabase
                .from('tour_requests')
                .update({
                    status: newStatus,
                    admin_notes: adminNotes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', requestId);

            if (error) throw error;

            setRequests(prev => prev.map(r =>
                r.id === requestId ? { ...r, status: newStatus, admin_notes: adminNotes ?? null, updated_at: new Date().toISOString() } : r
            ));

            toast.success(`Request ${statusConfig[newStatus].label.toLowerCase()}`);

            // TODO: Send notification to user (email/push)
            if (adminNotes) {
                console.log('Would send notification with notes:', adminNotes);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
            setShowNotesModal({ request: null, newStatus: 'pending' });
        }
    };

    const handleStatusClick = (request: TourRequest, newStatus: TourRequestStatus) => {
        if (newStatus === 'rejected' || newStatus === 'approved') {
            setShowNotesModal({ request, newStatus });
        } else {
            updateStatus(request.id, newStatus);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1c2434] tracking-tight">Tour Requests</h1>
                        <p className="mt-1 text-[#94a3b8] font-medium text-sm">Manage cinematic tour requests from users</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">No tour requests yet</h3>
                        <p className="text-gray-500 mt-2">Users can request 4K cinematic tours from the property detail page.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request, i) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-gray-50 rounded-2xl border border-gray-100 p-5 sm:p-6 transition-shadow hover:shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    {/* Property Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-[#1c2434] truncate">{request.property_name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[request.status].color} flex items-center gap-1`}>
                                                {statusConfig[request.status].icon}
                                                {statusConfig[request.status].label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748b]">
                                            {request.city && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {request.city}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDate(request.created_at)}
                                            </span>
                                            {request.user_email && (
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {request.user_email}
                                                </span>
                                            )}
                                        </div>
                                        {request.admin_notes && (
                                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                                                <span className="font-semibold">Admin Notes:</span> {request.admin_notes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 sm:ml-4">
                                        <div className="relative">
                                            <button
                                                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                                                onClick={() => { }}
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-500" />
                                            </button>

                                            {/* Status Dropdown */}
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in-0 zoom-in-95">
                                                {statusOrder.map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusClick(request, status)}
                                                        disabled={updatingId === request.id || request.status === status}
                                                        className={`w-full px-4 py-2 text-left text-sm font-medium transition flex items-center gap-2 ${request.status === status
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {statusConfig[status].icon}
                                                        {statusConfig[status].label}
                                                        {updatingId === request.id && request.status !== status && (
                                                            <Loader2 className="animate-spin w-4 h-4 ml-auto" size={14} />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Notes Modal */}
                {showNotesModal.request && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {statusConfig[showNotesModal.newStatus].label} Request
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Add optional notes for the user (will be sent via notification):
                            </p>
                            <textarea
                                id="admin-notes"
                                rows={4}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                placeholder="e.g., Our team will contact you within 24 hours to schedule the shoot..."
                            />
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowNotesModal({ request: null, newStatus: 'pending' })}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const notes = (document.getElementById('admin-notes') as HTMLTextAreaElement)?.value;
                                        updateStatus(showNotesModal.request!.id, showNotesModal.newStatus, notes || undefined);
                                    }}
                                    disabled={updatingId === showNotesModal.request.id}
                                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50"
                                >
                                    {updatingId === showNotesModal.request.id ? (
                                        <Loader2 className="animate-spin w-5 h-5 mx-auto" size={18} />
                                    ) : (
                                        `Confirm ${statusConfig[showNotesModal.newStatus].label}`
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}