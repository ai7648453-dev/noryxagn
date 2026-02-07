import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MessageSquare, Mail, FileText } from "lucide-react";

const StatCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
  <div className="glass-card rounded-xl p-6 border-glow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <p className="text-3xl font-heading font-bold text-foreground">{value}</p>
  </div>
);

const Dashboard = () => {
  const { data: projectCount = 0 } = useQuery({
    queryKey: ["admin-stat-projects"],
    queryFn: async () => {
      const { count } = await supabase.from("projects").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
  const { data: testimonialCount = 0 } = useQuery({
    queryKey: ["admin-stat-testimonials"],
    queryFn: async () => {
      const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
  const { data: leadCount = 0 } = useQuery({
    queryKey: ["admin-stat-leads"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
  const { data: pageCount = 0 } = useQuery({
    queryKey: ["admin-stat-pages"],
    queryFn: async () => {
      const { count } = await supabase.from("pages").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projects" value={projectCount} icon={Briefcase} />
        <StatCard label="Testimonials" value={testimonialCount} icon={MessageSquare} />
        <StatCard label="Leads" value={leadCount} icon={Mail} />
        <StatCard label="Pages" value={pageCount} icon={FileText} />
      </div>
    </div>
  );
};

export default Dashboard;
