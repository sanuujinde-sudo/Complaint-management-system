const bcrypt = require('bcryptjs');
const User = require('../models/User');

const defaultAgents = [
  { name: 'Aarav Sharma', email: 'aarav.agent@example.com' },
  { name: 'Meera Patel', email: 'meera.agent@example.com' },
  { name: 'Daniel Wilson', email: 'daniel.agent@example.com' }
];

const seedAgents = async () => {
  const password = process.env.AGENT_DEFAULT_PASSWORD || 'Agent@12345';
  const passwordHash = await bcrypt.hash(password, 12);
  let created = 0;

  for (const agent of defaultAgents) {
    const existing = await User.findOne({ email: agent.email });
    if (!existing) {
      await User.create({ ...agent, password: passwordHash, role: 'AGENT' });
      created += 1;
    }
  }

  if (created) console.log(`${created} default agent account(s) created`);
  console.log(`Default agents verified: ${defaultAgents.map(agent => agent.name).join(', ')}`);
};

module.exports = seedAgents;
