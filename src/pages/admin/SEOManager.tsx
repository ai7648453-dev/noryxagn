import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useState } from "react";

const SEOManager = () => {
  const qc = useQueryClient();
  const [forms, setForms] = useState<Record<string, { meta_title: string; meta_description: string; og_image_url: string }>>({});

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["admin-seo-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const getForm = (p: any) => forms[p.id] ?? { meta_title: p.meta_title || "", meta_description: p.meta_description || "", og_image_url: p.og_image_url || "" };
  const setForm = (id: string, val: any) => setForms({ ...forms, [id]: val });

  const save = useMutation({
    mutationFn: async (id: string) => {
      const f = forms[id];
      if (!f) return;
      const { error } = await supabase.from("pages").update({
        meta_title: f.meta_title || null, meta_description: f.meta_description || null, og_image_url: f.og_image_url || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-seo-pages"] }); toast.success("SEO updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">SEO & Metadata</h1>
      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : (
        <div className="space-y-6 max-w-2xl">
          {pages.map((p) => {
            const f = getForm(p);
            return (
              <div key={p.id} className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-semibold text-foreground">{p.title} <span className="text-xs text-muted-foreground">{p.slug}</span></h2>
                  <Button variant="hero" size="sm" onClick={() => save.mutate(p.id)} disabled={save.isPending}><Save className="mr-1 h-4 w-4" /> Save</Button>
                </div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Meta Title (max 60 chars)</label><Input value={f.meta_title} maxLength={60} onChange={(e) => setForm(p.id, { ...f, meta_title: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">Meta Description (max 160 chars)</label><Textarea value={f.meta_description} maxLength={160} onChange={(e) => setForm(p.id, { ...f, meta_description: e.target.value })} rows={2} className="bg-secondary/50 border-border/50 resize-none" /></div>
                <div className="space-y-1"><label className="text-xs text-muted-foreground">OG Image URL</label><Input value={f.og_image_url} onChange={(e) => setForm(p.id, { ...f, og_image_url: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SEOManager;
