export function SiteFooter() {
  return (
    <footer className="bg-white mt-16 py-12 border-t border-slate-200">
      <div className="max-w-[1730px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Contact Info */}
        <div>
          <h4 className="font-black text-slate-900 mb-4 uppercase tracking-tighter text-xl">CRM Tech<span className="text-blue-600">.</span></h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Your ultimate destination for high-performance laptops, custom PC builds, and premium gaming gear.
          </p>
          <div className="text-sm text-slate-700 font-bold space-y-1">
            <p className="text-blue-600 text-lg">+27 11 123 4567</p>
            <p>support@crmtech.com</p>
          </div>
        </div>

        {/* Shop by Category */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Shop by Category</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Gaming Laptops</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">PC Components</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Monitors & Displays</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Networking Gear</a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Customer Service</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Track Your Order</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Returns & Exchanges</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Shipping Information</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">FAQs & Support</a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Legal</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Cookie Policy</a>
            </li>
          </ul>
        </div>
        
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-[1730px] mx-auto px-4 mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} CRM Technologies. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
           <span>SECURE CHECKOUT</span>
           <div className="flex gap-2">
             <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
             <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
             <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
           </div>
        </div>
      </div>
    </footer>
  );
}
