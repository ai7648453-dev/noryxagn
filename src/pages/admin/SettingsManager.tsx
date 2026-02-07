import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save } from "lucide-react";

const settingsKeys = [
  { key: "site_name", label: "Site Name" },
  { key: "footer_copyright", label: "Footer Copyright" },
  { key: "social_instagram", label: "Instagram URL" },
  { key: "social_twitter", label: "Twitter / X URL" },
  { key: "social_linkedin", label: "LinkedIn URL" },
  { key: "social_dribbble", label: "Dribbble URL" },
];

const SettingsManager = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});

  const { data: settings = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value || ""; });
    setForm(map);
  }, [settings]);

  const save = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(form)) {
        const existing = settings.find((s) => s.key === key);
        if (existing) {
          await supabase.from("site_settings").update({ value }).eq("id", existing.id);
        } else {
          await supabase.from("site_settings").insert({ key, value });
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-settings"] }); toast.success("Settings saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Global Settings</h1>
        <Button variant="hero" size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
          <Save className="mr-1 h-4 w-4" /> Save All
        </Button>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-5 max-w-2xl">
        {settingsKeys.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <label className="text-xs text-muted-foreground">{label}</label>
            <Input
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="bg-secondary/50 border-border/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsManager;
