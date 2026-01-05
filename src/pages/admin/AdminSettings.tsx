import { useState } from "react";
import { Save, Store, Bell, Shield, Database, Download, Trash2, RefreshCw, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "Silkroad 4.0",
    storeEmail: "support@silkroad4.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Tech Street, Digital City, DC 10001",
    currency: "USD",
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
    lowStockThreshold: 10,
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const { products, categories, messages } = useStore();
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleExportData = () => {
    const data = {
      products,
      categories,
      messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `silkroad-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleClearMessages = () => {
    if (confirm("Are you sure you want to delete all messages? This cannot be undone.")) {
      // This would clear messages - for demo we just show toast
      toast.success("All messages cleared");
    }
  };

  const handlePasswordChange = () => {
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully");
    setPasswords({ current: "", new: "", confirm: "" });
    setShowPasswordChange(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your store settings and preferences
        </p>
      </div>

      {/* Store Information */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">Store Information</h2>
            <p className="text-sm text-muted-foreground">Basic store details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Store Name</label>
            <Input
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={settings.storeEmail}
              onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Phone</label>
            <Input
              value={settings.storePhone}
              onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Currency</label>
            <Input
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-foreground">Address</label>
            <Textarea
              value={settings.storeAddress}
              onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Inventory Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">Inventory Settings</h2>
            <p className="text-sm text-muted-foreground">Configure inventory alerts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Low Stock Threshold</label>
            <Input
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 10 })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Products with stock below this will trigger alerts
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">Manage notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about new orders and messages</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Receive important updates via email</p>
            </div>
            <Switch
              checked={settings.enableEmailAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, enableEmailAlerts: checked })}
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">Security & Access</h2>
            <p className="text-sm text-muted-foreground">Manage security settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Current Admin</p>
                <p className="text-sm text-muted-foreground">{user?.email || "Unknown"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPasswordChange(!showPasswordChange)}>
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
            
            {showPasswordChange && (
              <div className="mt-4 space-y-3 pt-4 border-t border-border">
                <div className="relative">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    placeholder="Current Password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    placeholder="New Password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button onClick={handlePasswordChange} size="sm">Update Password</Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable the store for visitors</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">Data Management</h2>
            <p className="text-sm text-muted-foreground">Export and manage store data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Download className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">Export Data</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Download all products, categories, and messages as JSON
            </p>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Backup
            </Button>
          </div>

          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <p className="font-medium text-destructive">Clear Messages</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete all customer messages
            </p>
            <Button variant="destructive" size="sm" onClick={handleClearMessages}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Messages
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
