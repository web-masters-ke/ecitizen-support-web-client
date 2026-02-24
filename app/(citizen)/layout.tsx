'use client'
import { CitizenLayout } from '@/components/layout/CitizenLayout'

export default function CitizenRouteLayout({ children }: { children: React.ReactNode }) {
  return <CitizenLayout>{children}</CitizenLayout>
}
