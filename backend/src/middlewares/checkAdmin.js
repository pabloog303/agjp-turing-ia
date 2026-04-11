// Middleware que restringe el acceso solo a usuarios con role_id === 1 (Admin)
// Debe usarse DESPUÉS de checkAuth, ya que depende de req.user

function checkAdmin(req, res, next) {
  if (req.user.role_id !== 1) {
    return res.status(403).json({ error: 'Solo administradores' });
  }
  next();
}

module.exports = checkAdmin;
