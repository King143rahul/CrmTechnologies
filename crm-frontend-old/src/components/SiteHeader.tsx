import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingCart, ChevronDown, Menu, X, Phone, Laptop, Monitor, Wrench, Cpu, Keyboard, Network, Shield, Watch, CreditCard, ChevronRight } from "lucide-react";
import { Drawer } from "vaul";
import * as Accordion from "@radix-ui/react-accordion";

import { useNavigation, useCart } from "../hooks/useQueries";
import { formatZAR } from "../lib/formatPrice";

export function getCategoryIcon(title: string) {
  switch (title) {
    case "Laptop": return <Laptop className="w-4 h-4" />;
    case "PC's": return <Monitor className="w-4 h-4" />;
    case "Laptops Repair Item": return <Wrench className="w-4 h-4" />;
    case "Components": return <Cpu className="w-4 h-4" />;
    case "Accessories": return <Keyboard className="w-4 h-4" />;
    case "Networking": return <Network className="w-4 h-4" />;
    case "Security & CCTV": return <Shield className="w-4 h-4" />;
    case "Smart Devices": return <Watch className="w-4 h-4" />;
    case "Point Of Sale": return <CreditCard className="w-4 h-4" />;
    default: return <Cpu className="w-4 h-4" />;
  }
}

