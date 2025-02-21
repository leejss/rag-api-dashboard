import { queryResponseSchema } from "../schema";

const BASE_URL = "http://127.0.0.1:8000";

interface QuerySingleRequest {
  query: string;
  file_id: string;
  k: number;
  entity_id?: string;
}

interface QueryMultipleRequest {
  query: string;
  file_ids: string[];
  k: number;
}

interface QueryResponse {
  documents: Array<{
    content: string;
    similarity: number;
  }>;
}

export async function querySingle(data: QuerySingleRequest) {
  const response = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Query failed: ${response.statusText}`);
  }

  const json = await response.json();
  const safeParseResult = queryResponseSchema.safeParse(json);
  if (!safeParseResult.success) {
    throw new Error(
      `Invalid query response: ${safeParseResult.error.errors.join(", ")}`,
    );
  }

  return safeParseResult.data;
}

export async function queryMultiple(
  data: QueryMultipleRequest,
): Promise<QueryResponse> {
  const response = await fetch(`${BASE_URL}/query_multiple`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No documents found");
    }
    throw new Error(`Query failed: ${response.statusText}`);
  }

  return response.json();
}
