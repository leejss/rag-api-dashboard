import { z } from "zod";

export const embedDocumentSchema = z.object({
  file_id: z.string().min(1, { message: "File ID is required" }),
  entity_id: z.string().optional(),
});

export const documentIdsSchema = z.array(z.string());

const documentMetadataSchema = z.object({
  file_id: z.string().optional(),
  user_id: z.string().optional(),
  digest: z.string().optional(),
  source: z.string().optional(),
  page: z.number().optional(),
});

export const documentSchema = z.object({
  page_content: z.string(),
  metadata: documentMetadataSchema,
  type: z.string().optional(),
  id: z.string().optional().nullable(),
});

export const documentsResponseSchema = z.array(documentSchema);

const documentWithScoreSchema = z.tuple([documentSchema, z.number()]);

export const queryResponseSchema = z.array(documentWithScoreSchema);

export type EmbedDocumentRequest = z.infer<typeof embedDocumentSchema>;
export type DocumentIdsRequest = z.infer<typeof documentIdsSchema>;
export type DocumentResponse = z.infer<typeof documentSchema>;
