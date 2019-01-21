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

    // Add a new user
    app.post('/bookmarks', (request, response) => {
        pool.query('INSERT INTO bookmarks SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send(`Bookmark added with ID: ${result.insertId}`);
        });
    });

    // Update an existing user
    app.put('/bookmarks/:id', (request, response) => {
        const id = request.params.id;

        pool.query('UPDATE bookmarks SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('bookmark updated successfully.');
        });
    });

    // Delete a user
    app.delete('/bookmarks/:id', (request, response) => {
        const id = request.params.id;

        pool.query('DELETE FROM bookmarks WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('bookmark deleted.');
        });
    });
};

// Export the router
module.exports = router;