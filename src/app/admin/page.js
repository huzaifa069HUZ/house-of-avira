'use client';

import { useState } from 'react';
import ProductManager from '@/components/admin/ProductManager';
import ProductList from '@/components/admin/ProductList';
import { LayoutDashboard, Plus, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-screen bg-[#F5F5F7]">
      <div className="border-b border-[#d2d2d7] pb-6 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#0071e3]" />
            Control Panel
          </h1>
          <p className="text-sm text-[#86868b] mt-2 tracking-wide">Manage your inventory, orders, and storefront.</p>
        </div>
        
        {/* Apple-style Segmented Control for Tabs */}
        <div className="flex bg-[#e5e5ea] p-1 rounded-lg w-fit">
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
        </div>
      </div>

      {currentView === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['Orders', 'Customers', 'Analytics'].map((item) => (
            <div key={item} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 hover:border-[#0071e3] transition-colors cursor-pointer group">
              <h3 className="text-sm font-bold tracking-widest uppercase mb-2 text-black group-hover:text-[#0071e3] transition-colors">{item}</h3>
              <p className="text-xs text-[#86868b]">Manage your {item.toLowerCase()} here.</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        {currentView === 'list' && <ProductList onEdit={handleEdit} />}
        {(currentView === 'add' || currentView === 'edit') && (
          <ProductManager 
            initialProduct={editingProduct} 
            onSuccess={handleList}
          />
        )}
      </div>
    </div>
  );
}
