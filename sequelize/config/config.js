module.exports ={
development: {
    dialect: 'postgres', // This is for PostgreSQL
    username: 'postgrestempo',
    password: 'temp7865tempo',
    database: 'tempodb',
    host: 'database-indentifier-tempo.ceuly2qhjpno.us-east-1.rds.amazonaws.com',
    logging: false,
  },
  production: {
    dialect: 'postgres',
    username: process.env.DB_USERNAME || 'tempospace4115',
    password: process.env.DB_PASSWORD || 'space-41153200',
    database: process.env.DB_NAME || 'tempospace',
    host: process.env.DB_HOST || 'tempospace.postgres.database.azure.com',
    logging: true,
    dialectOptions: {
      ssl: {
        require: true, // This will help you connect to Azure DB with SSL
        rejectUnauthorized: false // Azure requires SSL
      }
    }
  }
}