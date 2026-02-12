import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="relative border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-xl pt-24 pb-12 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
                            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">SupportHub</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-8 text-slate-300">
                            Forging the future of customer relationships with precision engineering and algorithmic intelligence.
                        </p>
                        <div className="flex space-x-4">
                            {['𝕏', 'in', 'fb', 'ig'].map((icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white text-slate-300 transition-all duration-300 cursor-pointer flex items-center justify-center hover:-translate-y-1 shadow-lg shadow-black/20">
                                    <span className="text-xs font-bold">{icon}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-8 text-xs uppercase tracking-[0.2em] text-indigo-400">Product</h3>
                        <ul className="space-y-4 text-sm">
                            {['Features', 'Intelligence', 'Integrations', 'Changelog', 'Roadmap'].map((item) => (
                                <li key={item}><Link href="#" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-8 text-xs uppercase tracking-[0.2em] text-indigo-400">Company</h3>
                        <ul className="space-y-4 text-sm">
                            {['About Us', 'Careers', 'Blog', 'Contact', 'Partners'].map((item) => (
                                <li key={item}><Link href="#" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-8 text-xs uppercase tracking-[0.2em] text-indigo-400">Legal</h3>
                        <ul className="space-y-4 text-sm">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                                <li key={item}><Link href="#" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-slate-800/50 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} SupportHub Inc. All rights reserved.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0 font-medium">
                        <Link href="#" className="hover:text-indigo-400 transition-colors">System Status</Link>
                        <Link href="#" className="hover:text-indigo-400 transition-colors">Security</Link>
                        <Link href="#" className="hover:text-indigo-400 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
