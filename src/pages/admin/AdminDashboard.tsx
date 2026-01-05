import { Package, FolderOpen, MessageSquare, DollarSign, TrendingUp, Users } from "lucide-react";
import { useStore } from "@/lib/store";

const AdminDashboard = () => {
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const messages = useStore((state) => state.messages);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "from-primary to-accent",
    },
    {
      label: "Active Products",
      value: products.filter((p) => p.isActive).length,
      icon: TrendingUp,
      color: "from-primary to-accent",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: FolderOpen,
      color: "from-primary to-accent",
    },
    {
      label: "Unread Messages",
      value: messages.filter((m) => !m.isRead).length,
      icon: MessageSquare,
      color: "from-primary to-accent",
    },
  ];

  const recentMessages = messages.slice(-5).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="font-display text-3xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Recent Products
          </h2>
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
                  <p className="text-sm text-muted-foreground">${product.price}</p>
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
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Recent Messages
          </h2>
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
    </div>
  );
};

export default AdminDashboard;
