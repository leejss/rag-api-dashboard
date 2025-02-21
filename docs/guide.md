# RAG API Documentation

## Base URL

<http://127.0.0.1:8000>

## Health Check

### GET /health

Check the health status of the service.

**Response**

```json
{
    "status": "UP"
}
```

## Document Management

### GET /ids

Retrieve all document IDs in the vector store.

**Response**

- `200`: List of document IDs

```json
["id1", "id2", "id3"]
```

### GET /documents

Retrieve documents by their IDs.

**Query Parameters**

- `ids`: List of document IDs to retrieve

**Response**

- `200`: List of documents
- `404`: One or more IDs not found

### DELETE /documents

Delete documents by their IDs.

**Request Body**

```json
["id1", "id2", "id3"]
```

**Response**

- `200`: Success message
- `404`: One or more IDs not found

## Document Processing

### POST /local/embed

Embed a local file into the vector store.

**Request Body**

```json
{
    "filepath": "string",
    "filename": "string",
    "file_id": "string",
    "file_content_type": "string"
}
```

**Query Parameters**

- `entity_id` (optional): Entity identifier

**Response**

- `200`: Success response with file details
- `404`: File not found
- `400`: Processing error

### POST /embed

Upload and embed a file into the vector store.

**Form Data**

- `file_id`: Document identifier
- `file`: File to upload
- `entity_id` (optional): Entity identifier

**Response**

- `200`: Success response with file details
- `400`: Processing error
- `500`: Server error

### POST /embed-upload

Alternative endpoint for file upload and embedding.

**Form Data**

- `file_id`: Document identifier
- `uploaded_file`: File to upload
- `entity_id` (optional): Entity identifier

**Response**

- `200`: Success response with file details
- `400`: Processing error
- `500`: Server error

## Query Operations

### POST /query

Query embeddings for a specific file.

**Request Body**

```json
{
    "query": "string",
    "file_id": "string",
    "k": number,
    "entity_id": "string" (optional)
}
```

**Response**

- `200`: List of relevant documents with similarity scores
- `500`: Query error

### POST /query_multiple

Query embeddings across multiple files.

**Request Body**

```json
{
    "query": "string",
    "file_ids": ["string"],
    "k": number
}
```

**Response**

- `200`: List of relevant documents with similarity scores
- `404`: No documents found
- `500`: Query error

### GET /documents/{id}/context

Load the context for a specific document.

**Path Parameters**

- `id`: Document identifier

**Response**

- `200`: Document context
- `404`: Document not found
- `400`: Processing error

## Supported File Types

The API supports various file formats including:

- PDF (`.pdf`)
- CSV (`.csv`)
- RST (`.rst`)
- XML (`.xml`)
- PowerPoint (`.pptx`)
- Markdown (`.md`)
- EPUB
- Word Documents (`.doc`, `.docx`)
- Excel (`.xls`, `.xlsx`)
- JSON (`.json`)
- Text files and other common source code extensions

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages in the response body. Common error responses include:

- `400`: Bad Request
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error
