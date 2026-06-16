import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb, scheduleSave } from '../db.js'

const router = Router()

router.get('/:companyId', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const result = db.exec(
      "SELECT * FROM alert WHERE company_id = ? ORDER BY timestamp DESC",
      [req.params.companyId]
    )

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
    res.status(500).json({ success: false, error: '获取预警数据失败' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId, title, description, severity } = req.body
    const db = await getDb()
    const id = uuidv4()

    db.run(
      "INSERT INTO alert (id, company_id, title, description, severity) VALUES (?, ?, ?, ?, ?)",
      [id, companyId, title, description, severity || 'warning']
    )

    scheduleSave(db)
    res.status(201).json({ success: true, data: { id } })
  } catch (error) {
    res.status(500).json({ success: false, error: '创建预警失败' })
  }
})

export default router
