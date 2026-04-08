'use client'

import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Gift,
  Smartphone,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { NavHeader } from '@/components/nav-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const MOCK_WALLETS = [
  { name: 'OneKey Pro', address: '0x1a2B...9cD4', type: 'hardware' as const },
  { name: 'Main Wallet', address: '0x5e6F...3aB8', type: 'hd' as const },
  {
    name: 'Import Wallet',
    address: '0x7c8D...1eF2',
    type: 'imported' as const,
  },
]

const MOCK_HISTORY = [
  {
    code: 'SM26-A1B2-C3D4-E5F6',
    product: 'OneKey Classic 1S',
    usd: 20,
    btc: '0.000213',
    status: 'waiting' as const,
    date: '2026-06-10',
    address: '0x1a2B...9cD4',
  },
  {
    code: 'KOL3-A5B6-C7D8-E9F0',
    product: 'OneKey Touch',
    usd: 30,
    btc: '0.000320',
    status: 'pendingPayout' as const,
    date: '2026-05-10',
    address: '0x3c4D...1c2D',
  },
  {
    code: 'CES6-U9V0-W1X2-Y3Z4',
    product: 'OneKey Classic 1S',
    usd: 20,
    btc: '0.000215',
    status: 'snapshotted' as const,
    date: '2026-05-10',
    address: '0x9a0B...7a8B',
  },
  {
    code: 'SM26-G7H8-J9K0-L1M2',
    product: 'OneKey Pro',
    usd: 50,
    btc: '0.000533',
    status: 'completed' as const,
    date: '2026-04-10',
    address: '0x5e6F...3aB8',
    txHash: '0xabc...def',
  },
  {
    code: 'SM26-N3P4-Q5R6-S7T8',
    product: 'OneKey Classic',
    usd: 15,
    btc: '0.000160',
    status: 'rejected' as const,
    date: '2026-03-15',
    address: '0x7c8D...1eF2',
    reason: '订单已退款',
  },
]

