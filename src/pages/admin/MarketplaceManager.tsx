import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, CheckCircle, XCircle, ShieldCheck, Upload, Star, ExternalLink } from "lucide-react";

type Listing = {
  id: string;
  website_name: string;
  website_url: string;
  price: number;
  description: string | null;
  thumbnail_url: string | null;
  contact_email: string;
  status: string;
  is_admin_listing: boolean;
  is_featured: boolean;
  display_order: number | null;
  created_at: string;
  updated_at: string;
  submitted_by_user_id: string | null;
};

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const emptyForm = {
  website_name: "",
  website_url: "",
  price: "",
  description: "",
  thumbnail_url: "",
  contact_email: "",
  is_admin_listing: true,
  is_featured: false,
  display_order: 0,
};

const MarketplaceManager = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Listing | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin-marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Listing[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        website_name: form.website_name,
        website_url: form.website_url,
        price: parseFloat(form.price),
        description: form.description || null,
        thumbnail_url: form.thumbnail_url || null,
        contact_email: form.contact_email,
        is_admin_listing: form.is_admin_listing,
        is_featured: form.is_featured,
        display_order: form.display_order,
      };
      if (editing) {
        const { error } = await supabase.from("marketplace_listings").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("marketplace_listings").insert({
          ...payload,
          status: "approved",
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-marketplace"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "pending" | "rejected" }) => {
      const { error } = await supabase.from("marketplace_listings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-marketplace"] });
      toast.success("Status updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("marketplace_listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-marketplace"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (l: Listing) => {
    setEditing(l);
    setForm({
      website_name: l.website_name,
      website_url: l.website_url,
      price: String(l.price),
      description: l.description || "",
      thumbnail_url: l.thumbnail_url || "",
      contact_email: l.contact_email,
      is_admin_listing: l.is_admin_listing,
      is_featured: l.is_featured,
      display_order: l.display_order ?? 0,
    });
    setOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `marketplace/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    setForm((f) => ({ ...f, thumbnail_url: urlData.publicUrl }));
    toast.success("Uploaded");
    setUploading(false);
  };

  const filtered = listings.filter((l) => statusFilter === "all" || l.status === statusFilter);
  const pendingCount = listings.filter((l) => l.status === "pending").length;

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-primary/20 text-primary border-primary/30">Approved</Badge>;
      case "pending": return <Badge className="bg-accent/20 text-accent border-accent/30">Pending</Badge>;
      case "rejected": return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Rejected</Badge>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Marketplace</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-accent mt-1">{pendingCount} listing(s) pending approval</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-36 bg-secondary/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                <Plus className="mr-1 h-4 w-4" /> Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Listing" : "New Admin Listing"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Website Name</label>
                  <Input value={form.website_name} onChange={(e) => setForm({ ...form, website_name: e.target.value })} required className="bg-secondary/50 border-border/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Website URL</label>
                  <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} required className="bg-secondary/50 border-border/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Price ($)</label>
                    <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="bg-secondary/50 border-border/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Contact Email</label>
                    <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} required className="bg-secondary/50 border-border/50" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Description</label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-secondary/50 border-border/50 resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Thumbnail</label>
                  {form.thumbnail_url && <img src={form.thumbnail_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />}
                  <div className="flex gap-2">
                    <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="URL or upload" className="bg-secondary/50 border-border/50 flex-1" />
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Display Order</label>
                  <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-secondary/50 border-border/50" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Switch checked={form.is_admin_listing} onCheckedChange={(v) => setForm({ ...form, is_admin_listing: v })} />
                    <span className="text-sm text-foreground flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Admin Website</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
                    <span className="text-sm text-foreground flex items-center gap-1"><Star className="h-3.5 w-3.5 text-primary" /> Featured</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="hero" size="sm" disabled={save.isPending}><Save className="mr-1 h-4 w-4" /> Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="grid gap-3">
          {filtered.map((l) => (
            <div key={l.id} className={`glass-card rounded-xl p-4 flex items-center gap-4 ${l.status === "pending" ? "border-l-4 border-l-accent" : ""}`}>
              {l.thumbnail_url && <img src={l.thumbnail_url} alt={l.website_name} className="w-16 h-12 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-medium text-foreground truncate">{l.website_name}</h3>
                  {l.is_admin_listing && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0 gap-0.5">
                      <ShieldCheck className="h-2.5 w-2.5" /> NORYX
                    </Badge>
                  )}
                  {l.is_featured && (
                    <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-primary font-semibold">${Number(l.price).toLocaleString()}</span>
                  {statusBadge(l.status)}
                  <span className="text-muted-foreground">{l.contact_email}</span>
                </div>
              </div>
              {l.website_url && (
                <a href={l.website_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </a>
              )}
              {l.status === "pending" && (
                <>
                  <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/10" onClick={() => updateStatus.mutate({ id: l.id, status: "approved" })}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => updateStatus.mutate({ id: l.id, status: "rejected" })}>
                    <XCircle className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={() => openEdit(l)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate(l.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">No listings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplaceManager;
