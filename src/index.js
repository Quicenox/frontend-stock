const express = require('express');
const cors = require('cors')
const path = require('path');
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/registro.html'))
});

app.use(express.static(path.join(__dirname, '/public')));

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});