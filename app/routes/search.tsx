import { useState } from "react";
import { generatePrompt, callModel } from "~/lib/api/model";
import { querySingle } from "~/lib/api/query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Search() {
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await querySingle({
        query: query,
        file_id: "1",
        k: 1,
      });

      if (result.length > 0) {
        const pageContent = result[0][0].page_content;
        setContext(pageContent);

        const prompt = await generatePrompt({ userQuery: query, pageContent });
        const answer = await callModel(prompt);
        setCompletion(answer);
      }
    } catch (error) {
      console.error("Search failed:", error);
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
