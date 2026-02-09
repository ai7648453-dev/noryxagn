import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, ExternalLink, Upload } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
const categories = ["web-design", "branding", "e-commerce", "ui-ux"] as const;

type ProjectCategory = "web-design" | "branding" | "e-commerce" | "ui-ux";
const emptyProject: { name: string; description: string; category: ProjectCategory; thumbnail_url: string; project_link: string; is_featured: boolean; display_order: number } = { name: "", description: "", category: "web-design", thumbnail_url: "", project_link: "", is_featured: false, display_order: 0 };

const PortfolioManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name, description: form.description || null, category: form.category,
        thumbnail_url: form.thumbnail_url || null, project_link: form.project_link || null,
        is_featured: form.is_featured, display_order: form.display_order,
      };
      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Saved"); setOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("projects").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", category: p.category, thumbnail_url: p.thumbnail_url || "", project_link: p.project_link || "", is_featured: p.is_featured ?? false, display_order: p.display_order ?? 0 });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Portfolio</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" onClick={() => { setEditing(null); setForm(emptyProject); setOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add Project</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-secondary/50 border-border/50" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-secondary/50 border-border/50 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Category</label>
                  <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Order</label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-secondary/50 border-border/50" /></div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Thumbnail</label>
                {form.thumbnail_url && (
                  <img src={form.thumbnail_url} alt="Thumbnail preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <div className="flex gap-2">
                  <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="URL or upload" className="bg-secondary/50 border-border/50 flex-1" />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    const ext = file.name.split(".").pop();
                    const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                    const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
                    if (uploadError) { toast.error(uploadError.message); setUploading(false); return; }
                    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
                    setForm((f) => ({ ...f, thumbnail_url: urlData.publicUrl }));
                    toast.success("Uploaded");
                    setUploading(false);
                  }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Live Link</label><Input value={form.project_link} onChange={(e) => setForm({ ...form, project_link: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
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
        <div className="grid gap-3">
          {projects.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
              {p.thumbnail_url && <img src={p.thumbnail_url} alt={p.name} className="w-16 h-12 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{p.name}</h3>
                <span className="text-xs text-primary capitalize">{p.category.replace("-", " ")}</span>
              </div>
              {p.project_link && <a href={p.project_link} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 text-muted-foreground" /></a>}
              <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
