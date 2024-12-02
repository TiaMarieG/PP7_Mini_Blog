CREATE DATABASE blog;

CREATE TABLE posts (
	id INT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    content VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

SELECT * from posts;