import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb, scheduleSave } from '../db.js'

const router = Router()

router.get('/company/:companyId', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const result = db.exec("SELECT * FROM audit_session WHERE company_id = ? ORDER BY start_date DESC", [req.params.companyId])

    if (result.length === 0) {
      res.json({ success: true, data: [] })
      return
    }

    const columns = result[0].columns
    const rows = result[0].values.map(row => {
      const obj: Record<string, unknown> = {}
      columns.forEach((col, i) => { obj[col] = row[i] })
      return obj
    })

    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取审计数据失败' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId, auditorId } = req.body
    const db = await getDb()
    const id = uuidv4()

    db.run(
      "INSERT INTO audit_session (id, company_id, auditor_id, status) VALUES (?, ?, ?, 'in_progress')",
      [id, companyId, auditorId]
    )

    scheduleSave(db)
    res.status(201).json({ success: true, data: { id } })
  } catch (error) {
    res.status(500).json({ success: false, error: '创建审计会话失败' })
  }
})

router.post('/:id/opinion', async (req: Request, res: Response): Promise<void> => {
  try {
    const { opinion, findings } = req.body
    const db = await getDb()

    db.run(
      "UPDATE audit_session SET opinion = ?, findings = ?, status = 'completed', end_date = datetime('now') WHERE id = ?",
      [opinion, JSON.stringify(findings), req.params.id]
    )

    scheduleSave(db)
    res.json({ success: true, message: '审计意见已提交' })
  } catch (error) {
    res.status(500).json({ success: false, error: '提交审计意见失败' })
  }
})

export default router
