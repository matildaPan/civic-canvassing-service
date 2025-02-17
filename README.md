# **Civic Canvassing Service**

This is a **GraphQL-based civic canvassing service** built as part of a Murmuration take-home assignment.

---

## **📌 Step 1: Set Up PostgreSQL Database**

You need a **PostgreSQL** database running locally.

### **Option 1: Install PostgreSQL Locally**

- Ensure you have **PostgreSQL** installed on your machine.
- Create a user with a password:
- Create a database manually:

### **Option 2: Run PostgreSQL with Docker** (Recommended)

If you prefer **Docker**, run:

```sh
docker run --name postgres-container -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=canvassing_db -p 5432:5432 -d postgres
```

---

## **📌 Step 2: Set Up Prisma and Migrations**

1️⃣ **Navigate to the project directory**

```sh
cd src
```

2️⃣ **Initialize Prisma (if not already initialized)**

```sh
npx prisma init
```

3️⃣ **Create an `.env` file inside `src/`** and add your database connection URL:

```ini
DATABASE_URL="postgresql://[your-db-username]:[your-db-password]@localhost:5432/canvassing_db"
```

4️⃣ **Run Prisma migration to set up the database schema**

```sh
npx prisma migrate dev --name init
```

5️⃣ **Generate Prisma Client**

```sh
npx prisma generate
```

6️⃣ _(Optional: Reset database and apply migrations again)_

```sh
npx prisma migrate reset
```

7️⃣ _(Optional: Seed initial data)_

```sh
npm run seed
```

8️⃣ _(Optional: Open Prisma Studio to inspect the database)_

```sh
npx prisma studio
```

---

## **📌 Step 3: Start the GraphQL Server**

1️⃣ **Compile TypeScript**

```sh
npx tsc
```

2️⃣ **Start the Apollo Server**

```sh
npm run start
```

or, for **development mode** (with automatic restarts):

```sh
npm run dev
```

3️⃣ **Open GraphQL Playground**  
Visit **[http://localhost:4000/graphql](http://localhost:4000/graphql)** to explore the API.

---

## **📌 Testing the API**

You can test the GraphQL queries in **GraphQL Playground** or **Postman**.

### **1️⃣ Query: Get Households**

```graphql
query {
  getHouseholds {
    id
    address
    completed
  }
}
```

### **2️⃣ Mutation: Submit a Response**

```graphql
mutation {
  submitResponse(
    householdId: "some-household-id"
    answers: { q1: "Yes", q2: "No" }
  ) {
    id
    answers
  }
}
```

### **3️⃣ Query: Get Households Again**

```graphql
query {
  getHouseholds {
    id
    address
  }
}
```

**Expected Behavior:**  
After submitting a response, the household that responded will **no longer appear in the `getHouseholds` query result**.

### **Other Mutations:**

#### Remove Household

This will remove the household record and associated response if it has submitted response

```graphql
mutation {
  removeHousehold(id: "some-household-id")
}
```

#### Add Household

add new household with an address

```graphql
mutation {
  addHousehold(address: "123 hello street") {
    address
    completed
    id
  }
}
```

---

## **🚀 Future Improvements**

✅ **Data Validation**

- Address format validation

✅ **TypeScript Enhancements**

- Improve type safety and add missing types

✅ **Code Quality**

- Integrate **ESLint & Prettier** for better TypeScript linting

✅ **GraphQL Enhancements**

- Improve error handling and validation

✅ **Authentication & Authorization**

- Implement **JWT authentication** for secure access
- Role-based authorization (e.g., admin vs. volunteer access)

✅ **Performance Optimizations**

- **Caching** frequently accessed data
- Implement **pagination** for large datasets

✅ **Deployment**

- **Dockerize** the application for easy deployment
- Deploy on **Vercel / AWS / Heroku**
