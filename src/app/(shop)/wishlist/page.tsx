import WishlistItem from "@/components/WishlistItem"
import Title from "@/components/common/Title"
const wishlistItems = [
  {
    id: 1,
    name: "Premium Leather Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop",
    inStock: true,
  },
  {
    id: 2,
    name: "Converse All Star Hi Black Canvas",
    price: 399,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
    inStock: false,
  },
]

export default function WishlistPage() {
  return (
    <section className="max-w-7xl mx-auto py-16">
        <div className="text-3xl mb-10 font-semibold ">
        <Title text1={'WISHLIST'} text2={''}/>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="space-y-6">
          {wishlistItems.map((item) => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

function EmptyWishlist() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold mb-2">
        Your wishlist is empty ❤️
      </h2>
      <p className="text-muted-foreground">
        Start adding products you love
      </p>
    </div>
  )
}
