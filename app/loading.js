import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="container section">
      <div className="skeleton" style={{ height: 36, width: "40%", marginBottom: 24 }} />
      <Skeleton count={6} />
    </div>
  );
}
