"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  RefreshCw,
  ExternalLink,
  Shield,
  Eye,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { formatPriceINR } from "@/lib/services";

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("awaiting_verification");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${statusFilter}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleAction = async (orderId: string, action: "approve" | "reject") => {
    let rejectionReason: string | undefined = undefined;
    if (action === "reject") {
      const reasonInput = prompt("Enter reason for rejection (sent to seeker):", "UTR transaction ID could not be matched with bank deposit.");
      if (reasonInput === null) return; // user cancelled
      rejectionReason = reasonInput;
    }

    setProcessingId(orderId);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action, rejectionReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Action failed.");
      }

      setNotice(
        action === "approve"
          ? "Booking payment verified and confirmed. Customer notified by email."
          : "Booking payment marked rejected. Customer notified with retry link."
      );

      // Refresh list
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || "Failed to execute action");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q) ||
      o.utr?.toLowerCase().includes(q) ||
      o.public_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36 pb-24">
        <Container className="max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blush-300 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-wine-600 uppercase tracking-widest bg-blush-100 px-3 py-1 rounded-full border border-blush-300 mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Sanctuary Reader Portal</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
                Order & Payment Verification
              </h1>
              <p className="text-ink-soft text-sm">
                Review incoming UPI payments, check 12-digit UTR numbers, and approve or reject consultations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button href="/admin/services" variant="outline" size="sm">
                Manage Services
              </Button>
              <Button onClick={fetchOrders} variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {notice && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-300 text-green-900 text-sm font-medium flex items-center justify-between">
              <span>{notice}</span>
              <button onClick={() => setNotice(null)} className="text-xs text-green-700 underline">Dismiss</button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ivory p-4 rounded-2xl border border-blush-300">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
              {[
                { id: "awaiting_verification", label: "Awaiting Verification" },
                { id: "pending_payment", label: "Pending Payment" },
                { id: "confirmed", label: "Confirmed" },
                { id: "rejected", label: "Rejected" },
                { id: "all", label: "All Orders" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-wine-600 text-ivory font-semibold shadow-xs"
                      : "bg-paper text-ink-soft hover:text-ink border border-blush-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search seeker, email, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-blush-300 bg-paper focus:outline-wine-600"
              />
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="py-20 text-center space-y-3 font-serif">
              <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-sans text-ink-soft">Loading sanctuary orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-ivory rounded-2xl border border-blush-300 space-y-2">
              <Clock className="w-8 h-8 text-ink-soft mx-auto" />
              <h3 className="font-serif text-xl text-ink font-medium">No Orders Found</h3>
              <p className="text-sm text-ink-soft">
                There are no bookings matching status &quot;{statusFilter}&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isAwaiting = order.status === "awaiting_verification";
                const isConfirmed = order.status === "confirmed" || order.status === "paid";
                const isProcessing = processingId === order.id;

                return (
                  <Card key={order.id} className="p-6 transition-all hover:border-rose-400">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Customer & Service info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-ink-soft bg-paper px-2 py-0.5 rounded border border-blush-300">
                            {order.public_id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isConfirmed
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : isAwaiting
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : order.status === "rejected"
                                ? "bg-rose-100 text-wine-700 border border-rose-300"
                                : "bg-paper text-ink-soft border border-blush-300"
                            }`}
                          >
                            {order.status.replace("_", " ").toUpperCase()}
                          </span>
                          <span className="text-xs text-ink-soft">
                            {new Date(order.created_at).toLocaleDateString()} at{" "}
                            {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-serif text-xl text-ink font-medium">
                            {order.customer_name} &bull;{" "}
                            <span className="font-sans text-sm text-ink-soft font-normal">{order.customer_email}</span>
                            {order.customer_phone && (
                              <span className="font-sans text-xs text-ink-soft ml-2">({order.customer_phone})</span>
                            )}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-ink-soft pt-1">
                            <span>Service: <strong className="text-ink">{order.service_name}</strong></span>
                            {order.contact_mode && (
                              <span>Mode: <strong className="text-wine-600 uppercase">{order.contact_mode}</strong></span>
                            )}
                            <span>Expected: <strong className="text-wine-600 font-serif text-sm">{formatPriceINR(order.amount)}</strong></span>
                          </div>
                        </div>

                        {order.question && (
                          <p className="p-3 bg-paper rounded-xl text-xs text-ink-soft italic border border-blush-300">
                            &quot;{order.question}&quot;
                          </p>
                        )}
                      </div>

                      {/* Right: UTR display and Action buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 min-w-[240px]">
                        {/* UTR Box */}
                        <div className="w-full bg-blush-100/60 p-3 rounded-xl border border-blush-300 text-right">
                          <span className="text-[11px] uppercase tracking-wider text-ink-soft block font-semibold">
                            Submitted UTR
                          </span>
                          {order.utr ? (
                            <span className="font-mono text-base font-bold text-wine-700 tracking-wider">
                              {order.utr}
                            </span>
                          ) : (
                            <span className="text-xs text-ink-soft italic">No UTR submitted yet</span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 w-full justify-end pt-1">
                          <Link
                            href={`/order/${order.public_id}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-paper border border-blush-300 text-ink-soft hover:text-wine-600 text-xs inline-flex items-center gap-1"
                            title="View Seeker Private Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {isAwaiting && (
                            <>
                              <button
                                onClick={() => handleAction(order.id, "reject")}
                                disabled={isProcessing}
                                className="px-3 py-1.5 rounded-full bg-paper border border-rose-300 text-wine-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleAction(order.id, "approve")}
                                disabled={isProcessing}
                                className="px-4 py-1.5 rounded-full bg-wine-600 text-ivory hover:bg-wine-700 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                              >
                                {isProcessing ? "Approving..." : "Approve Payment"}
                              </button>
                            </>
                          )}

                          {!isAwaiting && !isConfirmed && order.status === "pending_payment" && (
                            <button
                              onClick={() => handleAction(order.id, "approve")}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-full bg-wine-600 text-ivory hover:bg-wine-700 text-xs font-semibold cursor-pointer"
                            >
                              Manual Approve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
