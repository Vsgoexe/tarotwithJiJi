"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Edit2,
  Check,
  X,
  ArrowLeft,
  Plus,
  Shield,
  Clock,
  Video,
  FileText,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { AUTHORITATIVE_SERVICES, formatPriceINR, formatPriceUSD } from "@/lib/services";
import { Service } from "@/types/service";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(AUTHORITATIVE_SERVICES);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form edit state (prices displayed in standard units: Rupees & Dollars)
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editType, setEditType] = useState<"live" | "written">("live");
  const [editDuration, setEditDuration] = useState<number | "">("");
  const [editTurnaround, setEditTurnaround] = useState<number | "">("");
  const [editPriceRupees, setEditPriceRupees] = useState<number | "">("");
  const [editPriceDollars, setEditPriceDollars] = useState<number | "">("");
  const [editSortOrder, setEditSortOrder] = useState<number>(0);
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const startEdit = (service: Service) => {
    setEditingService(service);
    setEditName(service.name);
    setEditDesc(service.description);
    setEditType(service.type);
    setEditDuration(service.duration_minutes ?? "");
    setEditTurnaround(service.turnaround_hours ?? "");
    setEditPriceRupees(Math.round(service.price_inr / 100)); // paise -> rupees
    setEditPriceDollars(service.price_usd !== null ? Math.round(service.price_usd / 100) : ""); // cents -> dollars
    setEditSortOrder(service.sort_order);
    setEditIsActive(service.is_active);
    setSaveNotice(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const priceInPaise = Math.round(Number(editPriceRupees) * 100);
    const priceInCents =
      editPriceDollars === "" || editPriceDollars === null
        ? null
        : Math.round(Number(editPriceDollars) * 100);

    const updated: Service = {
      ...editingService,
      name: editName,
      description: editDesc,
      type: editType,
      duration_minutes: editType === "live" && editDuration !== "" ? Number(editDuration) : null,
      turnaround_hours: editType === "written" && editTurnaround !== "" ? Number(editTurnaround) : null,
      price_inr: priceInPaise,
      price_usd: priceInCents,
      sort_order: Number(editSortOrder),
      is_active: editIsActive,
    };

    setServices((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)).sort((a, b) => a.sort_order - b.sort_order)
    );

    setSaveNotice(`Saved changes for "${updated.name}" (${priceInPaise} paise).`);
    setEditingService(null);

    setTimeout(() => setSaveNotice(null), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Header />

      <main className="flex-grow pt-28 sm:pt-36 pb-24">
        <Container className="max-w-6xl space-y-10">
          {/* Admin Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blush-300 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-wine-600">
                <Shield strokeWidth={1.25} className="w-4 h-4" />
                <span>Admin Sanctuary</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
                Services & Pricing Catalog
              </h1>
              <p className="text-ink-soft text-sm">
                Manage the 7 authoritative services, configure INR/USD pricing, and oversee delivery rules.
              </p>
            </div>

            <Button href="/" variant="outline" size="sm">
              <ArrowLeft strokeWidth={1.25} className="w-4 h-4 mr-1.5" />
              Return to Site
            </Button>
          </div>

          {saveNotice && (
            <div className="p-4 rounded-xl bg-blush-100 border border-wine-600 text-sm text-wine-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check strokeWidth={2} className="w-4 h-4 text-wine-600" />
                <span>{saveNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveNotice(null)}
                className="text-ink-soft hover:text-ink text-xs uppercase"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Services Table */}
          <Card className="p-0 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-blush-100/70 border-b border-blush-300 text-xs uppercase tracking-wider text-ink font-semibold">
                  <tr>
                    <th className="px-5 py-4">Sort</th>
                    <th className="px-5 py-4">Name & Slug</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Price (INR)</th>
                    <th className="px-5 py-4">Price (USD)</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush-300/80">
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-blush-100/30 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-ink-soft text-xs">
                        #{service.sort_order}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-serif text-base text-ink font-medium">
                          {service.name}
                        </div>
                        <div className="font-mono text-xs text-ink-soft">
                          {service.slug}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-ivory border border-blush-300 text-wine-600">
                          {service.type === "live" ? (
                            <>
                              <Video strokeWidth={1.25} className="w-3 h-3" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <FileText strokeWidth={1.25} className="w-3 h-3" />
                              <span>Written</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        {service.duration_minutes
                          ? `${service.duration_minutes} min`
                          : "Written"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-serif text-base text-ink font-semibold">
                          {formatPriceINR(service.price_inr)}
                        </div>
                        <div className="text-[11px] font-mono text-ink-soft">
                          {service.price_inr} paise
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {service.price_usd !== null ? (
                          <span className="font-serif text-base text-ink font-medium">
                            {formatPriceUSD(service.price_usd)}
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-medium">
                            <AlertTriangle strokeWidth={1.5} className="w-3 h-3 text-amber-600" />
                            <span>USD price not set</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            service.is_active
                              ? "bg-blush-100 text-wine-700 border border-blush-300"
                              : "bg-paper text-ink-soft border border-blush-300"
                          }`}
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => startEdit(service)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blush-300 bg-ivory hover:bg-blush-100 text-ink text-xs font-medium transition-colors"
                        >
                          <Edit2 strokeWidth={1.25} className="w-3.5 h-3.5 text-wine-600" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Edit Modal / Drawer */}
          {editingService && (
            <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
              <div
                className="bg-ivory border border-blush-300 rounded-[24px] max-w-xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between border-b border-blush-300 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-ink font-medium">
                      Edit Service: {editingService.name}
                    </h3>
                    <span className="font-mono text-xs text-ink-soft">
                      Slug: {editingService.slug}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="p-1 rounded-md text-ink-soft hover:text-ink"
                  >
                    <X strokeWidth={1.5} className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <Input
                    label="Service Name"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <Textarea
                    label="Description"
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Delivery Type"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as "live" | "written")}
                    >
                      <option value="live">Live Reading</option>
                      <option value="written">Written Reading</option>
                    </Select>

                    {editType === "live" ? (
                      <Input
                        label="Duration (Minutes)"
                        type="number"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value ? Number(e.target.value) : "")}
                      />
                    ) : (
                      <Input
                        label="Turnaround (Hours)"
                        type="number"
                        value={editTurnaround}
                        onChange={(e) => setEditTurnaround(e.target.value ? Number(e.target.value) : "")}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Price in INR (₹ Rupees)"
                      type="number"
                      required
                      helperText="Saved as paise (Rupees x 100)"
                      value={editPriceRupees}
                      onChange={(e) => setEditPriceRupees(e.target.value ? Number(e.target.value) : "")}
                    />

                    <Input
                      label="Price in USD ($ Dollars)"
                      type="number"
                      helperText="Leave blank for null"
                      placeholder="e.g. 35"
                      value={editPriceDollars}
                      onChange={(e) => setEditPriceDollars(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Sort Order"
                      type="number"
                      value={editSortOrder}
                      onChange={(e) => setEditSortOrder(Number(e.target.value))}
                    />

                    <div className="space-y-1.5 text-left">
                      <label className="block text-sm font-medium text-ink tracking-wide">
                        Visibility
                      </label>
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is-active"
                          checked={editIsActive}
                          onChange={(e) => setEditIsActive(e.target.checked)}
                          className="w-4 h-4 text-wine-600 rounded border-blush-300"
                        />
                        <label htmlFor="is-active" className="text-sm text-ink">
                          Active & Visible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blush-300 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingService(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
