"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import { Spinner } from "@/components/Skeleton";

function EditContent({ id }) {
  const router = useRouter();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch(`/api/studios/${id}`)
      .then((data) => setStudio(data.studio || data))
      .catch((err) => toast.error(err.message || "Could not load studio"))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (payload) => {
    setBusy(true);
    try {
      await apiFetch(`/api/studios/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message || "Could not update studio");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="container section"><Spinner /></div>;
  if (!studio) return <div className="container section"><div className="empty"><h3>Studio not found</h3></div></div>;

  return (
    <div className="container section">
      <div className="form-card wide">
        <h2>Update Studio</h2>
        <p className="muted">Update the details below. Host name and email are read-only.</p>
        <StudioForm initial={studio} onSubmit={submit} submitLabel="Update Studio" busy={busy} />
      </div>
    </div>
  );
}

export default function EditStudioPage({ params }) {
  const id = params.id;
  return <PrivateRoute><EditContent id={id} /></PrivateRoute>;
}
