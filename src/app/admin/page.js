'use client';

import { useState } from 'react';
import ProductManager from '@/components/admin/ProductManager';
import ProductList from '@/components/admin/ProductList';
import CartAnalytics from '@/components/admin/CartAnalytics';
import CouponManager from '@/components/admin/CouponManager';
import BannerManager from '@/components/admin/BannerManager';
import OrderManager from '@/components/admin/OrderManager';
import AddManualOrder from '@/components/admin/AddManualOrder';
import CollectionManager from '@/components/admin/CollectionManager';
import { LayoutDashboard, Plus, Package, BarChart3, Ticket, ImageIcon, Ship, ShoppingBag, ListVideo } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit', 'orders', 'add-order', 'collections'
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();

  const handleEdit = (product) => {
    setEditingProduct(product);
    setCurrentView('edit');
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setCurrentView('add');
  };

  const handleList = () => {
    setEditingProduct(null);
    setCurrentView('list');
  };

  const handleOrders = () => {
    setEditingProduct(null);
    setCurrentView('orders');
  };

  const handleAddOrder = () => {
    setEditingProduct(null);
    setCurrentView('add-order');
  };

  const handleAnalytics = () => {
    setEditingProduct(null);
    setCurrentView('analytics');
  };

  const handleCoupons = () => {
    setEditingProduct(null);
    setCurrentView('coupons');
  };

  const handleBanners = () => {
    setEditingProduct(null);
    setCurrentView('banners');
  };

  const handleCollections = () => {
    setEditingProduct(null);
    setCurrentView('collections');
  };

  const handleShipping = () => {
    router.push('/admin/shipping');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-screen bg-[#F5F5F7]">
      <div className="border-b border-[#d2d2d7] pb-6 mb-8 flex flex-col xl:flex-row xl:justify-between xl:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#0071e3]" />
            Control Panel
          </h1>
          <p className="text-sm text-[#86868b] mt-2 tracking-wide">Manage your inventory, orders, and storefront.</p>
        </div>
        
        {/* Apple-style Segmented Control for Tabs */}
        <div className="flex flex-wrap gap-1 bg-[#e5e5ea] p-1 rounded-lg w-full xl:w-fit justify-start">
          <button 
            onClick={handleList}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'list' ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}
          >
            <Package className="w-4 h-4" />
            Dashboard
          </button>
          <button 
            onClick={handleAdd}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'add' || currentView === 'edit' ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}
          >
            <Plus className="w-4 h-4" />
            {currentView === 'edit' ? 'Edit Product' : 'Add Product'}
          </button>
          <button 
            onClick={handleOrders}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'orders' ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders
          </button>
          <button 
            onClick={handleCollections}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'collections' ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}
          >
            <ListVideo className="w-4 h-4" />
            Collections
          </button>
          <button 
            onClick={handleShipping}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all text-[#86868b] hover:text-black`}
          >
            <Ship className="w-4 h-4" />
            Shipping
          </button>
          <button 
            onClick={handleAnalytics}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'analytics' ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button 
            onClick={handleCoupons}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'coupons' ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}
          >
            <Ticket className="w-4 h-4" />
            Coupons
          </button>
          <button 
            onClick={handleBanners}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'banners' ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-black'}`}
          >
            <ImageIcon className="w-4 h-4" />
            Banners
          </button>
        </div>
      </div>

      {currentView === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {['Orders', 'Collections', 'Shipping', 'Customers', 'Analytics'].map((item) => (
            <div 
              key={item} 
              onClick={() => {
                if (item === 'Analytics') handleAnalytics();
                else if (item === 'Shipping') handleShipping();
                else if (item === 'Orders') handleOrders();
                else if (item === 'Collections') handleCollections();
              }}
              className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 hover:border-[#0071e3] transition-colors cursor-pointer group"
            >
              <h3 className="font-perandory text-sm font-bold tracking-widest uppercase mb-2 text-black group-hover:text-[#0071e3] transition-colors">{item}</h3>
              <p className="text-xs text-[#86868b]">Manage your {item.toLowerCase()} here.</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        {currentView === 'list' && <ProductList onEdit={handleEdit} />}
        {currentView === 'orders' && <OrderManager onAddOrder={handleAddOrder} />}
        {currentView === 'add-order' && <AddManualOrder onSuccess={handleOrders} onCancel={handleOrders} />}
        {currentView === 'collections' && <CollectionManager />}
        {(currentView === 'add' || currentView === 'edit') && (
          <ProductManager 
            initialProduct={editingProduct} 
            onSuccess={handleList}
          />
        )}
        {currentView === 'analytics' && <CartAnalytics />}
        {currentView === 'coupons' && <CouponManager />}
        {currentView === 'banners' && <BannerManager />}
      </div>
    </div>
  );
}
