'use client'

import {
  ArrowLeft,
  Ban,
  Check,
  Copy,
  Download,
  ExternalLink,
  Plus,
  Search,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PromptCopy } from '@/components/prompt-copy'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DASHBOARD_PROMPT = `你是一个全栈工程师，现在需要实现 OneKey BTC 奖励运营后台（Dashboard）。

## 背景
OneKey 大促活动赠送等额 BTC，运营后台用于管理活动、兑换码和兑换记录。
两个核心页面，系统配置类先手动处理。数据分析通过 Mixpanel 实现，不在 Dashboard 内建看板。

## 页面一：活动管理

### 活动列表页（Table）
| 列 | 说明 |
|----|------|
| 活动名称 | 点击进入活动详情 |
| 创建时间 | 活动创建时间 |
| 优惠码 | 关联的 Shopify 优惠码，未关联显示"—" |
| 适用机型 | 各机型及对应奖励金额 |
| 码统计 | 生成 / 已兑换 / 剩余，分列展示 |
| 操作 | 编辑（Dialog）/ 兑换码（Dialog，含批次管理和导出 TXT） |

### 创建/编辑活动（Dialog 表单）
| 字段 | 创建时 | 编辑时 |
|------|--------|--------|
| 活动名称 | 可编辑 | 可编辑 |
| 活动代码 | 可选，4 位字符（如 SM26），需全局唯一，用作兑换码前 4 位 | 只读 |
| 关联优惠码 | 可编辑，如 BLACKFRIDAY2025 | 已填写则只读，未填写可补填 |
| 适用机型 | 下拉选择（Pro / Classic 1S / Classic / Touch）+ 手动输入，可添加多个 | 已有机型只读，仅允许新增 |
| 各机型奖励金额（USD） | 可编辑，与机型一一对应 | 已有金额只读，新增机型可编辑 |

### 兑换码格式
XXXX-XXXX-XXXX-XXXX（16 位 Base32，约 80 位熵）
- 默认全随机生成
- 支持自定义前 4 位（如 SM26），后 12 位随机：SM26-XXXX-XXXX-XXXX
- 自定义前 4 位在创建活动时设定（活动代码），需全局唯一，可选
- 无论是否自定义，每个码整体保证唯一

### 兑换码管理（Dialog，从活动列表的「兑换码」按钮打开）

#### 批量生成
- 先选码类型（订单码/自由码），联动切换后续字段：
  - 订单码：选择适用机型（从活动已配置的机型中选，金额自动带出）
  - 自由码：直接填奖励金额（USD），不绑定机型
- 再填生成数量
- 码前缀由活动代码自动带入（如有），无需手动填写
- 每个码在生成时就绑定了金额（订单码还绑定机型），兑换时无需再判断
- 同一活动可多次生成，每次生成为一个批次
- 一单多件产品：每件产品一个码，分别兑换

#### 已生成批次（Table）
| 列 | 说明 |
|----|------|
| 批次编号 | 自增 #1, #2, #3... |
| 机型 | 订单码显示绑定的机型，自由码显示"—" |
| 金额 | 该批次每码的 USD 奖励金额 |
| 自定义前 4 位 | 如有自定义则显示，否则显示"—" |
| 类型 | 订单码 / 自由码 |
| 数量 | 该批次生成的码数量 |
| 生成时间 | 批次创建时间 |
| 操作 | 单批导出 TXT |

右上角有「导出全部 TXT」按钮，导出该活动下所有批次的码。

导出文件命名规范：
- 单批导出：{活动名}_{机型}_{类型}_{批次号}.txt（如：2026夏促_Classic1S_订单码_#1.txt）
- 全部导出：{活动名}_全部兑换码.txt（如：2026夏促_全部兑换码.txt）

## 页面二：兑换码管理

### 码列表（Table，展示所有码，不仅限于已兑换的）
| 功能 | 说明 |
|------|------|
| 搜索 | 按兑换码 / 关联订单号 / 收款地址精确搜索（客服高频操作） |
| 筛选 | 按活动（下拉）、按状态（未使用 / 等待中 / 已发放 / 已拒绝 / 已作废）、按时间范围 |
| 列表字段 | 兑换码、所属活动、码类型、奖励金额（USD）、收款地址（缩略）、状态、提交时间 |
| 操作列 | 未使用 -> 作废（二次确认 Dialog，不可恢复）；已兑换 -> 详情（Dialog） |

码状态流转：未使用 -> 等待中（用户兑换后）-> 已发放（30天后自动）/ 已拒绝（人工或系统自动）
独立状态：已作废（运营主动作废，不可恢复）

### 兑换详情（Dialog，点击「详情」按钮打开）
| 字段 | 显示条件 |
|------|---------|
| 兑换码 | 始终显示，可复制 |
| 所属活动 | 始终显示 |
| 码类型 | 订单码 / 自由码 |
| 关联订单号 | 订单码时显示 |
| 收款地址 | 始终显示，可复制 |
| 奖励金额（USD） | 始终显示 |
| 锁定 BTC 数量 | 始终显示 |
| 锁定时 BTC 价格 | 始终显示 |
| 状态 | 始终显示 |
| 提交时间 | 始终显示 |
| 预计到账日期 | 等待中时显示 |
| 实际到账时间 | 已发放时显示 |
| 发放 TX hash | 已发放时显示，带区块链浏览器外链 |
| 拒绝原因 | 已拒绝时显示 |
| 拒绝来源 | 已拒绝时显示："人工拒绝"或"系统自动（订单退款）" |
| 拒绝时间 | 已拒绝时显示 |

### 人工拒绝（Dialog，从详情内触发，状态为"等待中"时可用）
- 需填写拒绝理由（如：订单已退款 / 疑似欺诈 / 重复兑换）
- 二次确认后执行，拒绝后 BTC 不会发放给用户

### 导出 CSV
| 导出类型 | 包含字段 |
|---------|---------|
| 兑换明细 | 兑换码、所属活动、关联订单号、USD 金额、锁定 BTC 数量、锁定 BTC 价格、收款地址、状态、提交时间、到账时间、TX hash、拒绝原因 |
| 未使用码 | 兑换码、所属活动、生成时间、状态（未用/已作废） |
导出范围受当前筛选条件影响。

## 客户端兑换流程（供后端接口设计参考）

### 订单码流程（4 步）
1. 输入兑换码 -> 后端验证返回码类型（订单码/自由码）+ 活动信息
2. **验证订单** -> 用户输入订单号，后端验证是否为促销订单、是否已退款（此步建立「订单号 -> 兑换码」映射）
3. 选择收款地址 -> 仅钱包选择器（有私钥的钱包），硬件优先
4. 确认兑换 -> 锁定 BTC 价格，提交

### 自由码流程（3 步）
1. 输入兑换码 -> 同上，但跳过订单验证
2. 选择收款地址
3. 确认兑换

### API 能力
| 能力 | 说明 |
|------|------|
| 验证兑换码 | 输入码 -> 返回码类型 + 活动信息（机型、USD 金额、BTC 预估数量），无需登录 |
| 验证订单（订单码） | 输入订单号 -> 验证是否为促销订单、是否已退款 -> 根据码绑定的机型自动匹配订单中的具体商品 -> 建立映射 |
| 提交兑换 | 提交码 + 收款地址（+ 订单号），附带轻量签名防伪造，无需登录 |
| 按地址查记录 | 用钱包地址查询兑换记录列表，无需登录 |
| 按码查状态 | 用兑换码查单条记录状态（备用查询），仅返回状态和预计到账日期，不返回收款地址（防隐私泄露） |
| 查看兑换详情 | 单条记录详情（状态 / USD 金额 + 锁定 BTC 数量 / 收款地址 / TX hash / 拒绝原因） |

## 关键业务逻辑
- 定时发放任务：30 天等待期到期后自动发放 BTC，发放后推送通知
- 兑换码格式：XXXX-XXXX-XXXX-XXXX（16 位 Base32），可选自定义前 4 位
- 兑换码有效期：默认 1 年，从生成时间起算，过期自动失效
- 订单码关联：用户兑换时输入订单号，后端按码的机型自动匹配订单商品建立映射。多设备订单按机型/数量匹配，部分退货只拒绝对应数量的码（临时方案，后续仓库支持出库关联后可去掉此步骤）
- 自由码：不绑定订单，无退款联动（展会/KOL 等渠道）

## V1 不做的（后续按需补充）
渠道管理、补发码、发放失败重试、系统配置页面、数据看板`

