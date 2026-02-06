import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EmailTable } from "@/components/admin/EmailTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const EmailSubscribers = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const { 
    isLoading: dataLoading, 
    subscribers,
    refreshData,
    exportSubscribersCSV
  } = useAnalytics();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Email Subscribers</h1>
            <p className="text-muted-foreground">
              Manage users who signed up for monthly guidance
            </p>
          </div>
          <Button 
            onClick={refreshData} 
            variant="outline" 
            disabled={dataLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Email Table */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <EmailTable 
            data={subscribers} 
            onExport={exportSubscribersCSV} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default EmailSubscribers;
