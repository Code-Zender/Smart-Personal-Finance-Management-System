
const path = require('path')
const fs = require('fs');
const { saveInCache, readCache, removeCache, getCodeByEmail, isEmailInCache, timesOpend } = require('../cache/cache.js');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../configs/config.json'), 'utf8'));

function get(app){
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.root));
        timesOpend();
      });
      
      app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.login));
      });
      
      app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.register));
      });
      
      app.get('/config', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.config));
      });
      
      app.get('/wait', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.wait));
      });
      
      app.get('/confirm', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.confirm));
      });
      
      app.get('/prove', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.prove));
      });
      
      app.get('/charts', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.charts));
      });
      
      app.get('/addFinances', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.addFinances));
      });
      
      app.get('/displayData', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.displayData));
      });
      
      app.get('/profileUrl', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.profileUrl));
      });
      
      app.get('/aboutUS', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.aboutUS));
      });
      
      app.get('/aboutThisProgramm', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.aboutThisProgramm));
      });
      
      app.get('/privacyPolicy', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.privacyPolicy));
      });
      
      app.get('/ContactUS', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.ContactUS));
      });
      
      app.get('/debug.clear.database', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.clearDATA));
      });
      
      app.get('/cacheWR', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.cache));
      });
      
      app.get('/Dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, config.routes.Dashboard));
      });
}
module.exports = get;