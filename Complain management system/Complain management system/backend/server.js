const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const agentsRoutes = require('./routes/agents');
const feedbackRoutes = require('./routes/feedback');
const errorHandler = require('./middleware/errorHandler');
const seedAgents = require('./scripts/seedAgents');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	await connectDB();
	await seedAgents();
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch(error => {
	console.error(`Server startup failed: ${error.message}`);
	process.exit(1);
});
