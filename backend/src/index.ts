import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Endpoint unificado que consulta los endpoints específicos de DolarAPI
app.get('/api/rates', async (req: Request, res: Response) => {
  try {
    // Consultamos en paralelo los endpoints oficiales de DolarAPI que vimos en su documentación
    const [dolarOficial, dolarParalelo, euroOficial, euroParalelo] = await Promise.all([
      axios.get('https://ve.dolarapi.com/v1/dolares/oficial').catch(() => null),
      axios.get('https://ve.dolarapi.com/v1/dolares/paralelo').catch(() => null),
      axios.get('https://ve.dolarapi.com/v1/euros/oficial').catch(() => null),
      axios.get('https://ve.dolarapi.com/v1/euros/paralelo').catch(() => null),
    ]);

    const rates = [
      dolarOficial?.data,
      dolarParalelo?.data,
      euroOficial?.data,
      euroParalelo?.data,
    ].filter(Boolean); // Filtramos por si alguno falla

    res.json({
      success: true,
      data: rates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al consultar DolarAPI:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al conectar con la API de tasas de cambio' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});