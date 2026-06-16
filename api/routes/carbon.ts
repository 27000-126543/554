import { Router, type Request, type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getDb, scheduleSave } from '../db.js'

const router = Router()

router.get('/:companyId', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { companyId } = req.params
    const result = db.exec("SELECT * FROM carbon_emission WHERE company_id = ? ORDER BY scope, category", [companyId])

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
    res.status(500).json({ success: false, error: '获取碳排放数据失败' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId, scope, category, value, unit, period, source } = req.body
    const db = await getDb()
    const id = uuidv4()

    db.run(
      "INSERT INTO carbon_emission (id, company_id, scope, category, value, unit, period, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, companyId, scope, category, value, unit || 'tCO₂e', period, source || 'manual']
    )

    scheduleSave(db)
    res.status(201).json({
      success: true,
      data: {
        id,
        company_id: companyId,
        scope,
        category,
        value,
        unit: unit || 'tCO₂e',
        period,
        source: source || 'manual',
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '录入碳排放数据失败' })
  }
})

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { category, value, unit, period, source } = req.body
    const db = await getDb()

    const fields: string[] = []
    const params: unknown[] = []
    if (category !== undefined) { fields.push('category = ?'); params.push(category) }
    if (value !== undefined) { fields.push('value = ?'); params.push(value) }
    if (unit !== undefined) { fields.push('unit = ?'); params.push(unit) }
    if (period !== undefined) { fields.push('period = ?'); params.push(period) }
    if (source !== undefined) { fields.push('source = ?'); params.push(source) }

    if (fields.length === 0) {
      res.status(400).json({ success: false, error: '没有需要更新的字段' })
      return
    }

    params.push(id)
    db.run(`UPDATE carbon_emission SET ${fields.join(', ')} WHERE id = ?`, params)
    scheduleSave(db)
    res.json({ success: true, message: '更新成功' })
  } catch (error) {
    res.status(500).json({ success: false, error: '更新碳排放数据失败' })
  }
})

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    db.run("DELETE FROM carbon_emission WHERE id = ?", [req.params.id])
    scheduleSave(db)
    res.json({ success: true, message: '已删除' })
  } catch (error) {
    res.status(500).json({ success: false, error: '删除失败' })
  }
})

router.get('/:companyId/footprint', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { companyId } = req.params
    const result = db.exec(
      "SELECT scope, SUM(value) as total FROM carbon_emission WHERE company_id = ? GROUP BY scope",
      [companyId]
    )

    let scope1 = 0, scope2 = 0, scope3 = 0
    if (result.length > 0) {
      for (const row of result[0].values) {
        const scope = row[0] as number
        const total = row[1] as number
        if (scope === 1) scope1 = total
        else if (scope === 2) scope2 = total
        else if (scope === 3) scope3 = total
      }
    }

    res.json({
      success: true,
      data: {
        total: scope1 + scope2 + scope3,
        scope1,
        scope2,
        scope3,
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取碳足迹数据失败' })
  }
})

export default router
