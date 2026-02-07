import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen, Download } from "lucide-react";
import { format } from "date-fns";

const LeadsManager = () => {
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from("contact_submissions").update({ is_read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-leads"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const exportCSV = () => {
    const headers = ["Name", "Email", "Company", "Budget", "Message", "Date", "Read"];
    const rows = leads.map(l => [l.name, l.email, l.company || "", l.budget_range || "", `"${l.message.replace(/"/g, '""')}"`, l.created_at, l.is_read ? "Yes" : "No"]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const unread = leads.filter(l => !l.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Leads & Forms</h1>
          {unread > 0 && <span className="text-xs text-primary">{unread} unread</span>}
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={leads.length === 0}>
          <Download className="mr-1 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : leads.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className={`glass-card rounded-xl p-5 ${!l.is_read ? "border-l-2 border-l-primary" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{l.name}</h3>
                    <span className="text-xs text-muted-foreground">{l.email}</span>
                    {l.budget_range && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{l.budget_range}</span>}
                  </div>
                  {l.company && <p className="text-xs text-muted-foreground mb-1">{l.company}</p>}
                  <p className="text-sm text-muted-foreground">{l.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">{format(new Date(l.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => markRead.mutate({ id: l.id, is_read: !l.is_read })}>
                    {l.is_read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate(l.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
