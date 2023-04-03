import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('12345', 10),
    isAdmin: true,
  },
  {
    name: 'Dutch Van der Linde',
    email: 'dutch@goddamnplan.com',
    password: bcrypt.hashSync('12345', 10),
  },
  {
    name: 'Arthur Morgan',
    email: 'ynnel@goodman.com',
    password: bcrypt.hashSync('12345', 10),
  },
];

export default users;