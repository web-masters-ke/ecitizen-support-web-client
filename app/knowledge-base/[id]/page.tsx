'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Loader2,
  Eye,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  ArrowRight,
} from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { kbApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface KBArticle {
  id: string
  title: string
  content: string
  excerpt?: string
  category?: { id: string; name: string }
  tags?: string[]
  viewCount?: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export default function KBArticlePage() {
  const params = useParams()
  const articleId = params.id as string

  const [article, setArticle] = useState<KBArticle | null>(null)
  const [related, setRelated] = useState<KBArticle[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState<'helpful' | 'not_helpful' | null>(null)

  useEffect(() => {
    if (!articleId) return
    kbApi
      .article(articleId)
      .then((res) => {
        const art = res.data.data
        setArticle(art)
        // Fetch related articles in same category
        if (art.category?.id) {
          kbApi
            .articles({ categoryId: art.category.id, status: 'PUBLISHED', limit: 3 })
            .then((rRes) => {
              const d = rRes.data.data
              const all: KBArticle[] = Array.isArray(d) ? d : (d?.items ?? [])
              setRelated(all.filter((a) => a.id !== articleId).slice(0, 3))
            })
            .catch(() => {})
        }
      })
      .catch(() => setError('Failed to load article'))
      .finally(() => setFetching(false))
  }, [articleId])

  const handleFeedback = async (helpful: boolean) => {
    if (feedback) return
    try {
      await kbApi.feedback(articleId, helpful)
      setFeedback(helpful ? 'helpful' : 'not_helpful')
    } catch {
      // silently ignore
    }
  }

  if (fetching) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    )
  }

  if (error || !article) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-sm text-destructive mb-4">{error || 'Article not found'}</p>
          <Link href="/knowledge-base" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Knowledge Base
          </Link>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/knowledge-base" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Knowledge Base
          </Link>
          {article.category && (
            <>
              <span>/</span>
              <span>{article.category.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Article header */}
        <div className="mb-8">
          {article.category && (
            <span className="inline-flex rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 mb-3">
              {article.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Published {formatDate(article.publishedAt ?? article.createdAt)}
            </span>
            {article.viewCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {article.viewCount.toLocaleString()} views
              </span>
            )}
          </div>
        </div>

        {/* Article content */}
        <div
          className="prose dark:prose-invert max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted text-muted-foreground text-xs px-3 py-1 hover:bg-muted/70 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Feedback section */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            {feedback ? (
              <div className="flex flex-col items-center gap-2">
                {feedback === 'helpful' ? (
                  <ThumbsUp className="h-8 w-8 text-green-500" />
                ) : (
                  <ThumbsDown className="h-8 w-8 text-red-500" />
                )}
                <p className="text-sm font-medium text-foreground">Thank you for your feedback!</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground mb-4">Was this article helpful?</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleFeedback(true)}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    Yes, helpful
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                    Not helpful
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/knowledge-base/${rel.id}`}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {rel.title}
                  </h3>
                  {rel.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{rel.excerpt}</p>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-border">
          <Link
            href="/knowledge-base"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <BookOpen className="h-4 w-4" />
            Back to Knowledge Base
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}
