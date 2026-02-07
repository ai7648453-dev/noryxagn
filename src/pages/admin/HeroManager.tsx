import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Save } from "lucide-react";

const HeroManager = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    heading: "", heading_highlight: "", heading_line2: "", tagline: "", description: "",
    cta_primary_text: "", cta_primary_link: "", cta_secondary_text: "", cta_secondary_link: "",
    video_url: "", video_enabled: true, overlay_opacity: 70,
  });

  const { data: hero } = useQuery({
    queryKey: ["admin-hero"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (hero) {
      setForm({
        heading: hero.heading, heading_highlight: hero.heading_highlight, heading_line2: hero.heading_line2,
        tagline: hero.tagline || "", description: hero.description || "",
        cta_primary_text: hero.cta_primary_text || "", cta_primary_link: hero.cta_primary_link || "",
        cta_secondary_text: hero.cta_secondary_text || "", cta_secondary_link: hero.cta_secondary_link || "",
        video_url: hero.video_url || "", video_enabled: hero.video_enabled, overlay_opacity: hero.overlay_opacity ?? 70,
      });
    }
  }, [hero]);

  const save = useMutation({
    mutationFn: async () => {
      if (!hero) return;
      const { error } = await supabase.from("hero_settings").update(form).eq("id", hero.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-hero"] }); toast.success("Hero updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Hero Section</h1>
        <Button variant="hero" size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
          <Save className="mr-1 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-5 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Heading Line 1</label><Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Highlight Text</label><Input value={form.heading_highlight} onChange={(e) => setForm({ ...form, heading_highlight: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
        </div>
        <div className="space-y-1"><label className="text-xs text-muted-foreground">Heading Line 2</label><Input value={form.heading_line2} onChange={(e) => setForm({ ...form, heading_line2: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
        <div className="space-y-1"><label className="text-xs text-muted-foreground">Tagline</label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
        <div className="space-y-1"><label className="text-xs text-muted-foreground">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-secondary/50 border-border/50 resize-none" /></div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Primary CTA Text</label><Input value={form.cta_primary_text} onChange={(e) => setForm({ ...form, cta_primary_text: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Primary CTA Link</label><Input value={form.cta_primary_link} onChange={(e) => setForm({ ...form, cta_primary_link: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Secondary CTA Text</label><Input value={form.cta_secondary_text} onChange={(e) => setForm({ ...form, cta_secondary_text: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Secondary CTA Link</label><Input value={form.cta_secondary_link} onChange={(e) => setForm({ ...form, cta_secondary_link: e.target.value })} className="bg-secondary/50 border-border/50" /></div>
        </div>

        <div className="space-y-1"><label className="text-xs text-muted-foreground">Video URL</label><Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="bg-secondary/50 border-border/50" /></div>

        <div className="flex items-center gap-3">
          <Switch checked={form.video_enabled} onCheckedChange={(v) => setForm({ ...form, video_enabled: v })} />
          <span className="text-sm text-foreground">Video Enabled</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Overlay Opacity: {form.overlay_opacity}%</label>
          <Slider value={[form.overlay_opacity]} onValueChange={(v) => setForm({ ...form, overlay_opacity: v[0] })} min={0} max={100} step={5} />
        </div>
      </div>
    </div>
  );
};

export default HeroManager;
