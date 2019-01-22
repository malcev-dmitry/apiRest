// Load the MySQL pool connection
const pool = require('./config');

// Route the app
const router = app => {
    // Display welcome message on the root
    app.get('/', (request, response) => {
        response.send({
            message: 'Welcome to the Node.js Express REST API!'
        });
    });

    // Display all users
    app.get('/bookmarks', (request, response) => {
        pool.query('SELECT * FROM bookmarks', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Display a single user by ID
    app.get('/bookmarks/:id', (request, response) => {
        const id = request.params.id;

        pool.query('SELECT * FROM bookmarks WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Узнать количество строк в таблице для пагинации
    app.get('/count', (request, response) => {
        pool.query('SELECT COUNT(*) AS rowsCount FROM bookmarks', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Получить строки из бд с позиции id в колличестве limit
    app.get('/interval/:id/:limit', (request, response) => {
        const id = request.params.id;
        const limit = request.params.limit;
        pool.query('SELECT * FROM bookmarks ORDER BY id LIMIT ' + id + ', ' + limit, (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    // Add a new user
    app.post('/bookmarks/add', (request, response) => {
        let select = '';
        for (key in response.req.body) {
            if (key === 'date_bookmark')
                response.req.body[key] = response.req.body[key].slice(0, 10);
            select = `${select + key} = "${response.req.body[key]}", `;
        }
        select = select.slice(0, select.length - 2);
        pool.query('INSERT INTO bookmarks SET '+ select, (error, result) => {
            if (error) throw error;

            response.status(201).send(`Bookmark added with ID: ${result.insertId}`);
        });
    });

    // Update an existing user
    app.put('/bookmarks/update/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE bookmarks SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('bookmark updated successfully.');
        });
    });

    // Delete a user
    app.delete('/bookmarks/del/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM bookmarks WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('bookmark deleted.');
        });
    });
};

// Export the router
module.exports = router;