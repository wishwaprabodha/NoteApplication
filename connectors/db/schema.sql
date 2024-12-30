CREATE TABLE users
(
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_notes
(
    user_note_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT     NOT NULL,
    latest_version INT     NOT NULL,
    is_deleted     BOOLEAN NOT NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE note_contents
(
    note_content_id INT AUTO_INCREMENT PRIMARY KEY,
    user_note_id    INT          NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content         TEXT         NOT NULL,
    version_number  INT          NOT NULL,
    multimedia      VARCHAR(255) NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_note_id) REFERENCES user_notes (user_note_id) ON DELETE CASCADE
);

CREATE TABLE shared_notes
(
    shared_note_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    shared_user_id INT NOT NULL,
    user_note_id   INT NOT NULL,
    is_active      BOOLEAN NOT NULL DEFAULT 1,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_note_id) REFERENCES user_notes (user_note_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (shared_user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