const STATUS_MAP = {
  waiting: {
    label: '等待中',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  pendingPayout: {
    label: '待发放',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  snapshotted: {
    label: '发放中',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Clock,
  },
  completed: {
    label: '已发放',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
  },
  rejected: {
    label: '已拒绝',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
}

export default function RedeemPage() {
  const [step, setStep] = useState(0)
  const [code, setCode] = useState('')
  const [selectedWallet, setSelectedWallet] = useState<number | null>(null)

  const steps = ['输入兑换码', '验证订单', '选择地址', '确认兑换', '兑换成功']

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-8">
        {/* 实体兑换卡 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-xl">实体兑换卡设计</h2>
            <a
              href="https://onekeygroup.slack.com/archives/C0ALZM8QQTY/p1774246468947449"
              target="_blank"
              rel="noreferrer"
              className="text-primary text-sm hover:underline"
            >
              以 Slack 讨论为准 &rarr;
            </a>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">正面</span>
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-bold text-lg text-stone-800 tracking-wider">
                      OneKey
                    </span>
                    <Gift className="size-5 text-stone-400" />
                  </div>
                  <div className="mb-1 text-stone-500 text-xs uppercase tracking-widest">
                    BTC Reward Card
                  </div>
                  <div className="mb-8 font-bold text-3xl text-stone-800">
                    $20{' '}
                    <span className="font-normal text-lg text-stone-500">
                      BTC
                    </span>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white/60 p-4 text-center">
                    <div className="mb-2 text-stone-400 text-xs">
                      刮开涂层获取兑换码
                    </div>
                    <div className="rounded-md bg-stone-300 px-4 py-3 font-mono text-lg text-stone-300 leading-none tracking-[0.2em]">
                      XXXX - XXXX - XXXX - XXXX
                    </div>
                  </div>
                  <div className="mt-4 text-[11px] text-stone-400">
                    等额 BTC 奖励 · 有效期 1 年 · 扫码查看兑换指南
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">背面</span>
              <Card className="overflow-hidden border-2">
                <CardContent className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-stone-50 to-stone-100 p-6">
                  <span className="font-bold text-stone-800 tracking-wider">
                    OneKey
                  </span>
                  <div className="rounded-xl border border-stone-200 bg-white/60 p-4 text-center">
                    <div className="mb-2 grid size-28 place-items-center rounded-lg bg-stone-100 text-stone-400 text-xs">
                      QR Code
                    </div>
                    <span className="text-stone-500 text-xs">
                      扫码查看兑换指南
                    </span>
                  </div>
                  <div className="space-y-1 text-center text-[11px] text-stone-400">
                    <p>兑换码有效期 1 年 · 一码一兑 · 不可转让</p>
                    <p className="font-medium text-stone-500">
                      如涂层已被刮开，请立即联系客服
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* 客户端兑换流程 */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">客户端兑换流程</h2>

          {/* 步骤指示器 */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs transition-colors ${
                    step === i
                      ? 'bg-primary text-primary-foreground'
                      : step > i
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > i ? (
                    <Check className="size-3" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                  {label}
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* 模拟手机屏幕 */}
          <div className="mx-auto w-full max-w-sm">
            <Card className="overflow-hidden border-2">
              <div className="flex items-center justify-between bg-muted px-4 py-2">
                <span className="text-muted-foreground text-xs">9:41</span>
                <span className="font-medium text-sm">兑换中心</span>
                <span className="text-muted-foreground text-xs">···</span>
              </div>

              <CardContent className="min-h-[420px] p-5">
                {/* Step 0: 输入兑换码 */}
                {step === 0 && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <Gift className="mx-auto mb-3 size-10 text-primary" />
                      <h3 className="font-semibold text-lg">输入兑换码</h3>
                      <p className="mt-1 text-muted-foreground text-sm">
                        刮开兑换卡涂层，输入码以领取 BTC 奖励
                      </p>
                    </div>
                    <Input
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="text-center font-mono text-lg tracking-widest"
                    />
                    <Button
                      className="w-full"
                      onClick={() => setStep(1)}
                      disabled={!code.trim()}
                    >
                      验证兑换码
                    </Button>
                    {code.trim() && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-3 text-sm">
                          <div className="mb-1 font-medium text-green-800">
                            验证成功
                          </div>
                          <div className="space-y-0.5 text-green-700 text-xs">
                            <p>产品：OneKey Classic 1S</p>
                            <p>奖励：≈ $20.00 等额 cbBTC (Base)</p>
                          </div>
                          <p className="mt-1.5 text-[10px] text-green-600/70">
                            预估金额，最终以确认提交时价格锁定
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Step 1: 验证订单 */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">验证订单信息</h3>
                      <p className="mt-1 text-muted-foreground text-sm">
                        请输入购买该产品的订单号
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="如 ORD-20260601-001"
                        defaultValue="ORD-20260601-001"
                        className="font-mono"
                      />
                      <p className="text-muted-foreground text-xs">
                        订单号可在购买确认邮件或订单页面找到
                      </p>
                    </div>
                    <Button className="w-full" onClick={() => setStep(2)}>
                      验证订单
                    </Button>
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-3 text-sm">
                        <div className="mb-1 font-medium text-green-800">
                          订单验证通过
                        </div>
                        <div className="space-y-0.5 text-green-700 text-xs">
                          <p>订单号：ORD-20260601-001</p>
                          <p>产品：OneKey Classic 1S</p>
                          <p>订单状态：已发货</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 2: 选择收款地址 */}
                {step === 2 && (
                  <div className="space-y-5">
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-3 text-center text-sm">
                        <div className="text-muted-foreground">您将获得</div>
                        <div className="font-bold text-2xl text-primary">
                          ≈ $20.00
                        </div>
                        <div className="text-muted-foreground text-xs">
                          cbBTC (Base)
                        </div>
                      </CardContent>
                    </Card>

                    <div>
                      <h4 className="mb-2 font-medium text-sm">
                        您的 cbBTC 将发送到哪个地址？
                      </h4>
                      <div className="space-y-2">
                        {MOCK_WALLETS.map((wallet, i) => (
                          <button
                            key={wallet.address}
                            type="button"
                            onClick={() => setSelectedWallet(i)}
                            className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                              selectedWallet === i
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {wallet.type === 'hardware' ? (
                              <Smartphone className="size-5 shrink-0 text-muted-foreground" />
                            ) : (
                              <Wallet className="size-5 shrink-0 text-muted-foreground" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {wallet.name}
                                </span>
                                {wallet.type === 'hardware' && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                  >
                                    硬件
                                  </Badge>
                                )}
                              </div>
                              <span className="font-mono text-muted-foreground text-xs">
                                {wallet.address}
                              </span>
                            </div>
                            {selectedWallet === i && (
                              <Check className="size-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => setStep(3)}
                      disabled={selectedWallet === null}
                    >
                      下一步
                    </Button>
                    <p className="text-center text-muted-foreground text-xs">
                      仅展示有私钥的钱包 · 硬件钱包优先
                    </p>
                  </div>
                )}

                {/* Step 3: 确认兑换 */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">确认兑换</h3>
                      <p className="mt-1 text-muted-foreground text-sm">
                        请确认以下信息无误
                      </p>
                    </div>

                    <Card>
                      <CardContent className="space-y-3 p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">兑换码</span>
                          <span className="font-mono">SM26-A1B2-C3D4-E5F6</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">订单号</span>
                          <span className="font-mono">ORD-20260601-001</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">产品</span>
                          <span>OneKey Classic 1S</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            奖励金额
                          </span>
                          <span className="font-semibold text-primary">
                            $20.00
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            收款地址
                          </span>
                          <span className="font-mono text-xs">
                            {selectedWallet !== null
                              ? MOCK_WALLETS[selectedWallet].address
                              : '0x1a2B...9cD4'}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            预计发放
                          </span>
                          <span>30 天退货期满后发放</span>
                        </div>
                      </CardContent>
                    </Card>

                    <p className="text-center text-amber-600 text-xs">
                      BTC 数量以此刻价格锁定，提交后不可更改收款地址
                    </p>

                    <Button className="w-full" onClick={() => setStep(4)}>
                      确认兑换
                    </Button>
                  </div>
                )}

                {/* Step 4: 成功页 */}
                {step === 4 && (
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="grid size-16 place-items-center rounded-full bg-green-100">
                      <Check className="size-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">兑换成功</h3>
                    <p className="text-center text-muted-foreground text-sm">
                      您的 ≈ $20.00 等额 cbBTC (Base)
                      <br />
                      将在 30 天退货期满后发放到您的钱包
                    </p>
                    <Card className="w-full">
                      <CardContent className="p-3 text-center text-muted-foreground text-xs">
                        <p>30 天退货期满后统一发放</p>
                        <p>可在兑换历史中随时查看进度</p>
                      </CardContent>
                    </Card>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setStep(0)
                        setCode('')
                        setSelectedWallet(null)
                      }}
                    >
                      返回
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 兑换历史 */}
        <section>
          <h2 className="mb-4 font-semibold text-xl">兑换历史</h2>
          <div className="mx-auto max-w-sm space-y-3">
            {MOCK_HISTORY.map((item) => {
              const status = STATUS_MAP[item.status]
              const StatusIcon = status.icon
              return (
                <Card key={item.code}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <StatusIcon
                      className={`size-5 shrink-0 ${
                        item.status === 'waiting'
                          ? 'text-yellow-500'
                          : item.status === 'completed'
                            ? 'text-green-500'
                            : 'text-red-500'
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {item.product}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-medium text-[10px] ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <span className="font-mono">{item.code}</span>
                      </div>
                      {item.status === 'waiting' && (
                        <p className="text-xs text-yellow-600">
                          退货期满日 {item.date}，届时进入待发放
                        </p>
                      )}
                      {item.status === 'pendingPayout' && (
                        <p className="text-blue-600 text-xs">
                          退货期已满，等待运营发放
                        </p>
                      )}
                      {item.status === 'snapshotted' && (
                        <p className="text-indigo-600 text-xs">
                          已纳入快照，等待打款
                        </p>
                      )}
                      {item.status === 'completed' && (
                        <p className="font-mono text-green-600 text-xs">
                          TX: {item.txHash}
                        </p>
                      )}
                      {item.status === 'rejected' && (
                        <p className="text-red-600 text-xs">
                          原因：{item.reason}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">${item.usd}</div>
                      <div className="font-mono text-muted-foreground text-xs">
                        {item.btc} cbBTC
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
