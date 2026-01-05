import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomerAuth } from "@/lib/customerAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Package, Heart, Settings, LogOut, ShoppingBag, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useStore } from "@/lib/store";

const Account = () => {
  const { user, logout, updateProfile, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const products = useStore((state) => state.products);

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist" | "settings">("profile");
  const [name, setName] = useState(user?.name || "");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    updateProfile({ name: name.trim() });
    toast.success("Profile updated successfully");
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  const cartTotal = cart.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                My Account
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="glass rounded-2xl p-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                  <hr className="border-border my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="glass rounded-2xl p-4 mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Cart Items</span>
                    <span className="font-semibold text-foreground">{cart.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Cart Total</span>
                    <span className="font-semibold text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="glass rounded-2xl p-6">
                  {activeTab === "profile" && (
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground mb-6">
                        Profile Information
                      </h2>
                      <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="mt-1 bg-muted"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                        </div>
                        <div>
                          <Label>Member Since</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <Button type="submit">Update Profile</Button>
                      </form>
                    </div>
                  )}

                  {activeTab === "orders" && (
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground mb-6">
                        Order History
                      </h2>
                      <div className="text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No orders yet</p>
                        <Link to="/products">
                          <Button>
                            Start Shopping
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab === "wishlist" && (
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground mb-6">
                        My Wishlist
                      </h2>
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                        <Link to="/products">
                          <Button>
                            Browse Products
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground mb-6">
                        Account Settings
                      </h2>
                      <div className="space-y-6">
                        <div className="p-4 rounded-xl border border-border">
                          <h3 className="font-semibold text-foreground mb-2">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Manage your email preferences for orders and promotions.
                          </p>
                          <Button variant="outline" size="sm">Manage Preferences</Button>
                        </div>
                        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5">
                          <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all associated data.
                          </p>
                          <Button variant="destructive" size="sm">Delete Account</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
