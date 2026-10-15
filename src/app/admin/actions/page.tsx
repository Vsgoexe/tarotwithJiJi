"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { formatPriceINR } from "@/lib/services";

function ActionConfirmationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg("No action token was provided in the link.");
      setLoading(false);
      return;
    }

    fetch(`/api/admin/actions/validate?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid) {
          if (data.alreadyUsed) {
            setErrorMsg(`This single-use action link has already been used on ${new Date(data.usedAt).toLocaleString()}.`);
          } else if (data.expired) {
            setErrorMsg("This action link has expired (72-hour limit). Please manage orders in the admin dashboard.");
          } else {
            setErrorMsg(data.error || "Invalid or unrecognized action link.");
          }
        } else {
          setTokenData(data);
        }
      })
      .catch((err) => {
        console.error("Token validation error:", err);
        setErrorMsg("Failed to validate action link.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleExecuteAction = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          rejectionReason: tokenData?.action === "reject" ? rejectionReason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to execute action.");
      }

      setCompletedResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred executing this action.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36 pb-24">
        <Container className="max-w-xl pt-6">
          <Card className="p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-wine-600 uppercase tracking-widest border-b border-blush-300 pb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Owner Security Confirmation</span>
            </div>

            {loading && (
              <div className="py-12 text-center space-y-3 font-serif">
                <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-sans text-ink-soft">Validating secure token...</p>
              </div>
            )}

            {!loading && errorMsg && (
              <div className="text-center space-y-4 py-6">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-2xl text-ink">Action Link Expired or Used</h2>
                <p className="text-sm text-ink-soft">{errorMsg}</p>
                <div className="pt-4 flex justify-center gap-4">
                  <Button href="/admin" variant="primary">
                    Open Admin Sanctuary
                  </Button>
                  <Button href="/" variant="outline">
                    Home
                  </Button>
                </div>
              </div>
            )}

            {!loading && completedResult && (
              <div className="text-center space-y-4 py-6">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-800 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h2 className="font-serif text-3xl text-ink">
                  {completedResult.action === "approved" ? "Payment Approved & Confirmed" : "Payment Marked Rejected"}
                </h2>
                <p className="text-sm text-ink-soft">{completedResult.message}</p>
                <div className="pt-4 flex justify-center gap-4">
                  <Button href={`/order/${completedResult.publicId}`} variant="primary">
                    View Order Sanctuary
                  </Button>
                  <Button href="/admin" variant="outline">
                    Admin Dashboard
                  </Button>
                </div>
              </div>
            )}

            {!loading && !errorMsg && !completedResult && tokenData && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-serif text-3xl text-ink font-medium">
                    {tokenData.action === "approve" ? "Confirm Payment Approval" : "Confirm Payment Rejection"}
                  </h2>
                  <p className="text-sm text-ink-soft">
                    This single-use confirmation ensures email link scanners do not alter order state.
                  </p>
                </div>

                <div className="bg-blush-100/50 p-5 rounded-2xl border border-blush-300 text-sm space-y-3">
                  <div className="flex justify-between border-b border-blush-300 pb-2">
                    <span className="text-ink-soft">Order Reference:</span>
                    <span className="font-mono text-xs font-semibold text-ink">{tokenData.order.public_id}</span>
                  </div>
                  <div className="flex justify-between border-b border-blush-300 pb-2">
                    <span className="text-ink-soft">Seeker Name:</span>
                    <strong className="text-ink">{tokenData.order.customer_name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-blush-300 pb-2">
                    <span className="text-ink-soft">Service:</span>
                    <span className="font-serif text-base text-ink">{tokenData.order.service_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-blush-300 pb-2">
                    <span className="text-ink-soft">Expected Amount:</span>
                    <strong className="text-wine-600 font-serif text-base">{formatPriceINR(tokenData.order.amount)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Submitted UTR:</span>
                    <span className="font-mono text-xs font-bold text-wine-600 bg-ivory px-2 py-0.5 rounded border border-blush-300">
                      {tokenData.order.utr}
                    </span>
                  </div>
                </div>

                {tokenData.action === "reject" && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                      Rejection Reason (included in email to seeker):
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. UTR transaction did not match bank credit record. Please re-check."
                      className="w-full p-3 text-sm rounded-xl border border-blush-300 bg-ivory focus:outline-wine-600"
                      rows={3}
                    />
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleExecuteAction}
                    disabled={isSubmitting}
                    variant={tokenData.action === "approve" ? "primary" : "outline"}
                    className="flex-1"
                  >
                    {isSubmitting
                      ? "Executing..."
                      : tokenData.action === "approve"
                      ? "Confirm & Approve Booking"
                      : "Confirm & Mark Rejected"}
                  </Button>
                  <Button href="/admin" variant="outline" disabled={isSubmitting}>
                    Open Admin
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function ActionConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center font-serif">Loading...</div>}>
      <ActionConfirmationContent />
    </Suspense>
  );
}
