import { Package, FolderOpen, MessageSquare, TrendingUp, Users, DollarSign, Eye, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const messages = useStore((state) => state.messages);
  const cart = useStore((state) => state.cart);

  // Calculate metrics
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10 && p.isActive);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      change: "+12%",
      isPositive: true,
    },
    {
      label: "Active Products",
      value: products.filter((p) => p.isActive).length,
      icon: TrendingUp,
      change: "+8%",
      isPositive: true,
    },
    {
      label: "Categories",
      value: categories.length,
      icon: FolderOpen,
      change: "0%",
      isPositive: true,
    },
    {
      label: "Unread Messages",
      value: messages.filter((m) => !m.isRead).length,
      icon: MessageSquare,
      change: messages.filter((m) => !m.isRead).length > 0 ? "New" : "0",
      isPositive: messages.filter((m) => !m.isRead).length === 0,
    },
    {
      label: "Inventory Value",
      value: `$${totalInventoryValue.toLocaleString()}`,
      icon: DollarSign,
      change: "+5%",
      isPositive: true,
    },
    {
      label: "Total Stock",
      value: totalStock,
      icon: ShoppingCart,
      change: lowStockProducts.length > 0 ? `${lowStockProducts.length} low` : "OK",
      isPositive: lowStockProducts.length === 0,
    },
  ];

  const recentMessages = messages.slice(-5).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your store.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Link to="/admin/messages">
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="font-display text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
                <div className={`flex items-center gap-1 mt-1 text-xs ${stat.isPositive ? "text-green-500" : "text-destructive"}`}>
                  {stat.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts.length} product(s) have low stock (less than 10 units)
              </p>
            </div>
            <Link to="/admin/products">
              <Button variant="outline" size="sm">
                View Products
              </Button>
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {lowStockProducts.slice(0, 5).map((product) => (
              <span key={product.id} className="px-2 py-1 bg-background rounded-md text-xs text-foreground">
                {product.name} ({product.stock})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Recent Products
            </h2>
            <Link to="/admin/products" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {products.slice(-5).reverse().map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price} • Stock: {product.stock}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Recent Messages
            </h2>
            <Link to="/admin/messages" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{message.customerName}</p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        message.isRead
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {message.isRead ? "Read" : "New"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No messages yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/products" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center group">
            <Package className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="mt-2 text-sm font-medium text-foreground">Manage Products</p>
          </Link>
          <Link to="/admin/categories" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center group">
            <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="mt-2 text-sm font-medium text-foreground">Manage Categories</p>
          </Link>
          <Link to="/admin/messages" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center group">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="mt-2 text-sm font-medium text-foreground">View Messages</p>
          </Link>
          <Link to="/admin/settings" className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center group">
            <Eye className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="mt-2 text-sm font-medium text-foreground">Store Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
