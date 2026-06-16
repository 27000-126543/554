import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb, scheduleSave } from '../db.js'

const router = Router()

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyName, industry, scale, email, password } = req.body
    if (!companyName || !industry || !scale || !email || !password) {
      res.status(400).json({ success: false, error: '请填写所有必填字段' })
      return
    }

    const db = await getDb()
    const existing = db.exec("SELECT id FROM user WHERE email = ?", [email])
    if (existing.length > 0 && existing[0].values.length > 0) {
      res.status(409).json({ success: false, error: '该邮箱已注册' })
      return
    }

    const companyId = uuidv4()
    const userId = uuidv4()

    db.run("INSERT INTO company (id, name, industry, region, scale) VALUES (?, ?, ?, ?, ?)",
      [companyId, companyName, industry, '华东', scale])

    db.run("INSERT INTO user (id, company_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [userId, companyId, email, `hashed_${password}`, 'enterprise'])

    scheduleSave(db)

    res.status(201).json({
      success: true,
      data: {
        id: userId,
        companyName,
        email,
        role: 'enterprise',
        membershipLevel: 'bronze',
        industry,
        region: '华东',
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '注册失败' })
  }
})

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ success: false, error: '请输入邮箱和密码' })
      return
    }

    const db = await getDb()
    const result = db.exec(`
      SELECT u.id, u.email, u.role, c.name as company_name, c.industry, c.region, c.membership_level
      FROM user u JOIN company c ON u.company_id = c.id
      WHERE u.email = ? AND u.password_hash = ?
    `, [email, `hashed_${password}`])

    if (result.length === 0 || result[0].values.length === 0) {
      res.status(401).json({ success: false, error: '邮箱或密码错误' })
      return
    }

    const row = result[0].values[0]
    res.json({
      success: true,
      data: {
        id: row[0] as string,
        companyName: row[3] as string,
        email: row[1] as string,
        role: row[2] as string,
        membershipLevel: row[6] as string,
        industry: row[4] as string,
        region: row[5] as string,
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '登录失败' })
  }
})

router.post('/logout', async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: '已退出登录' })
})

export default router
