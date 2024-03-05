CREATE TABLE Users (
                       user_id SERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Books (
                       book_id SERIAL PRIMARY KEY,
                       user_id INTEGER REFERENCES Users(user_id),
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       value VARCHAR(255),
                       status VARCHAR(50) DEFAULT 'available',
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
                            category_id SERIAL PRIMARY KEY,
                            name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Book_Categories (
                                 book_id INTEGER REFERENCES Books(book_id),
                                 category_id INTEGER REFERENCES Categories(category_id),
                                 PRIMARY KEY (book_id, category_id)
);

CREATE TABLE Reviews (
                         review_id SERIAL PRIMARY KEY,
                         book_id INTEGER REFERENCES Books(book_id),
                         user_id INTEGER REFERENCES Users(user_id),
                         rating INTEGER NOT NULL,
                         comment TEXT,
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Exchanges (
                           exchange_id SERIAL PRIMARY KEY,
                           book_id INTEGER REFERENCES Books(book_id),
                           owner_id INTEGER REFERENCES Users(user_id),
                           requester_id INTEGER REFERENCES Users(user_id),
                           status VARCHAR(50) DEFAULT 'requested',
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE Notifications (
                               notification_id SERIAL PRIMARY KEY,
                               user_id INTEGER REFERENCES Users(user_id),
                               message TEXT NOT NULL,
                               read_status VARCHAR(50) DEFAULT 'unread',
                               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
