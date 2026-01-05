import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, useStore } from "@/lib/store";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useStore((state) => state.addToCart);
  const categories = useStore((state) => state.categories);

  const category = categories.find((c) => c.id === product.categoryId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:glow">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {!product.isActive && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Unavailable</span>
            </div>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {category && (
            <span className="text-primary text-xs font-medium uppercase tracking-wider">
              {category.name}
            </span>
          )}
          <h3 className="font-display font-semibold text-foreground line-clamp-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="font-display text-xl font-bold text-primary glow-text">
              ${product.price.toFixed(2)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.isActive || product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
