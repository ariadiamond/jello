#!/bin/bash

FILE_NAME="job_applications.sqlite3"

if [ -e "$FILE_NAME" ]; then
  if [ -n "$OVERWRITE_SQL_DATABASE" ]; then
    rm $FILE_NAME
  else
    echo "You already have an existing database at $FILE_NAME. If you want to remove it, please set the environment variable OVERWRITE_SQL_DATABASE"
    exit 1
  fi
fi

SQL_SCHEMA="schema.sql"

cat > $SQL_SCHEMA <<EOF
  CREATE TABLE companies(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(80) NOT NULL,
    url VARCHAR(200),
    notes TEXT
  );

  CREATE TABLE statuses(
    status CHAR(2) PRIMARY KEY
  );
  INSERT INTO statuses(status) VALUES ('ap'), ('i1'), ('i2'), ('i3'), ('i4'), ('wa'), ('of'), ('re');

  CREATE TABLE job_applications(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    company_id INTEGER REFERENCES companies(id) NOT NULL,
    status CHAR(2) REFERENCES statuses(status) NOT NULL,
    applied_on DATETIME,
    notes TEXT
  );

  CREATE TABLE job_application_status_junctions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_application_id INTEGER REFERENCES job_applications(id),
    status CHAR(2) REFERENCES statuses(status),
    created_at DATETIME,
    notes TEXT
  );
EOF

cat $SQL_SCHEMA | sqlite3 $FILE_NAME

rm $SQL_SCHEMA
