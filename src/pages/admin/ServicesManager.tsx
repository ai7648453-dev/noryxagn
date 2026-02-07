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

interface Service {
  id: string; title: string; description: string | null; tag: string | null;
  icon_name: string | null; price: string | null; cta_text: string | null;
  display_order: number | null; is_enabled: boolean;
}

const empty = { title: "", description: "", tag: "", icon_name: "Monitor", price: "", cta_text: "Get More", display_order: 0, is_enabled: true };

const ServicesManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("display_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { title: form.title, description: form.description || null, tag: form.tag || null, icon_name: form.icon_name || null, price: form.price || null, cta_text: form.cta_text || null, display_order: form.display_order, is_enabled: form.is_enabled };
      if (editing) {
        const { error } = await supabase.from("services").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); toast.success("Saved"); setOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("services").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-services"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description || "", tag: s.tag || "", icon_name: s.icon_name || "", price: s.price || "", cta_text: s.cta_text || "", display_order: s.display_order ?? 0, is_enabled: s.is_enabled });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Services</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add Service</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Title</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-secondary/50 border-border/50" /></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Tag</label><Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
              </div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-secondary/50 border-border/50 resize-none" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Icon Name</label><Input value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} placeholder="Monitor" className="bg-secondary/50 border-border/50" /></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Price</label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Order</label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-secondary/50 border-border/50" /></div>
              </div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">CTA Text</label><Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
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

      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.is_enabled ? "bg-green-500" : "bg-muted-foreground"}`} />
                  <h3 className="font-medium text-foreground truncate">{s.title}</h3>
                  {s.price && <span className="text-xs text-primary">{s.price}</span>}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
