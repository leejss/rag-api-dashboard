import { useState, useEffect } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import {
  deleteDocument,
  getAllDocumentIds,
  getDocuments,
} from "~/lib/api/documents";

interface Document {
  id: string;
  content?: string;
}

export default function Documents() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch document IDs
  const fetchDocumentIds = async () => {
    try {
      const ids: string[] = await getAllDocumentIds();
      setDocuments(ids.map((id) => ({ id })));
    } catch (error) {
      toast({
        title: "문서 목록 조회 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 에러가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // Delete document
  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      toast({
        title: "문서 삭제 성공",
        description: `문서 ID: ${id}가 삭제되었습니다.`,
      });

      fetchDocumentIds();
    } catch (error) {
      toast({
        title: "문서 삭제 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 에러가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // View document details
  const updateDocumentContent = async (id: string) => {
    if (documents.find((doc) => doc.id === id && doc.content)) {
      return;
    }

    try {
      const documentDetails = await getDocuments([id]);
      const updatedDocuments = documents.map((doc) =>
        doc.id === id
          ? { ...doc, content: JSON.stringify(documentDetails, null, 2) }
          : doc,
      );

      setDocuments(updatedDocuments);
    } catch (error) {
      toast({
        title: "문서 상세 조회 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 에러가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDocumentIds();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="pb-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Document Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Document를 조회하고 관리할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="text-lg">{doc.id}</CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateDocumentContent(doc.id);
                    setSelectedDoc(doc.id);
                    setIsDialogOpen(true);
                  }}
                  className="hover:bg-gray-100"
                >
                  상세보기
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  className="hover:bg-red-600"
                >
                  삭제
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>문서 상세 정보</DialogTitle>
              <DialogDescription>문서 ID: {selectedDoc}</DialogDescription>
            </DialogHeader>
            <div
              className="mt-4 overflow-y-auto flex-1"
              style={{ maxHeight: "calc(90vh - 150px)" }}
            >
              {selectedDoc &&
                documents.find((doc) => doc.id === selectedDoc)?.content && (
                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                    {documents.find((doc) => doc.id === selectedDoc)?.content}
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
