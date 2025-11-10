import request from 'supertest'
import app from '../src/app'

describe('Thread API', () => {
    it('should return all threads', async () => {
        const res = await request(app).get('/health')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
    })
})
