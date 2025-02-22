import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/hooks/use-toast";
import { querySingle } from "~/lib/api/query";

interface QueryResult {
  page_content: string;
  metadata: {
    file_id?: string;
    user_id?: string;
    digest?: string;
    source?: string;
    page?: number;
  };
  type?: string;
  id?: string | null;
  similarity: number;
}

export default function Query() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const { toast } = useToast();

  // Single query state
  const [singleQuery, setSingleQuery] = useState("");
  const [fileId, setFileId] = useState("");
  const [k, setK] = useState("5");
  const [entityId, setEntityId] = useState("");

  // Multiple query state
  // const [multiQuery, setMultiQuery] = useState("");
  // const [fileIds, setFileIds] = useState("");
  // const [multiK, setMultiK] = useState("5");

  const handleSingleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await querySingle({
        query: singleQuery,
        file_id: fileId,
        k: parseInt(k),
        entity_id: entityId || undefined,
      });

      // Transform response to match QueryResult interface
      const transformedResults = response.map(([doc, score]) => ({
        ...doc,
        similarity: score,
      }));

      setResults(transformedResults);
      toast({
        title: "쿼리 성공",
        description: "문서를 성공적으로 검색했습니다.",
      });
    } catch (error) {
      toast({
        title: "쿼리 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 에러가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleMultipleQuery = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const response = await queryMultiple({
  //       query: multiQuery,
  //       file_ids: fileIds.split(",").map((id) => id.trim()),
  //       k: parseInt(multiK),
  //     });

  //     // Transform response to match QueryResult interface
  //     const transformedResults = response.map(([doc, score]) => ({
  //       ...doc,
  //       similarity: score,
  //     }));

  //     setResults(transformedResults);
  //     toast({
  //       title: "쿼리 성공",
  //       description: "문서를 성공적으로 검색했습니다.",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "쿼리 실패",
  //       description:
  //         error instanceof Error
  //           ? error.message
  //           : "알 수 없는 에러가 발생했습니다.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="pb-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Query Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            문서를 검색하고 관련된 내용을 찾을 수 있습니다.
          </p>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList>
            <TabsTrigger value="single">단일 파일 검색</TabsTrigger>
            <TabsTrigger value="multiple">다중 파일 검색</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>단일 파일 검색</CardTitle>
                <CardDescription>
                  특정 파일 내에서 관련 내용을 검색합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSingleQuery} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="query">검색어</Label>
                    <Input
                      id="query"
                      value={singleQuery}
                      onChange={(e) => setSingleQuery(e.target.value)}
                      placeholder="검색어를 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileId">파일 ID</Label>
                    <Input
                      id="fileId"
                      value={fileId}
                      onChange={(e) => setFileId(e.target.value)}
                      placeholder="파일 ID를 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="k">결과 개수</Label>
                    <Input
                      id="k"
                      type="number"
                      value={k}
                      onChange={(e) => setK(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entityId">Entity ID (선택사항)</Label>
                    <Input
                      id="entityId"
                      value={entityId}
                      onChange={(e) => setEntityId(e.target.value)}
                      placeholder="Entity ID를 입력하세요"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "검색 중..." : "검색"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="multiple">
            <Card>
              <CardHeader>
                <CardTitle>다중 파일 검색</CardTitle>
                <CardDescription>
                  여러 파일에서 동시에 검색합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMultipleQuery} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="multiQuery">검색어</Label>
                    <Input
                      id="multiQuery"
                      value={multiQuery}
                      onChange={(e) => setMultiQuery(e.target.value)}
                      placeholder="검색어를 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileIds">파일 ID 목록</Label>
                    <Input
                      id="fileIds"
                      value={fileIds}
                      onChange={(e) => setFileIds(e.target.value)}
                      placeholder="파일 ID를 쉼표로 구분하여 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="multiK">결과 개수</Label>
                    <Input
                      id="multiK"
                      type="number"
                      value={multiK}
                      onChange={(e) => setMultiK(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "검색 중..." : "검색"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>

        {results?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>검색 결과</CardTitle>
              <CardDescription>검색된 문서 {results.length}개</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="mb-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        유사도: {(result.similarity * 100).toFixed(2)}%
                      </span>
                      {result.metadata.file_id && (
                        <span className="text-sm text-muted-foreground">
                          파일: {result.metadata.file_id}
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{result.page_content}</p>
                    {result.metadata.page && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        페이지: {result.metadata.page}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
