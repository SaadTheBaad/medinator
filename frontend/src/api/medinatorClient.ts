const API_BASE =
  import.meta.env.VITE_MEDINATOR_API_BASE || "http://localhost:3001";

export async function getMedinatorResult(symptomText: string) {
  const res = await fetch(`${API_BASE}/api/medinator`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptomDescription: symptomText }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Medinator result (status ${res.status})`);
  }

  return res.json();
}