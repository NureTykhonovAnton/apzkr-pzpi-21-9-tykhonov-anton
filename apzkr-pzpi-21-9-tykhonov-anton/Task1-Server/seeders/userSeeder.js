// Импорты
const { hashPassword } = require('../middlewares/authMiddleware');
const User = require('../models/user');
const Role = require('../models/role'); // Предположим, что модель Role также имеется

// Функция для создания пользователей и добавления их в базу данных
const seedUsers = async () => {
  try {
    // Хеширование паролей
    const adminPassword = await hashPassword('adminpassword');
    const userPassword = await hashPassword('userpassword');
    await Role.sync({ force: true });
    // Роли пользователей
    const adminRole = await Role.create({ name: 'admin' });
    const userRole = await Role.create({ name: 'user' });

    // Массив пользователей для создания
    const users = [
      {
        username: 'admin',
        password: adminPassword,
        roleId: adminRole.id,
      },
      {
        username: 'user',
        password: userPassword,
        roleId: userRole.id,
      },
    ];

    
    // Синхронизация модели User с базой данных (опционально, зависит от реализации)
    
    await User.sync({ force: true });

    // Создание пользователей в базе данных
    await User.bulkCreate(users);

    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Вызов функции для запуска сидера
seedUsers();
