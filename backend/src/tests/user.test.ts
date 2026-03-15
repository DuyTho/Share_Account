import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user.route';
import { prismaMock } from '../__mock__/prisma'; 

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Controller - Unit Test', () => {
  
  it('Tạo người dùng mới thành công', async () => {
    // 1. Giả lập dữ liệu mà Prisma sẽ trả về (không lưu vào DB thật)
    const mockUser = {
      user_id: 1,
      name: 'Nguyen Huu Duc',
      email: 'duc@test.com',
      password: 'hashed_password',
      phone: '0123456789',
      role: 'customer' as const,
      status: 'active' as const,
      created_at: new Date(),
    };

    // 2. Định nghĩa hành vi cho Mock: 
    // "Khi gọi lệnh prisma.users.create, hãy trả về mockUser"
    prismaMock.users.create.mockResolvedValue(mockUser);

    // 3. Thực hiện gọi API qua Supertest
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Nguyen Huu Duc',
        email: 'duc@test.com',
        password: 'password123',
        phone: '0123456789'
      });

    // 4. Kiểm chứng kết quả
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('duc@test.com');
    expect(res.body.user_id).toBeDefined();
    
    // Kiểm tra xem lệnh Prisma có thực sự được gọi đúng tham số không
    expect(prismaMock.users.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'duc@test.com'
      })
    });
  });

  it('Trả về lỗi 500 nếu database gặp sự cố', async () => {
    // Giả lập tình huống Database bị sập
    prismaMock.users.create.mockRejectedValue(new Error('DB Connection Error'));

    const res = await request(app)
      .post('/users')
      .send({ name: 'Test' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Không tạo được user');
  });
});