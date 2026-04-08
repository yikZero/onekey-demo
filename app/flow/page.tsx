import {
  ArrowDown,
  Ban,
  Check,
  Clock,
  Factory,
  FileText,
  Gift,
  Package,
  Send,
  Settings,
  ShieldAlert,
  Smartphone,
  Truck,
  Undo2,
} from 'lucide-react'
import { NavHeader } from '@/components/nav-header'

function Arrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="size-4 text-muted-foreground/40" />
    </div>
  )
}

function Node({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm shadow-xs">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span>{label}</span>
    </div>
  )
}

export default function FlowPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <main className="mx-auto max-w-xl px-6 py-8">
        {/* Title + Jira */}
        <div className="mb-6">
          <h1 className="font-bold text-2xl">OneKey BTC 奖励兑换系统</h1>
          <p className="mt-1.5 text-muted-foreground text-sm">
            从 2026 年中大促开始，OneKey 促销不再打折，改为赠送等额
            BTC。用户购买硬件钱包后，通过包装内的兑换码（类似礼品卡）在 OneKey
            App 中领取等值 cbBTC 奖励。
          </p>
          <a
            href="https://onekeyhq.atlassian.net/browse/OK-43996"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
          >
            OK-43996
            <span className="text-muted-foreground text-xs">Jira</span>
          </a>
        </div>

        {/* Phase 1: 创建活动 */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Settings className="size-4" />
            <span className="font-semibold text-sm">创建活动</span>
            <span className="text-muted-foreground text-xs">Dashboard</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Node icon={FileText} label="活动 + 机型 + 金额" />
            <Node icon={Gift} label="分批生成兑换码" />
            <Node icon={FileText} label="导出 TXT" />
          </div>
        </div>

        <Arrow />

        {/* Phase 2: 印刷发货 */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Factory className="size-4" />
            <span className="font-semibold text-sm">印刷 & 发货</span>
            <span className="text-muted-foreground text-xs">线下</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Node icon={Gift} label="印刷兑换卡" />
            <Node icon={Package} label="促销订单塞卡" />
            <Node icon={Truck} label="自由码直接分发" />
          </div>
        </div>

        <Arrow />

        {/* Phase 3: 用户兑换 */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Smartphone className="size-4" />
            <span className="font-semibold text-sm">用户兑换</span>
            <span className="text-muted-foreground text-xs">客户端</span>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Node icon={Gift} label="输入兑换码" />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
              <span className="font-medium text-xs">订单码</span>
              <div className="flex flex-wrap gap-2">
                <Node icon={FileText} label="输入订单号" />
                <Node icon={Check} label="验证 + 建立映射" />
                <Node icon={Smartphone} label="选地址 → 确认" />
              </div>
            </div>
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
              <span className="font-medium text-xs">自由码</span>
              <div className="flex flex-wrap gap-2">
                <Node icon={Smartphone} label="选地址 → 确认" />
              </div>
            </div>
          </div>
        </div>

        <Arrow />

        {/* Phase 4: 等待期 */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="size-4" />
            <span className="font-semibold text-sm">等待期 30 天</span>
            <span className="text-muted-foreground text-xs">后端</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-2 rounded-lg bg-red-50 p-3">
              <span className="font-medium text-red-800 text-xs">
                退款拒绝（订单码）
              </span>
              <div className="flex flex-wrap gap-2">
                <Node icon={Undo2} label="Shopify Webhook" />
                <Node icon={Ban} label="自动拒绝对应码" />
              </div>
            </div>
            <div className="space-y-2 rounded-lg bg-red-50 p-3">
              <span className="font-medium text-red-800 text-xs">人工拒绝</span>
              <div className="flex flex-wrap gap-2">
                <Node icon={ShieldAlert} label="填写理由" />
                <Node icon={Ban} label="二次确认拒绝" />
              </div>
            </div>
          </div>
        </div>

        <Arrow />

        {/* Phase 5: 发放 */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Send className="size-4" />
            <span className="font-semibold text-sm">自动发放</span>
            <span className="text-muted-foreground text-xs">后端</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Node icon={Check} label="到期 + 未退款 + 未拒绝" />
            <Node icon={Send} label="发放 BTC" />
            <Node icon={Smartphone} label="推送通知" />
          </div>
        </div>

        {/* 码状态流转 */}
        <div className="mt-8 rounded-xl border p-4">
          <div className="mb-3 font-semibold text-sm">码状态流转</div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                未使用
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-full bg-yellow-100 px-2.5 py-1 font-medium text-yellow-800">
                等待中
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-full bg-green-100 px-2.5 py-1 font-medium text-green-800">
                已发放
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="rounded-full bg-red-100 px-2.5 py-1 font-medium text-red-800">
                已拒绝
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                未使用
              </span>
              <span className="text-muted-foreground">→ 作废 →</span>
              <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-400 line-through">
                已作废
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
