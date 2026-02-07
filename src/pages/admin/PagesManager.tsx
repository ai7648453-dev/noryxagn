import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Page {
  id: string;
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  is_enabled: boolean;
  display_order: number | null;
}

const emptyPage = { title: "", slug: "", meta_title: "", meta_description: "", og_image_url: "", is_enabled: true, display_order: 0 };

const PagesManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState(emptyPage);
  const [open, setOpen] = useState(false);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").order("display_order");
      if (error) throw error;
      return data as Page[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("pages").update({
          title: form.title, slug: form.slug, meta_title: form.meta_title || null,
          meta_description: form.meta_description || null, og_image_url: form.og_image_url || null,
          is_enabled: form.is_enabled, display_order: form.display_order,
        }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pages").insert({
          title: form.title, slug: form.slug, meta_title: form.meta_title || null,
          meta_description: form.meta_description || null, og_image_url: form.og_image_url || null,
          is_enabled: form.is_enabled, display_order: form.display_order,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pages"] });
      toast.success(editing ? "Page updated" : "Page created");
      setOpen(false);
      setEditing(null);
      setForm(emptyPage);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-pages"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (p: Page) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, meta_title: p.meta_title || "", meta_description: p.meta_description || "", og_image_url: p.og_image_url || "", is_enabled: p.is_enabled, display_order: p.display_order ?? 0 });
    setOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyPage);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Pages</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add Page</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Page" : "New Page"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Title</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-secondary/50 border-border/50" /></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Slug</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="/about" className="bg-secondary/50 border-border/50" /></div>
              </div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Meta Title</label><Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Meta Description</label><Textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} rows={2} className="bg-secondary/50 border-border/50 resize-none" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">OG Image URL</label><Input value={form.og_image_url} onChange={(e) => setForm({ ...form, og_image_url: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_enabled} onCheckedChange={(v) => setForm({ ...form, is_enabled: v })} />
                <span className="text-sm text-foreground">Enabled</span>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="hero" size="sm" disabled={save.isPending}><Save className="mr-1 h-4 w-4" /> Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {pages.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${p.is_enabled ? "bg-green-500" : "bg-muted-foreground"}`} />
                  <h3 className="font-medium text-foreground truncate">{p.title}</h3>
                  <span className="text-xs text-muted-foreground">{p.slug}</span>
                </div>
                {p.meta_title && <p className="text-xs text-muted-foreground mt-1 truncate">{p.meta_title}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagesManager;
