import { documentsResponseSchema } from "../schema";
import { APIError, BASE_URL } from "./common";

export async function getAllDocumentIds(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/ids`);
  if (!response.ok) {
    throw new APIError(response.status, "Failed to fetch document IDs");
  }
  return response.json();
}

export async function getDocuments(ids: string[]) {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("ids", id));

  const response = await fetch(`${BASE_URL}/documents?${params}`);
  if (!response.ok) {
    throw new APIError(response.status, "Failed to fetch documents");
  }
  const json = await response.json();
  const safeParseResult = documentsResponseSchema.safeParse(json);
  if (!safeParseResult.success) {
    throw new APIError(
      422,
      `Invalid document IDs: ${safeParseResult.error.errors.join(", ")}`,
    );
  }

  return safeParseResult.data;
}

export async function deleteDocument(id: string) {
  const response = await fetch(`${BASE_URL}/documents`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([id]),
  });

  if (!response.ok) {
    throw new APIError(response.status, "Failed to delete document");
  }

  return response.json();
}
