# BotHub

1. Start postgres db
```bash 
docker run -d --name postgres_db -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=bothub -p 5432:5432 postgres:latest 
```

2. Install packages
```bash
yarn install
```

3. Generate prisma
```bash
npx prisma generate
```

3. Migrate db
```bash
npx prisma migrate
```

4. Start server
```bash
yarn dev
```