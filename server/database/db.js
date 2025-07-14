
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'recipemaster.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT DEFAULT 'owner',
        subscription_plan TEXT DEFAULT 'free',
        subscription_status TEXT DEFAULT 'active',
        subscription_expires_at DATETIME,
        restaurant_name TEXT,
        restaurant_address TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recipes table
    db.run(`
      CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        prep_time INTEGER,
        cook_time INTEGER,
        servings INTEGER,
        difficulty TEXT,
        cost_per_serving REAL,
        image_url TEXT,
        instructions TEXT,
        ingredients TEXT,
        nutritional_info TEXT,
        tags TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Inventory table
    db.run(`
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        current_stock REAL NOT NULL,
        unit TEXT NOT NULL,
        min_stock REAL DEFAULT 0,
        cost_per_unit REAL,
        supplier TEXT,
        supplier_contact TEXT,
        last_restocked DATETIME,
        expiry_date DATETIME,
        location TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Tables table
    db.run(`
      CREATE TABLE IF NOT EXISTS tables (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        table_number INTEGER NOT NULL,
        capacity INTEGER NOT NULL,
        status TEXT DEFAULT 'available',
        location TEXT,
        x_position REAL DEFAULT 0,
        y_position REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        table_id TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        status TEXT DEFAULT 'pending',
        order_type TEXT DEFAULT 'dine-in',
        subtotal REAL NOT NULL,
        tax REAL DEFAULT 0,
        tip REAL DEFAULT 0,
        total REAL NOT NULL,
        items TEXT,
        special_instructions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (table_id) REFERENCES tables (id)
      )
    `);

    // Reservations table
    db.run(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        table_id TEXT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        customer_email TEXT,
        party_size INTEGER NOT NULL,
        reservation_date DATETIME NOT NULL,
        duration_minutes INTEGER DEFAULT 120,
        status TEXT DEFAULT 'confirmed',
        special_requests TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (table_id) REFERENCES tables (id)
      )
    `);

    // Suppliers table
    db.run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        contact_person TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        payment_terms TEXT,
        delivery_schedule TEXT,
        notes TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Restock orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS restock_orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        supplier_id TEXT,
        status TEXT DEFAULT 'pending',
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        expected_delivery DATETIME,
        total_amount REAL,
        items TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
      )
    `);

    console.log('Database initialized successfully');
  });
};

initDatabase();

module.exports = db;
