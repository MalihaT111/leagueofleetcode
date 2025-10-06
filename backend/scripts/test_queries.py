from src.database.query_executor import execute_query

users = execute_query("SHOW COLUMNS FROM users;")
print(users)