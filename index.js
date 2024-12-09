const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', // Permitir solicitudes solo desde tu frontend
}));

// Configuración de Twilio
const accountSid = process.env.PATO
const authToken = process.env.PETO;
const client = new twilio(accountSid, authToken);

// Número fijo de destino
const defaultPhoneNumber = 'whatsapp:+573144785344';

// Ruta para enviar mensajes a WhatsApp
app.post('/send-message', async (req, res) => {
  const { message } = req.body;

  // Validación básica
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'El mensaje debe ser un texto válido y no estar vacío.' });
  }

  try {
    // Enviar mensaje usando el formato de WhatsApp
    const messageResponse = await client.messages.create({
      from: 'whatsapp:+14155238886', // Número habilitado por Twilio para WhatsApp
      to: defaultPhoneNumber, // Número destino fijo
      body: message,
    });

    console.log(`Mensaje enviado con SID: ${messageResponse.sid}`);
    res.json({ success: true, sid: messageResponse.sid });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Revisa los detalles de Twilio.' });
  }
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
