const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qurbonov_school')
  .then(() => console.log('MongoDBga ulandi'))
  .catch(err => console.error('MongoDB xatosi:', err));

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 5, max: 60 },
  phone: { type: String, required: true, trim: true },
  subject: { type: String, default: 'Aniqlanmagan' },
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);

app.post('/api/form', async (req, res) => {
  try {
    const { name, age, phone, subject } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Ism noto\'g\'ri' });
    }
    if (!age || typeof age !== 'number' || age < 5 || age > 60) {
      return res.status(400).json({ error: 'Yosh noto\'g\'ri' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 5) {
      return res.status(400).json({ error: 'Telefon noto\'g\'ri' });
    }

    const application = new Application({
      name: name.trim(),
      age,
      phone: phone.trim(),
      subject: subject || 'Aniqlanmagan',
    });

    await application.save();

    console.log(`Yangi ariza: ${name}, ${age} yosh, ${phone}, ${subject}`);

    res.status(201).json({
      message: 'Ariza qabul qilindi',
      application: {
        id: application._id,
        name: application.name,
        age: application.age,
        phone: application.phone,
        subject: application.subject,
        createdAt: application.createdAt,
      },
    });
  } catch (err) {
    console.error('Server xatosi:', err);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 }).limit(100);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Serverda xatolik' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishga tushdi`);
});