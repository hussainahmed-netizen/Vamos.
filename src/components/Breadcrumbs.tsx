import React from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  label: string;
  onClick?: () => void;
  isCurrent?: boolean;
}

export const Breadcrumbs: React.FC = () => {
  const {
    products,
    categories,
    view,
    setView,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    selectedProductId,
    selectedOrderId,
    accountTab,
    searchQuery,
    navigateToAccount,
    navigateToCategory
  } = useStore();

  // Hide breadcrumb trail completely on the homepage
  if (view === 'home') {
    return null;
  }

  const items: BreadcrumbItem[] = [];

  // 1. Always start with Home
  items.push({
    id: 'home',
    label: 'Home',
    onClick: () => setView('home')
  });

  if (view === 'shop') {
    if (selectedCategory === 'all') {
      items.push({
        id: 'shop',
        label: 'Shop Catalog',
        isCurrent: !searchQuery,
        onClick: searchQuery ? () => setSelectedCategory('all', null) : undefined
      });

      if (searchQuery) {
        items.push({
          id: 'search',
          label: `Search: "${searchQuery}"`,
          isCurrent: true
        });
      }
    } else {
      items.push({
        id: 'shop',
        label: 'Shop Catalog',
        onClick: () => setSelectedCategory('all', null)
      });

      const catObj = categories.find((c) => c.id === selectedCategory);
      const catName = catObj?.name || selectedCategory;

      items.push({
        id: `cat-${selectedCategory}`,
        label: catName,
        onClick: selectedSubCategory ? () => setSelectedCategory(selectedCategory, null) : undefined,
        isCurrent: !selectedSubCategory
      });

      if (selectedSubCategory) {
        const subObj = catObj?.subCategories?.find((s) => s.id === selectedSubCategory);
        const subName = subObj?.name || selectedSubCategory;

        items.push({
          id: `sub-${selectedSubCategory}`,
          label: subName,
          isCurrent: true
        });
      }
    }
  } else if (view === 'product') {
    const product = products.find((p) => p.id === selectedProductId) || products[0];
    const catObj = categories.find((c) => c.id === product?.category);
    const catName = catObj?.name || product?.categoryName || 'Shop Catalog';
    const subObj = catObj?.subCategories?.find((s) => s.id === product?.subCategory);
    const subName =
      subObj?.name ||
      (product?.subCategory
        ? product.subCategory.charAt(0).toUpperCase() + product.subCategory.slice(1)
        : null);

    if (product?.category) {
      items.push({
        id: `cat-${product.category}`,
        label: catName,
        onClick: () => navigateToCategory(product.category, null)
      });
    } else {
      items.push({
        id: 'shop',
        label: 'Shop Catalog',
        onClick: () => setSelectedCategory('all', null)
      });
    }

    if (product?.subCategory && subName) {
      items.push({
        id: `sub-${product.subCategory}`,
        label: subName,
        onClick: () => navigateToCategory(product.category, product.subCategory)
      });
    }

    items.push({
      id: `prod-${product.id}`,
      label: product.name,
      isCurrent: true
    });
  } else if (view === 'cart') {
    items.push({
      id: 'cart',
      label: 'Shopping Cart',
      isCurrent: true
    });
  } else if (view === 'checkout') {
    items.push({
      id: 'cart',
      label: 'Shopping Cart',
      onClick: () => setView('cart')
    });
    items.push({
      id: 'checkout',
      label: 'Express Checkout',
      isCurrent: true
    });
  } else if (view === 'order-success') {
    items.push({
      id: 'order-success',
      label: 'Order Confirmation',
      isCurrent: true
    });
  } else if (view === 'wishlist') {
    items.push({
      id: 'wishlist',
      label: 'My Wishlist',
      isCurrent: true
    });
  } else if (view === 'account') {
    items.push({
      id: 'account',
      label: 'My Account',
      onClick: accountTab !== 'overview' || selectedOrderId ? () => navigateToAccount('overview') : undefined,
      isCurrent: accountTab === 'overview' && !selectedOrderId
    });

    if (selectedOrderId) {
      items.push({
        id: 'account-orders',
        label: 'My Orders',
        onClick: () => navigateToAccount('orders')
      });
      items.push({
        id: `order-${selectedOrderId}`,
        label: `Order #${selectedOrderId}`,
        isCurrent: true
      });
    } else if (accountTab === 'orders') {
      items.push({
        id: 'account-orders',
        label: 'My Orders',
        isCurrent: true
      });
    } else if (accountTab === 'reviews') {
      items.push({
        id: 'account-reviews',
        label: 'My Reviews',
        isCurrent: true
      });
    } else if (accountTab === 'returns') {
      items.push({
        id: 'account-returns',
        label: 'My Returns & Cancellations',
        isCurrent: true
      });
    }
  }

  return (
    <div className={`bg-white/80 border-b border-slate-200/80 backdrop-blur-xs py-1.5 px-4 sm:px-6 lg:px-8 transition-all ${view === 'cart' || view === 'checkout' ? 'hidden md:block' : ''}`}>
      <div className="max-w-[1536px] mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={item.id + index}>
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                )}

                {item.isCurrent || isLast || !item.onClick ? (
                  <span
                    className="text-[#2C3539] font-semibold truncate max-w-[160px] sm:max-w-[320px] md:max-w-[600px] shrink"
                    title={item.label}
                    aria-current={item.isCurrent ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="hover:text-[#2B080C] hover:underline transition-colors flex items-center gap-1 shrink-0 text-left"
                  >
                    {index === 0 && <Home className="w-3 h-3 text-slate-400 group-hover:text-[#2B080C]" />}
                    <span>{item.label}</span>
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
