import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { useStore } from "@/lib/store";

const Index = () => {
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);

  const featuredProducts = products.filter((p) => p.isActive).slice(0, 6);
  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-2xl animate-float" />
        
        <div className="container mx-auto px-4 relative z-10 text-center pt-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <span className="inline-block text-primary font-medium uppercase tracking-widest text-sm animate-pulse-glow px-4 py-2 rounded-full border border-primary/30">
              Premium Tech Store
            </span>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Elevate Your
              <span className="block text-primary glow-text">Digital Life</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Discover cutting-edge technology and premium accessories. 
              Quality products that redefine your experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/products">
                <Button variant="hero" size="xl">
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Fast Delivery</h3>
                <p className="text-muted-foreground text-sm">Express shipping worldwide</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Secure Payment</h3>
                <p className="text-muted-foreground text-sm">100% protected transactions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Free Returns</h3>
                <p className="text-muted-foreground text-sm">30-day money back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by <span className="text-primary glow-text">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Explore our curated collection of premium products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCategories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative h-48 rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 gradient-primary opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    Browse <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured <span className="text-primary glow-text">Products</span>
              </h2>
              <p className="text-muted-foreground">
                Handpicked selections for tech enthusiasts
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative p-12 md:p-20 text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
                Ready to <span className="text-primary glow-text">Level Up</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Join thousands of satisfied customers and discover why NEXUS is the ultimate destination for premium tech.
              </p>
              <Link to="/products">
                <Button variant="hero" size="xl">
                  Start Shopping
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
