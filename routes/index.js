const express = require('express');
const router  = express.Router();
const request = require('request');
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')
const {ensureAuthenticated} = require('../config/auth');

//welcome
router.get('/',(req,res)=>res.render('welcome'));

//dashboard
router.get('/dashboard', (req, res) => {
 if (!req.user.location) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.user.location, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                address: req.user.location
            })
        })
    })
});

module.exports = router;