interface Campaign {
  id: number
  name: string
  createdAt: string
  couponCode: string
  totalCodes: number
  redeemed: number
  remaining: number
  models: { name: string; usd: number }[]
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: '2026 夏季大促',
    createdAt: '2026-04-01',
    couponCode: 'SUMMER2026',
    totalCodes: 5000,
    redeemed: 1234,
    remaining: 3766,
    models: [
      { name: 'Classic 1S', usd: 20 },
      { name: 'Pro', usd: 50 },
      { name: 'Classic', usd: 15 },
    ],
  },
  {
    id: 2,
    name: 'CES 2026 展会',
    createdAt: '2025-12-15',
    couponCode: '',
    totalCodes: 500,
    redeemed: 387,
    remaining: 113,
    models: [{ name: 'Classic 1S', usd: 20 }],
  },
  {
    id: 3,
    name: 'KOL 张三合作',
    createdAt: '2026-03-20',
    couponCode: '',
    totalCodes: 100,
    redeemed: 23,
    remaining: 77,
    models: [{ name: 'Touch', usd: 30 }],
  },
]

const MOCK_RECORDS = [
  {
    code: 'SM26-ABCD-EF12',
    campaign: '2026 夏季大促',
    type: '订单码' as const,
    orderId: 'ORD-20260601-001',
    usd: 20,
    cbbtc: '0.000213',
    btcPrice: '93,897.00',
    address: '0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B',
    status: 'waiting' as const,
    submitTime: '2026-04-08 14:30',
    estimatedDate: '2026-05-08',
  },
  {
    code: 'SM26-GHIJ-KL34',
    campaign: '2026 夏季大促',
    type: '订单码' as const,
    orderId: 'ORD-20260601-002',
    usd: 50,
    cbbtc: '0.000533',
    btcPrice: '93,897.00',
    address: '0x5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F',
    status: 'completed' as const,
    submitTime: '2026-03-01 10:15',
    estimatedDate: '2026-03-31',
    actualDate: '2026-04-01 00:05',
    txHash: '0xabc123def456789...a1b2c3',
  },
  {
    code: 'SM26-MNOP-QR56',
    campaign: '2026 夏季大促',
    type: '订单码' as const,
    orderId: 'ORD-20260601-003',
    usd: 20,
    cbbtc: '0.000213',
    btcPrice: '93,897.00',
    address: '0x7c8D9e0F1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D',
    status: 'rejected' as const,
    submitTime: '2026-03-15 09:00',
    rejectReason: '订单已退款',
    rejectSource: '系统自动（订单退款）',
    rejectTime: '2026-03-20 16:45',
  },
  {
    code: 'CES6-STUV-WX78',
    campaign: 'CES 2026 展会',
    type: '自由码' as const,
    orderId: '',
    usd: 20,
    cbbtc: '0.000215',
    btcPrice: '93,023.00',
    address: '0x9a0B1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B',
    status: 'completed' as const,
    submitTime: '2026-01-08 11:30',
    estimatedDate: '2026-02-07',
    actualDate: '2026-02-07 00:03',
    txHash: '0xdef789abc123456...d4e5f6',
  },
  {
    code: 'KOL3-YZAB-CD90',
    campaign: 'KOL 张三合作',
    type: '自由码' as const,
    orderId: '',
    usd: 30,
    cbbtc: '0.000320',
    btcPrice: '93,750.00',
    address: '0x3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D',
    status: 'waiting' as const,
    submitTime: '2026-04-05 16:20',
    estimatedDate: '2026-05-05',
  },
  {
    code: 'SM26-PQRS-TU01',
    campaign: '2026 夏季大促',
    type: '订单码' as const,
    orderId: '',
    usd: 20,
    cbbtc: '',
    btcPrice: '',
    address: '',
    status: 'unused' as const,
    submitTime: '',
  },
  {
    code: 'SM26-VWXY-ZA02',
    campaign: '2026 夏季大促',
    type: '订单码' as const,
    orderId: '',
    usd: 50,
    cbbtc: '',
    btcPrice: '',
    address: '',
    status: 'unused' as const,
    submitTime: '',
  },
  {
    code: 'FREE-BCDE-FG03',
    campaign: 'CES 2026 展会',
    type: '自由码' as const,
    orderId: '',
    usd: 20,
    cbbtc: '',
    btcPrice: '',
    address: '',
    status: 'voided' as const,
    submitTime: '',
  },
]

