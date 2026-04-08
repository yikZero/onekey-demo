import {
  ArrowDown,
  Ban,
  Calendar,
  Check,
  Clock,
  Factory,
  FileSpreadsheet,
  FileText,
  Gift,
  Package,
  Send,
  Settings,
  ShieldAlert,
  Smartphone,
  Upload,
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
            <Node icon={Package} label="塞入产品包装" />
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
          <div className="flex flex-wrap gap-2">
            <Node icon={Gift} label="输入兑换码" />
            <Node icon={FileText} label="输入订单号" />
            <Node icon={Check} label="验证订单 + 建立映射" />
            <Node icon={Smartphone} label="选地址 → 确认兑换" />
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            所有码均需关联订单。活动赠码等场景由后端预关联固定订单，用户无需手动输入。
          </p>
        </div>

        <Arrow />

        {/* Phase 4: 等待期 */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="size-4" />
            <span className="font-semibold text-sm">等待期（30 天退货期）</span>
            <span className="text-muted-foreground text-xs">后端</span>
          </div>
          <p className="mb-3 text-muted-foreground text-xs">
            兑换提交后进入 30
            天退货期，退货期结束后即符合发放条件。运营手动生成快照时自动筛选所有退货期满的码。
          </p>
          <div className="space-y-2 rounded-lg bg-red-50 p-3">
            <span className="font-medium text-red-800 text-xs">
              人工拒绝（等待中 / 待发放时可操作）
            </span>
            <div className="flex flex-wrap gap-2">
              <Node icon={ShieldAlert} label="填写拒绝理由" />
              <Node icon={Ban} label="二次确认拒绝" />
            </div>
          </div>
        </div>

        <Arrow />

        {/* Phase 5: 手动发放 */}
        <div className="rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Send className="size-4" />
            <span className="font-semibold text-sm">手动发放</span>
            <span className="text-muted-foreground text-xs">运营</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Node icon={Calendar} label="手动生成快照" />
            <Node icon={FileSpreadsheet} label="导出发放 CSV" />
            <Node icon={Send} label="手动打款 BTC" />
            <Node icon={Upload} label="上传已发放 CSV" />
            <Node icon={Smartphone} label="推送到账通知" />
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            参照返佣发放流程：一键生成快照筛选所有退货期满的码，纳入后状态变为「发放中」不会重复。导出
            CSV 手动链上打款后上传 CSV 回填 TX hash。
          </p>
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
              <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-800">
                待发放
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 font-medium text-indigo-800">
                发放中
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
            <p className="mt-1 text-muted-foreground text-xs">
              等待中：30 天退货期内 · 待发放：退货期满 · 发放中：已纳入快照 ·
              已发放：CSV 上传确认
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
