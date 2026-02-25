'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react'
import { kbApi } from '@/lib/api'

interface KBArticle {
  id: string
  title: string
  content: string
  excerpt?: string
  category?: { id: string; name: string }
}

const FALLBACK_ARTICLES = [
  {
    id: '',
    title: 'How to Apply for a National ID Card',
    excerpt: 'Step-by-step guide covering required documents, processing times, and how to check your application status.',
    category: { id: '', name: 'Identity' },
  },
  {
    id: '',
    title: 'Passport Application Guide 2025',
    excerpt: 'Everything you need — booking an appointment, required photos, fees, and collection procedure.',
    category: { id: '', name: 'Travel' },
  },
  {
    id: '',
    title: 'Complete Guide to Business Registration in Kenya',
    excerpt: 'How to register your company, partnership, or sole proprietorship through the BRS online portal.',
    category: { id: '', name: 'Business' },
  },
]

export function HomepageKBSection() {
  const [articles, setArticles] = useState<KBArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    kbApi
      .articles({ publishedOnly: true, limit: 3, page: 1 })
      .then((res) => {
        const d = res.data.data
        const list: KBArticle[] = Array.isArray(d)
          ? d
          : d?.items ?? d?.articles ?? d?.data ?? []
        setArticles(list.slice(0, 3))
      })
      .catch(() => {
        // keep empty — will use fallback links to KB listing
      })
      .finally(() => setLoading(false))
  }, [])

  const display = articles.length > 0 ? articles : (loading ? [] : FALLBACK_ARTICLES)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="h-4 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          </div>
        ))
      ) : display.length === 0 ? (
        <div className="col-span-3 text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
        </div>
      ) : (
        display.map((article, idx) => (
          <Link
            key={article.id || idx}
            href={article.id ? `/knowledge-base/${article.id}` : '/knowledge-base'}
            className="group flex flex-col bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
          >
            {article.category && (
              <span className="inline-flex w-fit rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 mb-4">
                {article.category.name}
              </span>
            )}
            <h3 className="text-base font-semibold text-foreground mb-2 leading-snug flex-1 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {article.excerpt ??
                article.content?.replace(/<[^>]*>/g, '').slice(0, 150)}
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Read More <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