const STATUS_CONFIG = {
  unused: { label: '未使用', className: 'bg-stone-100 text-stone-600' },
  waiting: { label: '等待中', className: 'bg-yellow-100 text-yellow-800' },
  completed: { label: '已发放', className: 'bg-green-100 text-green-800' },
  rejected: { label: '已拒绝', className: 'bg-red-100 text-red-800' },
  voided: {
    label: '已作废',
    className: 'bg-stone-100 text-stone-400 line-through',
  },
}

function CopyableText({
  text,
  truncate = false,
}: {
  text: string
  truncate?: boolean
}) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="group inline-flex items-center gap-1 font-mono text-xs"
      title={text}
    >
      <span className={truncate ? 'max-w-[120px] truncate' : ''}>{text}</span>
      {copied ? (
        <Check className="size-3 text-green-500" />
      ) : (
        <Copy className="size-3 opacity-0 group-hover:opacity-60" />
      )}
    </button>
  )
}

function RecordDetail({ record }: { record: (typeof MOCK_RECORDS)[0] }) {
  const status = STATUS_CONFIG[record.status]
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-muted-foreground">兑换码</div>
          <CopyableText text={record.code} />
        </div>
        <div>
          <div className="text-muted-foreground">所属活动</div>
          <span className="text-sm">{record.campaign}</span>
        </div>
        <div>
          <div className="text-muted-foreground">码类型</div>
          <Badge variant="outline" className="text-xs">
            {record.type}
          </Badge>
        </div>
        {record.orderId && (
          <div>
            <div className="text-muted-foreground">关联订单号</div>
            <CopyableText text={record.orderId} />
          </div>
        )}
        <div>
          <div className="text-muted-foreground">收款地址</div>
          <CopyableText text={record.address} truncate />
        </div>
        <div>
          <div className="text-muted-foreground">状态</div>
          <span
            className={`inline-block rounded-full px-2 py-0.5 font-medium text-xs ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <div>
          <div className="text-muted-foreground">奖励金额</div>
          <span className="font-semibold">${record.usd}.00</span>
        </div>
        <div>
          <div className="text-muted-foreground">锁定 cbBTC</div>
          <span className="font-mono">{record.cbbtc}</span>
        </div>
        <div>
          <div className="text-muted-foreground">锁定时 BTC 价格</div>
          <span>${record.btcPrice}</span>
        </div>
        <div>
          <div className="text-muted-foreground">提交时间</div>
          <span>{record.submitTime}</span>
        </div>
      </div>

      {record.status === 'waiting' && (
        <>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground">预计到账</div>
              <span className="font-medium">{record.estimatedDate}</span>
            </div>
            <Dialog>
              <DialogTrigger
                render={<Button variant="destructive" size="sm" />}
              >
                <Ban className="size-3.5" />
                人工拒绝
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>人工拒绝</DialogTitle>
                  <DialogDescription>
                    拒绝兑换码{' '}
                    <span className="font-medium font-mono text-foreground">
                      {record.code}
                    </span>{' '}
                    的发放，拒绝后 cbBTC 将不会发放给用户。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-1.5">
                  <span className="font-medium text-sm">拒绝理由</span>
                  <textarea
                    className="min-h-[80px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="如：订单已退款 / 疑似欺诈 / 重复兑换..."
                  />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    取消
                  </DialogClose>
                  <Button variant="destructive">确认拒绝</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}

      {record.status === 'completed' && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-muted-foreground">实际到账时间</div>
              <span>{record.actualDate}</span>
            </div>
            <div>
              <div className="text-muted-foreground">TX Hash</div>
              <div className="flex items-center gap-1">
                <CopyableText text={record.txHash ?? ''} truncate />
                <a
                  href={`https://basescan.org/tx/${record.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {record.status === 'rejected' && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-muted-foreground">拒绝原因</div>
              <span className="text-red-600">{record.rejectReason}</span>
            </div>
            <div>
              <div className="text-muted-foreground">拒绝来源</div>
              <span>{record.rejectSource}</span>
            </div>
            <div>
              <div className="text-muted-foreground">拒绝时间</div>
              <span>{record.rejectTime}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const DEVICE_OPTIONS = [
  'OneKey Pro',
  'OneKey Classic 1S',
  'OneKey Classic',
  'OneKey Touch',
]

function ModelNameInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const filtered = DEVICE_OPTIONS.filter(
    (d) => !value || d.toLowerCase().includes(value.toLowerCase()),
  )

  return (
    <div className="relative flex-1">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="选择或输入机型"
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-md border bg-popover py-1 shadow-md">
          {filtered.map((d) => (
            <button
              key={d}
              type="button"
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(d)
                setOpen(false)
              }}
            >
              {d}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CampaignFormDialog({
  campaign,
  children,
  className,
}: {
  campaign?: Campaign
  children: React.ReactNode
  className?: string
}) {
  const isEdit = !!campaign
  const [models, setModels] = useState(
    campaign?.models ?? [{ name: '', usd: 0 }],
  )

  const addModel = () => setModels([...models, { name: '', usd: 0 }])
  const removeModel = (idx: number) =>
    setModels(models.filter((_, i) => i !== idx))
  const updateModel = (idx: number, field: 'name' | 'usd', val: string) => {
    setModels(
      models.map((m, i) =>
        i === idx
          ? { ...m, [field]: field === 'usd' ? Number(val) || 0 : val }
          : m,
      ),
    )
  }

  return (
    <Dialog>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑活动' : '创建活动'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `编辑「${campaign.name}」的活动信息`
              : '填写活动信息以创建新的 BTC 奖励活动'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <span className="font-medium text-sm">活动名称</span>
            <Input
              defaultValue={campaign?.name}
              placeholder="如：2026 夏季大促"
            />
          </div>
          <div className="grid gap-1.5">
            <span className="font-medium text-sm">活动代码</span>
            {isEdit ? (
              <span className="rounded-lg border bg-muted/50 px-3 py-1.5 font-mono text-muted-foreground text-sm">
                {campaign.couponCode
                  ? campaign.name.slice(0, 4).toUpperCase()
                  : '—'}
              </span>
            ) : (
              <div className="space-y-1">
                <Input
                  placeholder="如 SM26（4 位，可选）"
                  maxLength={4}
                  className="w-40 font-mono uppercase"
                />
                <p className="text-muted-foreground text-xs">
                  用作兑换码前 4 位，需全局唯一。不填则全随机。
                </p>
              </div>
            )}
          </div>
          <div className="grid gap-1.5">
            <span className="font-medium text-sm">关联优惠码</span>
            {isEdit && campaign.couponCode ? (
              <span className="rounded-lg border bg-muted/50 px-3 py-1.5 font-mono text-muted-foreground text-sm">
                {campaign.couponCode}
              </span>
            ) : (
              <Input
                defaultValue={campaign?.couponCode}
                placeholder="Shopify 优惠码，如 BLACKFRIDAY2025"
              />
            )}
          </div>
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">适用机型及奖励金额</span>
              <button
                type="button"
                onClick={addModel}
                className="text-primary text-xs hover:underline"
              >
                + 添加机型
              </button>
            </div>
            <div className="space-y-2">
              {models.map((m, i) => {
                const existingCount = campaign?.models?.length ?? 0
                const isExisting = isEdit && i < existingCount
                return (
                  <div
                    key={`model-${i.toString()}`}
                    className="flex items-center gap-2"
                  >
                    {isExisting ? (
                      <span className="flex-1 rounded-lg border bg-muted/50 px-3 py-1.5 text-muted-foreground text-sm">
                        {m.name}
                      </span>
                    ) : (
                      <ModelNameInput
                        value={m.name}
                        onChange={(v) => updateModel(i, 'name', v)}
                      />
                    )}
                    {isExisting ? (
                      <span className="w-24 rounded-lg border bg-muted/50 px-3 py-1.5 text-right text-muted-foreground text-sm">
                        ${m.usd}
                      </span>
                    ) : (
                      <Input
                        type="number"
                        value={m.usd || ''}
                        onChange={(e) => updateModel(i, 'usd', e.target.value)}
                        placeholder="USD"
                        className="w-24"
                      />
                    )}
                    {!isExisting && (
                      <button
                        type="button"
                        onClick={() => removeModel(i)}
                        className="shrink-0 text-muted-foreground text-xs hover:text-destructive"
                      >
                        删除
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button>{isEdit ? '保存' : '创建'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const MOCK_BATCHES = [
  {
    id: 1,
    count: 3000,
    date: '2026-05-20',
    type: '订单码',
    model: 'Classic 1S',
    usd: 20,
  },
  {
    id: 2,
    count: 1500,
    date: '2026-05-25',
    type: '订单码',
    model: 'Pro',
    usd: 50,
  },
  {
    id: 3,
    count: 500,
    date: '2026-06-01',
    type: '自由码',
    model: '',
    usd: 20,
  },
]

function CampaignDetailDialog({ campaign }: { campaign: Campaign }) {
  const [codeType, setCodeType] = useState('订单码')
  const isOrder = codeType === '订单码'

  return (
    <Dialog>
      <DialogTrigger className="h-7 rounded-md px-2 text-xs hover:bg-accent hover:text-accent-foreground">
        兑换码
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{campaign.name} - 兑换码管理</DialogTitle>
          <DialogDescription>
            生成 {campaign.totalCodes.toLocaleString()} / 已兑换{' '}
            {campaign.redeemed.toLocaleString()} / 剩余{' '}
            {campaign.remaining.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {/* 生成兑换码 */}
        <div className="grid gap-2">
          <span className="font-medium text-sm">批量生成兑换码</span>
          <div className="flex flex-wrap items-end gap-2">
            <div className="grid gap-1">
              <span className="text-muted-foreground text-xs">码类型</span>
              <Select
                value={codeType}
                onValueChange={(v) => v && setCodeType(v)}
              >
                <SelectTrigger size="sm" className="w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="订单码">订单码</SelectItem>
                  <SelectItem value="自由码">自由码</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isOrder ? (
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">适用机型</span>
                <Select defaultValue={campaign.models[0]?.name || ''}>
                  <SelectTrigger size="sm" className="w-[130px]">
                    <SelectValue placeholder="选择机型" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaign.models.map((m) => (
                      <SelectItem key={m.name} value={m.name}>
                        {m.name} (${m.usd})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">
                  奖励金额 (USD)
                </span>
                <Input placeholder="如 20" type="number" className="w-24" />
              </div>
            )}
            <div className="grid gap-1">
              <span className="text-muted-foreground text-xs">数量</span>
              <Input placeholder="如 500" type="number" className="w-20" />
            </div>
            <Button>生成</Button>
          </div>
        </div>

        {/* 已生成批次 */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">已生成批次</span>
            <Button variant="outline" size="sm" className="h-6 gap-1 text-xs">
              <Download className="size-3" />
              导出全部 TXT
            </Button>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 text-xs">批次</TableHead>
                  <TableHead className="h-8 text-xs">机型</TableHead>
                  <TableHead className="h-8 text-xs">金额</TableHead>
                  <TableHead className="h-8 text-xs">类型</TableHead>
                  <TableHead className="h-8 text-right text-xs">数量</TableHead>
                  <TableHead className="h-8 text-xs">生成时间</TableHead>
                  <TableHead className="h-8 text-right text-xs">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_BATCHES.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="py-1.5 text-xs">
                      #{batch.id}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs">
                      {batch.model || '—'}
                    </TableCell>
                    <TableCell className="py-1.5 font-semibold text-xs">
                      ${batch.usd}
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Badge variant="outline" className="text-[10px]">
                        {batch.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1.5 text-right font-mono text-xs">
                      {batch.count.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-1.5 text-muted-foreground text-xs">
                      {batch.date}
                    </TableCell>
                    <TableCell className="py-1.5 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-primary text-xs hover:underline"
                      >
                        <Download className="size-3" />
                        TXT
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DashboardPage() {
  const [campaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="flex-1 font-semibold text-lg">运营 Dashboard Demo</h1>
          <PromptCopy title="复制开发提示词" prompt={DASHBOARD_PROMPT} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <Tabs defaultValue="campaigns">
          <TabsList>
            <TabsTrigger value="campaigns">活动管理</TabsTrigger>
            <TabsTrigger value="records">兑换码管理</TabsTrigger>
          </TabsList>

          {/* 活动管理 */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">活动列表</h2>
              <CampaignFormDialog className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 font-medium text-primary-foreground text-sm hover:bg-primary/90">
                <Plus className="size-3.5" />
                创建活动
              </CampaignFormDialog>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>活动名称</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>优惠码</TableHead>
                    <TableHead>适用机型</TableHead>
                    <TableHead className="text-right">生成</TableHead>
                    <TableHead className="text-right">已兑换</TableHead>
                    <TableHead className="text-right">剩余</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        {campaign.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                        {campaign.createdAt}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {campaign.couponCode || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {campaign.models.map((m) => (
                            <Badge
                              key={m.name}
                              variant="outline"
                              className="text-[10px]"
                            >
                              {m.name}: ${m.usd}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {campaign.totalCodes.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-primary">
                        {campaign.redeemed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {campaign.remaining.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <CampaignFormDialog
                            campaign={campaign}
                            className="h-7 rounded-md px-2 text-xs hover:bg-accent hover:text-accent-foreground"
                          >
                            编辑
                          </CampaignFormDialog>
                          <CampaignDetailDialog campaign={campaign} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 兑换码管理 */}
          <TabsContent value="records" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative max-w-xs flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索兑换码 / 订单号 / 地址"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select defaultValue="全部活动">
                <SelectTrigger size="sm" className="w-[140px]">
                  <SelectValue placeholder="按活动筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部活动">全部活动</SelectItem>
                  <SelectItem value="2026 夏季大促">2026 夏季大促</SelectItem>
                  <SelectItem value="CES 2026 展会">CES 2026 展会</SelectItem>
                  <SelectItem value="KOL 张三合作">KOL 张三合作</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="全部状态">
                <SelectTrigger size="sm" className="w-[120px]">
                  <SelectValue placeholder="按状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部状态">全部状态</SelectItem>
                  <SelectItem value="未使用">未使用</SelectItem>
                  <SelectItem value="等待中">等待中</SelectItem>
                  <SelectItem value="已发放">已发放</SelectItem>
                  <SelectItem value="已拒绝">已拒绝</SelectItem>
                  <SelectItem value="已作废">已作废</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" className="w-[140px]" />
              <span className="text-muted-foreground text-sm">~</span>
              <Input type="date" className="w-[140px]" />
              <div className="ml-auto">
                <Button variant="outline" size="sm">
                  <Download className="mr-1.5 size-3.5" />
                  导出 CSV
                </Button>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>兑换码</TableHead>
                    <TableHead>活动</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>收款地址</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RECORDS.map((record) => {
                    const status = STATUS_CONFIG[record.status]
                    return (
                      <TableRow key={record.code}>
                        <TableCell className="font-mono text-xs">
                          {record.code}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.campaign}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${record.usd}
                        </TableCell>
                        <TableCell
                          className="max-w-[100px] truncate font-mono text-xs"
                          title={record.address}
                        >
                          {record.address}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 font-medium text-[10px] ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {record.submitTime || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {record.status === 'unused' ? (
                            <Dialog>
                              <DialogTrigger className="h-7 rounded-md px-2 text-destructive text-xs hover:bg-destructive/10">
                                作废
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                  <DialogTitle>确认作废</DialogTitle>
                                  <DialogDescription>
                                    确定要作废兑换码{' '}
                                    <span className="font-medium font-mono text-foreground">
                                      {record.code}
                                    </span>{' '}
                                    吗？作废后不可恢复。
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose
                                    render={<Button variant="outline" />}
                                  >
                                    取消
                                  </DialogClose>
                                  <Button variant="destructive">
                                    确认作废
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ) : record.status === 'voided' ? (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          ) : (
                            <Dialog>
                              <DialogTrigger className="h-7 rounded-md px-2 text-xs hover:bg-accent hover:text-accent-foreground">
                                详情
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>兑换详情</DialogTitle>
                                  <DialogDescription>
                                    {record.code} · {record.campaign}
                                  </DialogDescription>
                                </DialogHeader>
                                <RecordDetail record={record} />
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
