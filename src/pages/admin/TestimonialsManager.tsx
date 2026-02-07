import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;
const empty = { client_name: "", client_role: "", client_company: "", review: "", avatar_url: "", is_featured: false, display_order: 0 };

const TestimonialsManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { client_name: form.client_name, client_role: form.client_role || null, client_company: form.client_company || null, review: form.review, avatar_url: form.avatar_url || null, is_featured: form.is_featured, display_order: form.display_order };
      if (editing) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast.success("Saved"); setOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ client_name: t.client_name, client_role: t.client_role || "", client_company: t.client_company || "", review: t.review, avatar_url: t.avatar_url || "", is_featured: t.is_featured ?? false, display_order: t.display_order ?? 0 });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Testimonials</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Testimonial</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Client Name</label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required className="bg-secondary/50 border-border/50" /></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Role</label><Input value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
              </div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Company</label><Input value={form.client_company} onChange={(e) => setForm({ ...form, client_company: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Review</label><Textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} rows={4} required className="bg-secondary/50 border-border/50 resize-none" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Avatar URL</label><Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
                <span className="text-sm text-foreground">Featured</span>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="hero" size="sm" disabled={save.isPending}><Save className="mr-1 h-4 w-4" /> Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{t.client_name}</h3>
                <p className="text-xs text-muted-foreground">{[t.client_role, t.client_company].filter(Boolean).join(" · ")}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{t.review}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
