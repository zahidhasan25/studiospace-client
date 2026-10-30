"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";

function AddStudioContent() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = async (payload) => {
    setBusy(true);
    try {
      await apiFetch("/api/studios", { method: "POST", body: JSON.stringify(payload) });
      toast.success("Studio added successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message || "Could not add studio");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container section">
      <div className="form-card wide">
        <h2>Add New Studio</h2>
        <p className="muted">Share your creative space with photographers, filmmakers, podcasters and musicians.</p>
        <StudioForm onSubmit={submit} submitLabel="Add Studio" busy={busy} />
      </div>
    </div>
  );
}

export default function AddStudioPage() {
  return <PrivateRoute><AddStudioContent /></PrivateRoute>;
}
