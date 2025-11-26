// backend/src/controllers/ProfileController.js
const ProfileService = require('../services/ProfileService');

async function createOrUpdateProfile(req, res) {
  const userId = req.user.id; // viene del JWT → número
  const profileData = req.body;

  try {
    const profile = await ProfileService.createOrUpdateProfile(userId, profileData);

    return res.status(200).json({
      message: "Perfil guardado correctamente",
      data: profile
    });

  } catch (error) {
    console.error("Error al crear/actualizar el perfil:", error);

    return res.status(500).json({
      error: "No se pudo guardar el perfil",
      details: error.message
    });
  }
}

async function getProfile(req, res) {
  const userId = req.user.id;

  try {
    const profile = await ProfileService.getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        message: "Perfil no encontrado",
        data: null
      });
    }

    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      data: profile
    });

  } catch (error) {
    console.error("Error al obtener el perfil:", error);

    return res.status(500).json({
      error: "No se pudo obtener el perfil",
      details: error.message
    });
  }
}

module.exports = {
  createOrUpdateProfile,
  getProfile
};
