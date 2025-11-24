export async function getMedinatorResult(symptomText: string) {
  const res = await fetch("http://localhost:3001/api/medinator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptomDescription: symptomText }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Medinator result");
  }

  return res.json();
}
