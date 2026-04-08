import { ArrowRight, Gift, LayoutDashboard, Map } from 'lucide-react'
import Link from 'next/link'

const DEMOS = [
  {
    href: '/flow',
    icon: Map,
    title: '整体逻辑流程',
    description: '从活动创建到发放完成的全链路流程图',
  },
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    title: '运营 Dashboard Demo',
    description: '活动管理 + 兑换码管理',
  },
  {
    href: '/redeem',
    icon: Gift,
    title: '兑换码 Demo',
    description: '实体兑换卡设计 + App 内兑换流程 + 兑换历史',
  },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="font-bold text-3xl">OneKey BTC 奖励</h1>
          <p className="mt-2 text-muted-foreground">
            大促活动 BTC 奖励方案 Demo
          </p>
        </div>

        <div className="space-y-4">
          {DEMOS.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group flex items-center gap-4 rounded-xl border p-5 transition-colors hover:bg-muted"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <demo.icon className="size-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">{demo.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {demo.description}
                </p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
