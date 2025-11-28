const allRoles = {
  user: ['manage-instagram-accounts', 'view-conversations', 'send-messages', 'view-messages'],
  admin: [
    'manage-instagram-accounts',
    'view-conversations',
    'send-messages',
    'view-messages',
    'manage-users',
    'view-logs',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

