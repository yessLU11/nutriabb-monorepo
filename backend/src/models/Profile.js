// backend/src/models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    // Relacionar por user_id numérico (viene de Postgres / Auth)
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },


    // Datos personales
    nombre: { type: String, default: '' },
    edad: { type: Number, default: null },
    sexo: { type: String, enum: ['masculino','femenino','otro',''], default: '' },

    // Antropometría
    peso: { type: Number, default: null }, // kg
    altura: { type: Number, default: null }, // cm
    objetivo: { type: String, enum: ['subir','bajar','mantener',''], default: '' },
    actividad: { type: String, enum: ['sedentario','ligero','moderado','pesado',''], default: '' },

    // Salud / condiciones
    glucosa: { type: String, enum: ['normal','prediabetes','diabetes1','diabetes2',''], default: '' },
    intoleranciaLactosa: { type: String, enum: ['no','si','leve',''], default: '' },
    celiaco: { type: String, enum: ['no','si',''], default: '' },
    alergias: { type: String, default: '' },
    condiciones: { type: String, default: '' },

    // Mujeres
    estadoFisiologico: { type: String, default: '' },

    // Nutrición
    comidas: { type: Number, default: 3 },
    evitarAlimentos: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
