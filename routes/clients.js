const express = require('express');
const {  
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientsByUser, } = require('../controllers/clients');

const router = express.Router();

router.get('/', getClients);
router.get('/user', getClientsByUser);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;