import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { LayoutDashboard, FileText, Search } from "lucide-react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="p-4 flex gap-4">
      <Button asChild variant="outline">
        <Link to="/dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span>Embedding</span>
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/query" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span>Query</span>
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/documents" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Documents</span>
        </Link>
      </Button>
    </div>
  );
}
