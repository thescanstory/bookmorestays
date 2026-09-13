"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Mail, Phone, Calendar, User, MoreVertical, CheckCircle, XCircle, MessageSquare, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'booked' | 'cancelled';

interface Inquiry {
    id: string;
    property_id: string;
    user_id: string | null;
    guest_name: string;
    guest_email: string;
    guest_phone: string | null;
    check_in: string;
    check_out: string;
    guests: number;
    message: string | null;
    status: InquiryStatus;
    quoted_price: number | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    property_name?: string;
    property_city?: string;
}

const statusConfig: Record<InquiryStatus, { label: string; color: string; icon: React.ReactNode }> = {
    new: { label: 'New', color: 'bg-blue-100 text-blue-800', icon: <MessageSquare className="w-4 h-4" /> },
    contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-800', icon: <Phone className="w-4 h-4" /> },
    quoted: { label: 'Quoted', color: 'bg-purple-100 text-purple-800', icon: <DollarSign className="w-4 h-4" /> },
    booked: { label: 'Booked', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
};

const statusOrder: InquiryStatus[] = ['new', 'contacted', 'quoted', 'booked', 'cancelled'];

export default function InquiriesAdmin() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [showQuoteModal, setShowQuoteModal] = useState<{ inquiry: Inquiry | null }>({ inquiry: null });

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error('Failed to fetch inquiries');
            console.error(error);
        } else if (data) {
            // Fetch property names for valid UUID properties
            const propertyIds = Array.from(new Set(data.map(i => i.property_id).filter(id => typeof id === 'string' && id.length === 36)));
            let propertyMap: Record<string, { name: string; city: string }> = {};

            if (propertyIds.length > 0) {
                const { data: properties } = await supabase
                    .from('properties')
                    .select('id, name, city')
                    .in('id', propertyIds);

                if (properties) {
                    propertyMap = properties.reduce((acc, p) => {
                        acc[p.id] = { name: p.name, city: p.city };
                        return acc;
                    }, {} as Record<string, { name: string; city: string }>);
                }
            }

            setInquiries(data.map(i => ({
                ...i,
                property_name: propertyMap[i.property_id]?.name,
                property_city: propertyMap[i.property_id]?.city
            })));
        }
        setLoading(false);
    };

    const updateStatus = async (inquiryId: string, newStatus: InquiryStatus, quotedPrice?: number, adminNotes?: string) => {
        setUpdatingId(inquiryId);
        try {
            const updates: Record<string, unknown> = {
                status: newStatus,
                updated_at: new Date().toISOString()
            };

            if (quotedPrice !== undefined) updates.quoted_price = quotedPrice;
            if (adminNotes !== undefined) updates.admin_notes = adminNotes;

            const { error } = await supabase
                .from('inquiries')
                .update(updates)
                .eq('id', inquiryId);

            if (error) throw error;

            setInquiries(prev => prev.map(i =>
                i.id === inquiryId ? { ...i, status: newStatus, quoted_price: quotedPrice ?? i.quoted_price, admin_notes: adminNotes ?? i.admin_notes, updated_at: new Date().toISOString() } : i
            ));

            toast.success(`Inquiry marked as ${statusConfig[newStatus].label.toLowerCase()}`);
            setShowQuoteModal({ inquiry: null });
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStatusClick = (inquiry: Inquiry, newStatus: InquiryStatus) => {
        if (newStatus === 'quoted') {
            setShowQuoteModal({ inquiry });
        } else {
            updateStatus(inquiry.id, newStatus);
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

    const formatStayDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1c2434] tracking-tight">Booking Inquiries</h1>
                        <p className="mt-1 text-[#94a3b8] font-medium text-sm">Manage guest inquiries and bookings</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">No inquiries yet</h3>
                        <p className="text-gray-500 mt-2">Guest inquiries will appear here when users submit booking requests.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {inquiries.map((inquiry, i) => (
                            <motion.div
                                key={inquiry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-gray-50 rounded-2xl border border-gray-100 p-5 sm:p-6 transition-shadow hover:shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    {/* Inquiry Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-[#1c2434] truncate">{inquiry.property_name || 'Unknown Property'}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[inquiry.status].color} flex items-center gap-1`}>
                                                {statusConfig[inquiry.status].icon}
                                                {statusConfig[inquiry.status].label}
                                            </span>
                                        </div>

                                        {inquiry.property_city && (
                                            <p className="text-sm text-[#64748b] mb-3">{inquiry.property_city}</p>
                                        )}

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
                                            <div className="flex items-center gap-1 text-[#64748b]">
                                                <User className="w-3.5 h-3.5" />
                                                <span className="font-medium">{inquiry.guest_name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#64748b]">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="truncate">{inquiry.guest_email}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#64748b]">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatStayDate(inquiry.check_in)} - {formatStayDate(inquiry.check_out)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#64748b]">
                                                <User className="w-3.5 h-3.5" />
                                                <span>{inquiry.guests} guests</span>
                                            </div>
                                        </div>

                                        {inquiry.message && (
                                            <div className="p-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-700">
                                                <span className="font-semibold text-gray-900">Message:</span> {inquiry.message}
                                            </div>
                                        )}

                                        {inquiry.quoted_price && (
                                            <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-800">
                                                <span className="font-semibold">Quoted Price:</span> ₹{inquiry.quoted_price.toLocaleString('en-IN')}
                                            </div>
                                        )}

                                        {inquiry.admin_notes && (
                                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                                                <span className="font-semibold">Admin Notes:</span> {inquiry.admin_notes}
                                            </div>
                                        )}

                                        <p className="text-xs text-[#94a3b8] mt-2">Submitted: {formatDate(inquiry.created_at)}</p>
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
                                                        onClick={() => handleStatusClick(inquiry, status)}
                                                        disabled={updatingId === inquiry.id || inquiry.status === status}
                                                        className={`w-full px-4 py-2 text-left text-sm font-medium transition flex items-center gap-2 ${inquiry.status === status
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {statusConfig[status].icon}
                                                        {statusConfig[status].label}
                                                        {updatingId === inquiry.id && inquiry.status !== status && (
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

                {/* Quote Modal */}
                {showQuoteModal.inquiry && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Quote to Guest</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Enter the quoted price for <span className="font-semibold">{showQuoteModal.inquiry.guest_name}</span>:
                            </p>
                            <input
                                type="number"
                                id="quoted-price"
                                placeholder="e.g., 25000"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                            />
                            <textarea
                                id="quote-notes"
                                rows={3}
                                className="w-full mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                placeholder="Optional notes for the guest..."
                            />
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowQuoteModal({ inquiry: null })}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const price = parseInt((document.getElementById('quoted-price') as HTMLInputElement)?.value || '0');
                                        const notes = (document.getElementById('quote-notes') as HTMLTextAreaElement)?.value;
                                        if (price > 0) {
                                            updateStatus(showQuoteModal.inquiry!.id, 'quoted', price, notes || undefined);
                                        } else {
                                            toast.error('Please enter a valid price');
                                        }
                                    }}
                                    disabled={updatingId === showQuoteModal.inquiry?.id}
                                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50"
                                >
                                    {updatingId === showQuoteModal.inquiry?.id ? (
                                        <Loader2 className="animate-spin w-5 h-5 mx-auto" size={18} />
                                    ) : (
                                        'Send Quote'
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