export function SiteHeader() {
  const { data: navigationData, isLoading } = useNavigation();
  const { data: cartItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any>(null);

  const cartCount = cartItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  const cartTotal = cartItems?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0;

  const selectedCategory = activeCategory || (navigationData && navigationData[0]);

  return (
    <header className="w-full bg-white flex flex-col z-50 border-b border-slate-200 sticky top-0 shadow-sm">
      
      {/* Top Utility Bar */}
      <div className="w-full bg-slate-900 text-slate-300 py-1.5 hidden md:block">
        <div className="max-w-[1730px] mx-auto px-4 flex justify-between items-center text-xs font-semibold tracking-wide">
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +27 11 123 4567</span>
            <Link to="/login" className="hover:text-white transition-colors text-blue-400">Sign In / Register</Link>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="max-w-[1730px] w-full mx-auto px-4 py-4 lg:py-6 flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-8 justify-between">
        
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-4 lg:w-1/4">
          {/* Mobile Drawer Trigger */}
          <Drawer.Root direction="left" open={mobileOpen} onOpenChange={setMobileOpen}>
            <Drawer.Trigger asChild>
              <button className="lg:hidden text-slate-900 p-2 -ml-2 rounded hover:bg-slate-100 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
              <Drawer.Content className="bg-white flex flex-col h-full w-[85%] max-w-[320px] fixed bottom-0 left-0 z-50 outline-none shadow-2xl">
                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                  <span className="text-xl font-extrabold tracking-tight uppercase">CRM Tech</span>
                  <Drawer.Close asChild>
                    <button className="p-1 hover:bg-slate-800 rounded"><X className="w-6 h-6" /></button>
                  </Drawer.Close>
                </div>
                <div className="p-4 overflow-y-auto flex-1 hide-scrollbar">
                  {/* Mobile Search */}
                  <div className="relative flex items-center w-full h-10 border border-slate-300 rounded-full mb-6 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 overflow-hidden">
                    <input type="text" placeholder="Search products, SKUs..." className="w-full bg-transparent border-none outline-none text-sm px-4" />
                    <button className="h-full px-4 bg-slate-100 border-l border-slate-300"><Search className="w-4 h-4 text-slate-600" /></button>
                  </div>
                  {/* Accordion Nav */}
                  <Accordion.Root type="single" collapsible className="w-full">
                    {navigationData?.map((cat: any) => (
                      <Accordion.Item value={cat.title} key={cat.title} className="border-b border-slate-200 last:border-0">
                        <Accordion.Header>
                          <Accordion.Trigger className="flex items-center justify-between w-full py-4 text-sm font-bold text-slate-900 group">
                            <div className="flex items-center gap-2.5">
                              {getCategoryIcon(cat.title)}
                              <span>{cat.title}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                          <div className="flex flex-col gap-2 pb-4 pl-2">
                             {cat.subcategories.map((sub: any) => {
                               const hasItems = sub.items && sub.items.length > 0;
                               if (hasItems) {
                                 return (
                                   <div key={sub.name} className="flex flex-col gap-1 mt-1">
                                     <span className="text-xs font-bold text-slate-900 px-2 uppercase tracking-wider">
                                       {sub.name}
                                     </span>
                                     <div className="flex flex-col pl-4 border-l border-slate-200 ml-2 mb-2 gap-1.5">
                                       {sub.items.map((item: string) => (
                                         <Link key={item} to="/" onClick={() => setMobileOpen(false)} className="text-xs font-semibold text-slate-500 hover:text-blue-700 py-0.5">
                                           {item}
                                         </Link>
                                       ))}
                                     </div>
                                   </div>
                                 );
                               }
                               return (
                                 <Link key={sub.name} to="/" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-slate-700 hover:text-blue-700 px-2 py-1">
                                   {sub.name}
                                 </Link>
                               );
                             })}
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl lg:text-3xl font-black tracking-tighter text-slate-900 uppercase">
              CRM Tech<span className="text-blue-600">.</span>
            </span>
          </Link>
        </div>

        {/* Center: Massive Search Bar (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 max-w-3xl">
          <div className="relative flex items-center w-full h-12 border-2 border-slate-300 rounded-full overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
            <input
              type="text"
              placeholder="Search by product name, category, or SKU..."
              className="w-full h-full bg-transparent border-none outline-none text-base text-slate-900 px-6 placeholder-slate-400"
            />
            <button className="h-full px-8 bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center text-white font-bold tracking-wide">
              SEARCH
            </button>
          </div>
        </div>

        {/* Right: Account & Cart */}
        <div className="flex items-center gap-4 lg:gap-6 lg:w-1/4 justify-end flex-shrink-0">
          <Link to="/login" className="hidden sm:flex items-center gap-2 group cursor-pointer text-slate-700 hover:text-blue-600 transition-colors">
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-blue-50">
               <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none">Account</span>
               <span className="text-sm font-bold leading-tight">Sign In</span>
            </div>
          </Link>
          
          <Link to="/cart" className="flex items-center gap-2 group cursor-pointer text-slate-700 hover:text-blue-600 transition-colors">
            <div className="p-2 bg-slate-100 rounded-full relative group-hover:bg-blue-50">
               <ShoppingCart className="w-5 h-5" />
               {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                   {cartCount}
                 </span>
               )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none">Basket</span>
               <span className="text-sm font-bold leading-tight">{formatZAR(cartTotal, true)}</span>
            </div>
          </Link>
        </div>

        {/* Mobile Search Bar (Visible only on mobile below main header) */}
        <div className="w-full lg:hidden order-last mt-2">
           <div className="relative flex items-center w-full h-10 border border-slate-300 rounded-full overflow-hidden focus-within:border-blue-600 bg-white">
            <input type="text" placeholder="Search..." className="w-full h-full bg-transparent border-none outline-none text-sm px-4" />
            <button className="h-full px-5 bg-blue-600 text-white"><Search className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      {/* Bottom Category Navigation Bar */}
      <div 
        className="hidden lg:block w-full bg-slate-100 border-t border-slate-200 relative"
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <div className="max-w-[1730px] mx-auto px-4 flex">
           {/* All Categories Dropdown Trigger */}
           <div 
             className={`font-bold px-6 py-3.5 flex items-center gap-2 cursor-pointer transition-colors ${
               megaMenuOpen ? "bg-blue-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
             }`}
             onMouseEnter={() => setMegaMenuOpen(true)}
           >
             <Menu className="w-5 h-5" /> All Categories
           </div>
           
           {/* Horizontal Links */}
           <div className="flex items-center gap-8 ml-8 text-sm font-bold text-slate-700">
             {isLoading ? (
               <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
             ) : (
               navigationData?.slice(0, 6).map((cat: any) => (
                 <div 
                   key={cat.title} 
                   className="hover:text-blue-600 transition-colors uppercase tracking-wide py-3.5 cursor-pointer flex items-center gap-1"
                   onMouseEnter={() => {
                     setActiveCategory(cat);
                     setMegaMenuOpen(true);
                   }}
                 >
                   {cat.title}
                   <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                 </div>
               ))
             )}
             <Link to="/" className="text-red-600 hover:text-red-700 uppercase tracking-wide py-3.5">Daily Deals</Link>
           </div>
        </div>

        {/* Mega Menu Dropdown */}
        {megaMenuOpen && navigationData && (
          <div 
            className="absolute left-0 right-0 mx-auto max-w-[1730px] bg-white border border-slate-200 shadow-2xl flex z-[100] h-[550px] overflow-hidden rounded-b-xl animate-fade-in"
            onMouseEnter={() => setMegaMenuOpen(true)}
          >
            {/* Left Panel: Category List */}
            <div className="w-[300px] border-r border-slate-200 bg-slate-50 flex flex-col py-2 overflow-y-auto">
              {navigationData.map((cat: any) => (
                <div
                  key={cat.title}
                  className={`flex items-center justify-between px-6 py-3.5 text-sm font-bold text-slate-700 cursor-pointer transition-colors ${
                    selectedCategory?.title === cat.title
                      ? "bg-white text-blue-600 border-l-4 border-blue-600 pl-5"
                      : "hover:bg-slate-100 hover:text-blue-600"
                  }`}
                  onMouseEnter={() => setActiveCategory(cat)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{getCategoryIcon(cat.title)}</span>
                    <span>{cat.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 ${
                    selectedCategory?.title === cat.title ? "text-blue-600" : ""
                  }`} />
                </div>
              ))}
            </div>

            {/* Right Panel: Nested Subcategories */}
            <div className="flex-1 p-8 overflow-y-auto bg-white">
              {selectedCategory && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                    {getCategoryIcon(selectedCategory.title)}
                    <span>{selectedCategory.title}</span>
                  </h3>
                  
                  {/* Grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {selectedCategory.subcategories.map((sub: any) => {
                      const hasItems = sub.items && sub.items.length > 0;
                      return (
                        <div key={sub.name} className="flex flex-col gap-2">
                          <span className="text-sm font-bold text-slate-900 tracking-wide hover:text-blue-600 cursor-pointer">
                            {sub.name}
                          </span>
                          {hasItems && (
                            <div className="flex flex-col gap-1.5 pl-2.5 border-l border-slate-200">
                              {sub.items.map((item: string) => (
                                <Link 
                                  key={item} 
                                  to="/" 
                                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 hover:underline transition-colors"
                                >
                                  {item}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </header>
  );
}
