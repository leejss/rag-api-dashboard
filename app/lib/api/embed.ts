import { BASE_URL, APIError } from "./common";

export async function embedDocument(formData: FormData) {
  const response = await fetch(`${BASE_URL}/embed`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new APIError(
      response.status,
      response.status === 404 ? "File not found" : "Failed to embed document",
    );
  }
  return response.json();
}

export async function embedLocalDocument(data: {
  filepath: string;
  filename: string;
  file_id: string;
  file_content_type: string;
  entity_id?: string;
}) {
  const response = await fetch(
    `${BASE_URL}/local/embed${
      data.entity_id ? `?entity_id=${data.entity_id}` : ""
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new APIError(
      response.status,
      response.status === 404
        ? "File not found"
        : "Failed to embed local document",
    );
  }
  return response.json();
}
