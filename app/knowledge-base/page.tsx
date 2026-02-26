'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, BookOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { kbApi } from '@/lib/api'
import { truncate } from '@/lib/utils'

interface KBCategory {
  id: string
  name: string
}

interface KBArticle {
  id: string
  title: string
  content?: string
  excerpt?: string
  summary?: string
  category?: { id: string; name: string }
  tags?: string[]
  viewCount?: number
  publishedAt?: string
  createdAt: string
}

export default function KnowledgeBasePage() {
  const [categories, setCategories] = useState<KBCategory[]>([])
  const [articles, setArticles] = useState<KBArticle[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  // Load categories
  useEffect(() => {
    kbApi.categories().then((res) => {
      const d = res.data.data
      setCategories(Array.isArray(d) ? d : (d?.items ?? []))
    }).catch(() => {})
  }, [])

  const fetchArticles = useCallback(async () => {
    setFetching(true)
    setError('')
    try {
      const params: Record<string, string | number | boolean> = {
        publishedOnly: true,
        limit: 12,
        page,
      }
      if (search) params.search = search
      if (activeCategory !== 'ALL') params.categoryId = activeCategory

      const res = await kbApi.articles(params)
      const payload = res.data.data
      if (Array.isArray(payload)) {
        setArticles(payload)
        setTotalPages(1)
      } else {
        setArticles(payload?.data ?? payload?.items ?? payload?.articles ?? [])
        setTotalPages(payload?.pagination?.totalPages ?? payload?.meta?.totalPages ?? payload?.totalPages ?? 1)
      }
    } catch {
      setError('Failed to load articles.')
    } finally {
      setFetching(false)
    }
  }, [page, search, activeCategory])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[hsl(170,80%,18%)] via-[hsl(170,75%,24%)] to-[hsl(175,70%,30%)] text-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 mx-auto mb-4">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Knowledge Base</h1>
          <p className="text-white/80 text-lg mb-8">
            Find answers to your questions about government services in Kenya
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search articles…"
              className="w-full rounded-xl bg-white/10 border border-white/20 pl-12 pr-4 py-3 text-white placeholder:text-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setActiveCategory('ALL'); setPage(1) }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === 'ALL'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setPage(1) }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Articles grid */}
        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                <div className="h-5 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-14 w-14 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No articles found</p>
            <p className="text-sm text-muted-foreground">
              {search ? 'Try different search terms' : 'No articles in this category yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/knowledge-base/${article.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                {article.category && (
                  <span className="inline-flex w-fit rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-0.5 mb-3">
                    {article.category.name}
                  </span>
                )}
                <h3 className="text-base font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                  {article.excerpt ?? article.summary ?? truncate(article.content?.replace(/<[^>]*>/g, '') ?? '', 150)}
                </p>
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-muted text-muted-foreground text-xs px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!fetching && articles.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
