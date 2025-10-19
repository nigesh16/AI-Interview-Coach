const express = require('express'); 
const dotenv = require('dotenv'); 
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/authRoutes'); 
const interviewRoutes = require('./routes/interviewRoutes'); 
const cors = require('cors'); 
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const _dirname = path.resolve();

app.use(cors({
    origin: "https://ai-interview-coach-one.vercel.app",
    credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

// app.get('/', (req, res) => {
//   res.send('AI Interview Prep Backend API is running!');
// });

// Serve static files from the React app
// app.use(express.static(path.join(_dirname, 'frontend', 'dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(_dirname, 'frontend', 'dist', 'index.html'));  
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
