'use client'

import { useAuthStore, useUIStore, useConnectionStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard, ShoppingCart, Package, Boxes, Receipt, Users, Award,
  Truck, Building2, Wallet, Receipt as ReceiptIcon, BarChart3, Settings,
  ScrollText, LogOut, Wifi, WifiOff, RefreshCw, Menu, Moon, Sun, Tags, Zap,
  PanelLeftClose, PanelLeftOpen, Monitor, Hexagon, ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

// ============================================================
// NexFlow System — Grouped Module Navigation
// ============================================================
// Modules organized into logical groups matching business workflows:
//   • العمليات (Operations): POS, sales, cash
//   • المخزون (Inventory): products, categories, inventory, purchases, suppliers
//   • المحاسبة (Accounting): expenses, reports, audit
//   • العملاء (CRM): customers, loyalty
//   • النظام (System): employees, settings, desktop download, offline test
// ============================================================

interface ModuleDef {
  id: string
  label: string
  icon: any
  roles: string[]
  badge?: string
}

interface ModuleGroup {
  label: string
  icon: any
  modules: ModuleDef[]
}

const MODULE_GROUPS: ModuleGroup[] = [
  {
    label: 'العمليات',
    icon: ShoppingCart,
    modules: [
      { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['ADMIN','MANAGER','CASHIER','ACCOUNTANT'] },
      { id: 'pos', label: 'نقطة البيع', icon: ShoppingCart, roles: ['ADMIN','MANAGER','CASHIER'] },
      { id: 'sales', label: 'المبيعات', icon: Receipt, roles: ['ADMIN','MANAGER','CASHIER','ACCOUNTANT'] },
      { id: 'cash', label: 'الخزنة', icon: Wallet, roles: ['ADMIN','MANAGER','CASHIER'] },
    ],
  },
  {
    label: 'المخزون',
    icon: Boxes,
    modules: [
      { id: 'products', label: 'المنتجات', icon: Package, roles: ['ADMIN','MANAGER','WAREHOUSE'] },
      { id: 'categories', label: 'الفئات', icon: Tags, roles: ['ADMIN','MANAGER','WAREHOUSE'] },
      { id: 'inventory', label: 'المخزون', icon: Boxes, roles: ['ADMIN','MANAGER','WAREHOUSE'], badge: 'low' },
      { id: 'purchases', label: 'المشتريات', icon: Truck, roles: ['ADMIN','MANAGER','WAREHOUSE'] },
      { id: 'suppliers', label: 'الموردون', icon: Building2, roles: ['ADMIN','MANAGER','WAREHOUSE'] },
    ],
  },
  {
    label: 'العملاء',
    icon: Users,
    modules: [
      { id: 'customers', label: 'العملاء', icon: Users, roles: ['ADMIN','MANAGER','CASHIER'] },
      { id: 'loyalty', label: 'نقاط الولاء', icon: Award, roles: ['ADMIN','MANAGER'] },
    ],
  },
  {
    label: 'المحاسبة',
    icon: ReceiptIcon,
    modules: [
      { id: 'expenses', label: 'المصروفات', icon: ReceiptIcon, roles: ['ADMIN','MANAGER','ACCOUNTANT'] },
      { id: 'reports', label: 'التقارير', icon: BarChart3, roles: ['ADMIN','MANAGER','ACCOUNTANT'] },
      { id: 'audit', label: 'سجل العمليات', icon: ScrollText, roles: ['ADMIN'] },
    ],
  },
  {
    label: 'النظام',
    icon: Settings,
    modules: [
      { id: 'employees', label: 'الموظفون', icon: Users, roles: ['ADMIN'] },
      { id: 'offline-test', label: 'الأوفلين والاختبار', icon: Zap, roles: ['ADMIN','MANAGER'] },
      { id: 'desktop', label: 'تحميل البرنامج', icon: Monitor, roles: ['ADMIN','MANAGER','CASHIER'] },
      { id: 'settings', label: 'الإعدادات', icon: Settings, roles: ['ADMIN'] },
    ],
  },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const { activeModule, setModule, sidebarOpen, setSidebar, theme, toggleTheme } = useUIStore()
  const { online, syncing, pendingSync } = useConnectionStore()
  const [mounted, setMounted] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  useEffect(() => setMounted(true), [])

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  // Filter modules by user role
  const visibleGroups = MODULE_GROUPS.map(g => ({
    ...g,
    modules: g.modules.filter(m => !user || m.roles.includes(user.role)),
  })).filter(g => g.modules.length > 0)

  // Collapsed (icon-only) sidebar
  if (!sidebarOpen) {
    return (
      <div className="w-[72px] bg-sidebar flex flex-col items-center py-4 gap-1 shrink-0 h-screen sticky top-0">
        {/* Logo */}
        <div className="w-11 h-11 rounded-2xl bg-nexflow-accent-gradient flex items-center justify-center mb-3 shadow-lg">
          <Hexagon className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebar(true)} title="فتح القائمة" className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent">
          <PanelLeftOpen className="w-5 h-5" />
        </Button>
        <div className="w-8 h-px bg-sidebar-border my-2" />
        {visibleGroups.flatMap(g => g.modules).map(m => {
          const Icon = m.icon
          const active = activeModule === m.id
          return (
            <Button
              key={m.id}
              variant="ghost"
              size="icon"
              onClick={() => setModule(m.id)}
              className={cn(
                "h-10 w-10 relative transition-all",
                active
                  ? "bg-sidebar-accent text-white sidebar-active-indicator"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
              )}
              title={m.label}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
            </Button>
          )
        })}
      </div>
    )
  }

  // Expanded sidebar
  return (
    <div className="w-[260px] bg-sidebar flex flex-col shrink-0 h-screen sticky top-0">
      {/* Header — NexFlow logo */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-nexflow-accent-gradient flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
            <Hexagon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-white tracking-tight">NexFlow</h2>
            <p className="text-[11px] text-sidebar-foreground/60 font-medium">System · إدارة الأعمال</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white" onClick={() => setSidebar(false)} title="إغلاق القائمة">
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation — grouped modules */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-2 space-y-4">
          {visibleGroups.map(group => {
            const GroupIcon = group.icon
            const isCollapsed = collapsedGroups.has(group.label)
            return (
              <div key={group.label}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors"
                >
                  <GroupIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="flex-1 text-right">{group.label}</span>
                  <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", isCollapsed && "-rotate-90")} />
                </button>
                {/* Modules */}
                {!isCollapsed && (
                  <div className="space-y-0.5 mt-1">
                    {group.modules.map(m => {
                      const Icon = m.icon
                      const active = activeModule === m.id
                      return (
                        <button
                          key={m.id}
                          onClick={() => setModule(m.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                            active
                              ? "bg-sidebar-accent text-white shadow-sm sidebar-active-indicator"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
                          )}
                        >
                          <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={active ? 2.5 : 2} />
                          <span className="flex-1 text-right">{m.label}</span>
                          {m.badge && (
                            <Badge className="h-5 px-1.5 text-[10px] bg-kpi-red/20 text-kpi-red border-0">
                              !
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Connection Status */}
      <div className="px-3 py-2 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sidebar-accent/50 text-xs">
          {mounted && !online ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-kpi-red" />
              <span className="text-kpi-red font-medium">غير متصل</span>
              {pendingSync > 0 && <Badge className="h-4 px-1 text-[10px] mr-auto bg-kpi-red/20 text-kpi-red border-0">{pendingSync}</Badge>}
            </>
          ) : syncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-kpi-yellow animate-spin" />
              <span className="text-kpi-yellow font-medium">جاري المزامنة...</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-kpi-green" />
              <span className="text-kpi-green font-medium">متصل</span>
            </>
          )}
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-xl bg-nexflow-accent-gradient flex items-center justify-center text-white font-bold text-sm shrink-0 shadow">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-sidebar-foreground/60">{getRoleLabel(user?.role)}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" className="flex-1 h-8 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white" onClick={toggleTheme}>
            {mounted && theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 h-8 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white" onClick={logout}>
            <LogOut className="w-3.5 h-3.5 ml-1" />
            خروج
          </Button>
        </div>
      </div>
    </div>
  )
}

function getRoleLabel(role?: string) {
  const labels: Record<string, string> = {
    ADMIN: 'مدير النظام',
    MANAGER: 'مشرف',
    CASHIER: 'كاشير',
    WAREHOUSE: 'أمين مخزن',
    ACCOUNTANT: 'محاسب',
    OWNER: 'مالك',
  }
  return labels[role || ''] || role || ''
}
