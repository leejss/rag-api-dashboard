import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import { getAllDocumentIds } from "~/lib/api/documents";
import { callModel, generatePrompt } from "~/lib/api/model";
import { queryMultiple } from "~/lib/api/query";

export default function Search() {
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const ids = await getAllDocumentIds();

    try {
      const result = await queryMultiple({
        query: query,
        file_ids: ids,
        k: 1,
      });

      if (result.length > 0) {
        const pageContent = result[0][0].page_content;
        setContext(pageContent);

        const prompt = await generatePrompt({ userQuery: query, pageContent });
        const answer = await callModel(prompt);
        setCompletion(answer);
      } else {
        setContext("");
        setCompletion("");
        toast({
          title: "쿼리 실패",
          description: "문서를 찾을 수 없습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      // Show some toast
      toast({
        title: "쿼리 실패",
        description: "Failed to search documents.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Search
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-sm space-x-2 mb-8"
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question..."
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {context && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Context</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7">{context}</p>
          </CardContent>
        </Card>
      )}

      {completion && (
        <Card>
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7">{completion}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
