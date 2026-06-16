import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb, scheduleSave } from '../db.js'

const router = Router()

router.get('/:companyId', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const result = db.exec("SELECT * FROM environmental_metric WHERE company_id = ? ORDER BY type, subcategory", [req.params.companyId])

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
    res.status(500).json({ success: false, error: '获取环境指标数据失败' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId, type, subcategory, value, unit, period, benchmarkValue } = req.body
    const isExceeding = benchmarkValue ? value > benchmarkValue : false
    const db = await getDb()
    const id = uuidv4()

    db.run(
      "INSERT INTO environmental_metric (id, company_id, type, subcategory, value, unit, period, benchmark_value, is_exceeding) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, companyId, type, subcategory, value, unit, period, benchmarkValue || null, isExceeding ? 1 : 0]
    )

    scheduleSave(db)
    res.status(201).json({ success: true, data: { id } })
  } catch (error) {
    res.status(500).json({ success: false, error: '录入环境指标失败' })
  }
})

export default router
