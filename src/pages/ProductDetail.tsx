import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const addToCart = useStore((state) => state.addToCart);

  const product = products.find((p) => p.id === id);
  const category = product ? categories.find((c) => c.id === product.categoryId) : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <Link to="/products">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.isActive && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-muted-foreground font-medium text-lg">Unavailable</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {category && (
                <span className="inline-block text-primary text-sm font-medium uppercase tracking-wider">
                  {category.name}
                </span>
              )}

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center gap-4">
                <span className="font-display text-4xl font-bold text-primary glow-text">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                {product.stock > 10 ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-amber-500">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Only {product.stock} left</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="hero"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.isActive || product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Link to="/products" className="flex-1">
                  <Button variant="outline" size="xl" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="border-t border-border pt-6 mt-6">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Product Features
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    1 Year warranty included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Free shipping worldwide
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    30-day return policy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default ProductDetail;
