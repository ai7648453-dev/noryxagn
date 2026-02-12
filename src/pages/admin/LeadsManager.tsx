import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen, Download, Phone, Globe, Eye } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const LeadsManager = () => {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-leads"] }); toast.success("Deleted"); setSelected(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Budget", "Message", "Page Source", "Date", "Read"];
    const rows = leads.map(l => [
      l.name, l.email, (l as any).phone || "", l.company || "", l.budget_range || "",
      `"${l.message.replace(/"/g, '""')}"`, (l as any).page_source || "", l.created_at, l.is_read ? "Yes" : "No"
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "inbox-messages.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const unread = leads.filter(l => !l.is_read).length;

  const openDetail = (l: any) => {
    setSelected(l);
    if (!l.is_read) markRead.mutate({ id: l.id, is_read: true });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Inbox</h1>
          <p className="text-sm text-muted-foreground">All form submissions across the website</p>
          {unread > 0 && <Badge variant="default" className="mt-1">{unread} unread</Badge>}
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={leads.length === 0}>
          <Download className="mr-1 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : leads.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className={`glass-card rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors ${!l.is_read ? "border-l-2 border-l-primary" : ""}`} onClick={() => openDetail(l)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium text-foreground">{l.name}</h3>
                    <span className="text-xs text-muted-foreground">{l.email}</span>
                    {(l as any).phone && <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{(l as any).phone}</span>}
                    {l.budget_range && <Badge variant="secondary" className="text-xs">{l.budget_range}</Badge>}
                    {(l as any).page_source && <Badge variant="outline" className="text-xs"><Globe className="h-3 w-3 mr-1" />{(l as any).page_source}</Badge>}
                  </div>
                  {l.company && <p className="text-xs text-muted-foreground mb-1">{l.company}</p>}
                  <p className="text-sm text-muted-foreground line-clamp-2">{l.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">{format(new Date(l.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" title="View details" onClick={() => openDetail(l)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
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

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-foreground">{selected.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="text-foreground">{selected.company || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-foreground">{selected.budget_range || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Page Source</p>
                    <p className="text-foreground">{selected.page_source || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-foreground">{format(new Date(selected.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <p className="text-foreground whitespace-pre-wrap bg-secondary/30 rounded-lg p-4">{selected.message}</p>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={() => markRead.mutate({ id: selected.id, is_read: !selected.is_read })}>
                    {selected.is_read ? "Mark Unread" : "Mark Read"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate(selected.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsManager;