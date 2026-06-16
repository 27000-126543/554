import initSqlJs, { type Database } from 'sql.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db: Database | null = null

export async function getDb(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs()

  const dbPath = path.join(__dirname, '..', 'data', 'esg.db')
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  initializeSchema(db)
  seedData(db)
  saveDb(db, dbPath)

  return db
}

function initializeSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS company (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      region TEXT NOT NULL,
      scale TEXT NOT NULL,
      membership_level TEXT DEFAULT 'bronze',
      esg_score REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL REFERENCES company(id),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS carbon_emission (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      scope INTEGER NOT NULL,
      category TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      period TEXT NOT NULL,
      source TEXT DEFAULT 'manual',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS environmental_metric (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      type TEXT NOT NULL,
      subcategory TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      period TEXT NOT NULL,
      benchmark_value REAL,
      is_exceeding BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS social_metric (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      category TEXT NOT NULL,
      metric TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      period TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS governance_metric (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      category TEXT NOT NULL,
      metric TEXT NOT NULL,
      value TEXT NOT NULL,
      period TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS esg_report (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      template TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      period TEXT NOT NULL,
      data TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      published_at TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS approval_log (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      approver_id TEXT NOT NULL,
      role TEXT NOT NULL,
      action TEXT NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS audit_session (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      auditor_id TEXT NOT NULL,
      status TEXT DEFAULT 'in_progress',
      opinion TEXT,
      findings TEXT,
      start_date TEXT DEFAULT (datetime('now')),
      end_date TEXT
    )
  `)
}

function seedData(db: Database) {
  const count = db.exec("SELECT COUNT(*) as cnt FROM company")
  if (count[0]?.values[0]?.[0] as number > 0) return

  const companies = [
    { id: 'c1', name: '绿源科技', industry: '信息技术', region: '华东', scale: '大型企业', level: 'diamond', score: 85 },
    { id: 'c2', name: '恒达制造', industry: '制造业', region: '华南', scale: '大型企业', level: 'gold', score: 78 },
    { id: 'c3', name: '昌盟能源', industry: '能源', region: '华北', scale: '大型企业', level: 'silver', score: 72 },
    { id: 'c4', name: '惠通物流', industry: '物流', region: '西南', scale: '中型企业', level: 'silver', score: 68 },
    { id: 'c5', name: '鼎新材料', industry: '化工', region: '华东', scale: '中型企业', level: 'bronze', score: 62 },
    { id: 'c6', name: '远航贸易', industry: '贸易', region: '华南', scale: '小型企业', level: 'bronze', score: 58 },
  ]

  const stmt = db.prepare("INSERT INTO company (id, name, industry, region, scale, membership_level, esg_score) VALUES (?, ?, ?, ?, ?, ?, ?)")
  for (const c of companies) {
    stmt.run([c.id, c.name, c.industry, c.region, c.scale, c.level, c.score])
  }
  stmt.free()

  const userStmt = db.prepare("INSERT INTO user (id, company_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)")
  userStmt.run(['u1', 'c1', 'admin@esgpro.com', 'hashed_password_123', 'admin'])
  userStmt.run(['u2', 'c1', 'green@lvyuan.com', 'hashed_password_456', 'enterprise'])
  userStmt.run(['u3', 'c2', 'contact@hengda.com', 'hashed_password_789', 'esg_lead'])
  userStmt.run(['u4', 'c3', 'audit@deloitte.com', 'hashed_password_aud', 'auditor'])
  userStmt.free()

  const carbonStmt = db.prepare("INSERT INTO carbon_emission (id, company_id, scope, category, value, unit, period, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
  const carbonData = [
    ['ce1', 'c1', 1, '燃料燃烧', 1200, 'tCO₂e', '2026-Q2', 'manual'],
    ['ce2', 'c1', 1, '工艺过程', 800, 'tCO₂e', '2026-Q2', 'manual'],
    ['ce3', 'c1', 1, '逸散排放', 450, 'tCO₂e', '2026-Q2', 'device'],
    ['ce4', 'c1', 2, '外购电力', 890, 'tCO₂e', '2026-Q2', 'manual'],
    ['ce5', 'c1', 3, '上下游运输', 1050, 'tCO₂e', '2026-Q2', 'manual'],
    ['ce6', 'c1', 3, '采购商品', 890, 'tCO₂e', '2026-Q2', 'manual'],
    ['ce7', 'c1', 3, '废弃物处理', 160, 'tCO₂e', '2026-Q2', 'manual'],
  ]
  for (const row of carbonData) {
    carbonStmt.run(row)
  }
  carbonStmt.free()

  const envStmt = db.prepare("INSERT INTO environmental_metric (id, company_id, type, subcategory, value, unit, period, benchmark_value, is_exceeding) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
  const envData = [
    ['em1', 'c1', 'energy', '电力', 45200, 'kWh', '2026-06', 42000, 1],
    ['em2', 'c1', 'water', '用水量', 12800, '吨', '2026-06', 12000, 1],
    ['em3', 'c1', 'waste', '固废', 3200, '吨', '2026-06', 3000, 1],
  ]
  for (const row of envData) {
    envStmt.run(row)
  }
  envStmt.free()

  const reportStmt = db.prepare("INSERT INTO esg_report (id, company_id, template, status, period, created_at) VALUES (?, ?, ?, ?, ?, ?)")
  reportStmt.run(['rpt-001', 'c1', 'GRI', 'published', '2025-Q4', '2026-01-15'])
  reportStmt.run(['rpt-002', 'c1', 'TCFD', 'pending_ceo', '2026-Q1', '2026-04-20'])
  reportStmt.run(['rpt-003', 'c1', 'GRI', 'draft', '2026-Q2', '2026-06-10'])
  reportStmt.free()
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null
let dbPath: string | null = null

function saveDb(db: Database, path: string) {
  dbPath = path
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(path, buffer)
}

export function scheduleSave(db: Database) {
  if (!dbPath) return
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveDb(db, dbPath!)
    saveTimeout = null
  }, 1000)
}
