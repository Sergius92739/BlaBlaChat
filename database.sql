CREATE TYPE is_online AS ENUM ('online', 'offline');
create TABLE users(
  id SERIAL PRIMARY KEY,
  login VARCHAR(20),
  password VARCHAR(20),
  avatar VARCHAR(255),
  is_online is_online,
  created_at DATE DEFAULT CURRENT_DATE,
  is_activated BOOLEAN
);

create TABLE messages(
  id SERIAL PRIMARY KEY,
  content TEXT,
  creator_id INTEGER,
  created_at DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TYPE is_read AS ENUM ('yes', 'no');
create TABLE message_recipient(
  id SERIAL PRIMARY KEY,
  recipient_id INTEGER,
  message_id INTEGER,
  is_read is_read,
  FOREIGN KEY (recipient_id) REFERENCES users (id),
  FOREIGN KEY (message_id) REFERENCES messages (id)
);