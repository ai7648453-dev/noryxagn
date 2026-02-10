import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Upload, CheckCircle } from "lucide-react";
import { z } from "zod";

const listingSchema = z.object({
  website_name: z.string().trim().min(1, "Website name is required").max(100),
  website_url: z.string().trim().url("Must be a valid URL").max(500),
  price: z.number().min(1, "Price must be at least $1").max(9999999),
  description: z.string().trim().max(500).optional(),
  thumbnail_url: z.string().max(1000).optional(),
  contact_email: z.string().trim().email("Must be a valid email").max(255),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MarketplaceSubmitForm = ({ open, onOpenChange }: Props) => {
  const qc = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    website_name: "",
    website_url: "",
    price: "",
    description: "",
    thumbnail_url: "",
    contact_email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = listingSchema.parse({
        ...form,
        price: parseFloat(form.price),
      });
      const { error } = await supabase.from("marketplace_listings").insert({
        website_name: parsed.website_name,
        website_url: parsed.website_url,
        price: parsed.price,
        description: parsed.description || null,
        thumbnail_url: parsed.thumbnail_url || null,
        contact_email: parsed.contact_email,
        status: "pending",
        is_admin_listing: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      qc.invalidateQueries({ queryKey: ["marketplace-listings"] });
    },
    onError: (e: any) => {
      if (e instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        e.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(e.message || "Submission failed");
      }
    },
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `marketplace/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    setForm((f) => ({ ...f, thumbnail_url: urlData.publicUrl }));
    toast.success("Screenshot uploaded");
    setUploading(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setSubmitted(false);
      setForm({ website_name: "", website_url: "", price: "", description: "", thumbnail_url: "", contact_email: "" });
      setErrors({});
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">Submitted Successfully!</h3>
            <p className="text-muted-foreground text-sm">Your website listing is pending admin approval. You'll be notified once it's live.</p>
            <Button variant="hero" className="mt-6" onClick={() => handleClose(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Submit Your Website</DialogTitle>
              <DialogDescription>Fill in the details below. Your listing will be reviewed by our team before going live.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setErrors({});
                submit.mutate();
              }}
              className="space-y-4"
            >
              <Field label="Website Name" error={errors.website_name}>
                <Input value={form.website_name} onChange={(e) => setForm({ ...form, website_name: e.target.value })} placeholder="My Awesome Website" className="bg-secondary/50 border-border/50" />
              </Field>
              <Field label="Website URL" error={errors.website_url}>
                <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://example.com" className="bg-secondary/50 border-border/50" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price ($)" error={errors.price}>
                  <Input type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="500" className="bg-secondary/50 border-border/50" />
                </Field>
                <Field label="Contact Email" error={errors.contact_email}>
                  <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder="you@email.com" className="bg-secondary/50 border-border/50" />
                </Field>
              </div>
              <Field label="Description (optional)" error={errors.description}>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of the website..." className="bg-secondary/50 border-border/50 resize-none" maxLength={500} />
              </Field>
              <Field label="Screenshot / Thumbnail" error={errors.thumbnail_url}>
                {form.thumbnail_url && (
                  <img src={form.thumbnail_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <div className="flex gap-2">
                  <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="Image URL or upload" className="bg-secondary/50 border-border/50 flex-1" />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </Field>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleClose(false)}>Cancel</Button>
                <Button type="submit" variant="hero" size="sm" disabled={submit.isPending}>
                  <Send className="h-4 w-4 mr-1" /> {submit.isPending ? "Submitting..." : "Submit Listing"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-xs text-muted-foreground">{label}</label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export default MarketplaceSubmitForm;
