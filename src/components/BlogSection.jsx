import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blogs';
import { BookOpen, Clock, User, ArrowRight, X, Globe } from 'lucide-react';

export default function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Blog Section Visual Hero Banner - High Visibility Image */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-200 p-8 sm:p-12 shadow-xl min-h-[320px] flex items-center">
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85 bg-cover bg-center"
          style={{ backgroundImage: `url('/b2b_trade_blog_banner.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />
        
        <div className="relative z-10 max-w-3xl space-y-4 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-600/40 text-indigo-200 text-xs font-bold border border-indigo-400/40 backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-indigo-300" />
            <span>B2B Trade Insights & Market Guides</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Wholesale Sourcing & <span className="text-indigo-300">Nepal-India Trade Intelligence</span>
          </h2>

          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
            Expert trade analysis, industrial machinery sourcing tutorials, spice exporting regulations, and WhatsApp lead conversion strategies.
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map(post => (
          <div
            key={post.id}
            onClick={() => setSelectedArticle(post)}
            className="glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/b2b_trade_blog_banner.png';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-bold text-indigo-600 border border-slate-200 shadow-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-500 font-medium truncate max-w-[180px]">
                By {post.author.split('(')[0]}
              </span>
              <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/b2b_trade_blog_banner.png';
                }}
              />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition-colors shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    {selectedArticle.author}
                  </span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                </div>
              </div>

              <div className="prose prose-slate text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
                {selectedArticle.content}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
