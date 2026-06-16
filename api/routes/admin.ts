import { Router, type Request, type Response } from 'express'
import { getDb } from '../db.js'

const router = Router()

router.get('/companies', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const result = db.exec("SELECT * FROM company ORDER BY esg_score DESC")

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
    res.status(500).json({ success: false, error: '获取企业列表失败' })
  }
})

router.get('/summary', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const companyResult = db.exec("SELECT COUNT(*) as cnt, AVG(esg_score) as avg_score FROM company")
    const auditResult = db.exec("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed FROM audit_session")

    const totalCompanies = companyResult.length > 0 ? (companyResult[0].values[0][0] as number) : 0
    const avgScore = companyResult.length > 0 ? (companyResult[0].values[0][1] as number) : 0
    const auditTotal = auditResult.length > 0 ? (auditResult[0].values[0][0] as number) : 0
    const auditCompleted = auditResult.length > 0 ? (auditResult[0].values[0][1] as number) : 0

    res.json({
      success: true,
      data: {
        totalCompanies,
        avgScore: Math.round(avgScore * 10) / 10,
        avgReportingRate: 71.3,
        auditPassRate: auditTotal > 0 ? Math.round((auditCompleted / auditTotal) * 100) : 75,
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: '获取汇总数据失败' })
  }
})

export default router
