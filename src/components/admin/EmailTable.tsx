import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

interface EmailSubscriber {
  id: string;
  email: string;
  language: string;
  created_at: string;
}

interface EmailTableProps {
  data: EmailSubscriber[];
  onExport: () => void;
}

const languageLabels: Record<string, string> = {
  en: "English",
  vi: "Vietnamese",
  zh: "Chinese",
  es: "Spanish",
  de: "German",
  it: "Italian",
  tl: "Tagalog"
};

export const EmailTable = ({ data, onExport }: EmailTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");

  // Get unique languages from data
  const languages = useMemo(() => {
    const unique = [...new Set(data.map((item) => item.language))];
    return unique.sort();
  }, [data]);

  // Filter data based on search and language
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLanguage =
        languageFilter === "all" || item.language === languageFilter;
      return matchesSearch && matchesLanguage;
    });
  }, [data, searchTerm, languageFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {languageLabels[lang] || lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={onExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} subscribers
      </p>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Subscribed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary">
                      {languageLabels[subscriber.language] || subscriber.language}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(subscriber.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
