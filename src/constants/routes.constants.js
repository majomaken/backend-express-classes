const ROUTES = {
  auth: '/auth',
  users: '/users',
  tasks: '/tasks',
}

const AUTH_PATHS = {
  register: '/register',
}

const TASKS_PATHS = {
  one: '/one/:id',
  all: '/all',
  create: '/create',
  update: '/update/:id',
  delete: '/delete/:id',
}

module.exports = {
  ROUTES,
  AUTH_PATHS,
  TASKS_PATHS
}