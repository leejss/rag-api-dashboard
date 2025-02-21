import { useState } from "react";
import { cn } from "../lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { embedDocument } from "~/lib/api/embed";
import { nanoid } from "nanoid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Upload } from "lucide-react";

export function meta() {
  return [
    { title: "Document Embedding Dashboard" },
    { name: "description", content: "Upload and embed documents" },
  ];
}

const formSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  entityId: z.string().optional(),
});

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileId: nanoid(),
      entityId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file_id", values.fileId);
      formData.append("file", file);
      if (values.entityId) formData.append("entity_id", values.entityId);

      await embedDocument(formData);

      // Reset form
      form.reset();
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Embedding Dashboard
          </h1>
          <p className="text-muted-foreground">
            Upload your documents and generate embeddings for semantic search.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Fill in the details below to upload and embed your document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File ID</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          {...field}
                          className={cn("font-mono bg-muted")}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for your document
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Document</FormLabel>
                      <FormControl>
                        <div className="grid w-full items-center gap-1.5">
                          <Input
                            type="file"
                            onChange={(e) =>
                              setFile(e.target.files?.[0] || null)
                            }
                            className="cursor-pointer"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select a document to upload and embed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entity ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional identifier to group related documents
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Document</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
