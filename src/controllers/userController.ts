const GlobalController = require('./globalController');
const { userDao } = require('../dao/userDao');
const bcrypt = require('bcrypt');

class UserController extends GlobalController {
    constructor() {
        super(userDao);
    }

    // POST /api/v1/users/login
    async login(req: any, res: any) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y password son requeridos' });
      }

      const user = await userDao.findByEmail(email);
      // Para no filtrar información, usa mensaje genérico
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Sanitiza salida (no expongas password)
      const { password: _pwd, ...safe } = user.toObject ? user.toObject() : user;

      // Si más tarde usas JWT:
      // const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      // return res.status(200).json({ user: safe, token });

      return res.status(200).json({ user: safe });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Error interno en login' });
    }
  }
}

module.exports = new UserController();