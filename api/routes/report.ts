import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb, scheduleSave } from '../db.js'

const router = Router()

router.get('/:companyId', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const result = db.exec("SELECT * FROM esg_report WHERE company_id = ? ORDER BY created_at DESC", [req.params.companyId])

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
    res.status(500).json({ success: false, error: '获取报告数据失败' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId, template, period } = req.body
    const db = await getDb()
    const id = uuidv4()

    db.run(
      "INSERT INTO esg_report (id, company_id, template, status, period) VALUES (?, ?, ?, 'draft', ?)",
      [id, companyId, template, period]
    )

    scheduleSave(db)
    res.status(201).json({ success: true, data: { id, status: 'draft' } })
  } catch (error) {
    res.status(500).json({ success: false, error: '创建报告失败' })
  }
})

router.post('/:id/approve', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { approverId, role, action, comment } = req.body
    const db = await getDb()

    const reportResult = db.exec("SELECT status FROM esg_report WHERE id = ?", [id])
    if (reportResult.length === 0 || reportResult[0].values.length === 0) {
      res.status(404).json({ success: false, error: '报告不存在' })
      return
    }

    const currentStatus = reportResult[0].values[0][0] as string

    let newStatus: string
    if (action === 'reject') {
      newStatus = 'rejected'
    } else {
      const statusFlow: Record<string, string> = {
        'draft': 'pending_esg',
        'pending_esg': 'pending_cfo',
        'pending_cfo': 'pending_ceo',
        'pending_ceo': 'published',
      }
      newStatus = statusFlow[currentStatus] || currentStatus
    }

    db.run("UPDATE esg_report SET status = ? WHERE id = ?", [newStatus, id])

    if (newStatus === 'published') {
      db.run("UPDATE esg_report SET published_at = datetime('now') WHERE id = ?", [id])
    }

    db.run(
      "INSERT INTO approval_log (id, report_id, approver_id, role, action, comment) VALUES (?, ?, ?, ?, ?, ?)",
      [uuidv4(), id, approverId, role, action, comment || null]
    )

    scheduleSave(db)
    res.json({ success: true, data: { id, status: newStatus } })
  } catch (error) {
    res.status(500).json({ success: false, error: '审批操作失败' })
  }
})

router.get('/:id/approvals', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const result = db.exec("SELECT * FROM approval_log WHERE report_id = ? ORDER BY created_at", [req.params.id])

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
    res.status(500).json({ success: false, error: '获取审批记录失败' })
  }
})

export default router
