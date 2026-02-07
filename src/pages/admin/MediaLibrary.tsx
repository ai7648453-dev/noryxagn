import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";

const MediaLibrary = () => {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: media = [], isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) { toast.error(`Upload failed: ${uploadError.message}`); continue; }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      const { error: dbError } = await supabase.from("media_library").insert({
        name: file.name, url: urlData.publicUrl, file_type: file.type, file_size: file.size,
      });
      if (dbError) toast.error(dbError.message);
    }
    qc.invalidateQueries({ queryKey: ["admin-media"] });
    toast.success("Uploaded");
    setUploading(false);
  };

  const del = useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      // Extract path from url
      const path = url.split("/media/")[1];
      if (path) await supabase.storage.from("media").remove([path]);
      const { error } = await supabase.from("media_library").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Media Library</h1>
        <div>
          <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
          <Button variant="hero" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="mr-1 h-4 w-4" /> {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : media.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No media uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((m) => (
            <div key={m.id} className="glass-card rounded-xl overflow-hidden group relative">
              {m.file_type?.startsWith("image") ? (
                <img src={m.url} alt={m.name} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square bg-secondary flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyUrl(m.url)}><Copy className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => del.mutate({ id: m.id, url: m.url })}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">{m.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
