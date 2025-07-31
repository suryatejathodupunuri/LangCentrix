
# 🌐 LangCentrix – Project Management Tool

LangCentrix is a full-stack project management tool built using **Next.js** (frontend + backend), **MongoDB**, and **Prisma ORM**.

---

## 🔧 Tech Stack

| Tool/Library          | Purpose                                                    |
|-----------------------|------------------------------------------------------------|
| **Next.js**           | React-based framework for frontend & backend rendering     |
| **MongoDB Atlas**     | Cloud database                                             |
| **Prisma ORM**        | Communicate with MongoDB easily                            |
| **NextAuth.js**       | User authentication and session handling                   |
| **Tailwind CSS**      | Utility-first CSS framework for styling                    |
| **shadcn/ui**         | Pre-built, elegant UI components (button, card, etc.)      |

---

## 🔐 Admin Login (for testing)

```plaintext
📧 Email: admin@gmail.com
🔑 Password: Admin@123
📧 Email: editor@gmail.com
🔑 Password: Editor@123
```


## 🚀 Quick Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/suryatejathodupunuri/LangCentrix.git
cd LangCentrix
```

### 2. Add `.env` File

You will be provided a `.env` file separately.
📌 **Place it in the root directory** of the project (same level as `package.json`).

### 3. Install Dependencies

```bash
npm install
```

This installs all required dependencies listed in `package.json`, including:

| Package                                            | Why it's used                                  |
| -------------------------------------------------- | ---------------------------------------------- |
| `next`, `react`, `react-dom`                       | Required for Next.js                           |
| `prisma`, `@prisma/client`                         | ORM and database client                        |
| `next-auth`                                        | Handles user authentication                    |
| `tailwindcss`                                      | For styling the UI                             |
| `shadcn/ui`                                        | Pre-designed components (button, card, etc.)   |
| `zod`                                              | Schema validation for inputs                   |
| `bcryptjs`                                         | Password hashing                               |
| `lucide-react`                                     | Icons                                          |
| `react-toastify` (or `sonner`)                     | Toast messages and alerts                      |
| `class-variance-authority`, `@radix-ui/react-slot` | Used by shadcn for advanced component behavior |



---

### 4. Initialize Prisma & Sync DB

```bash
npx prisma generate
npx prisma db push
```

This will connect Prisma to your MongoDB and sync the schema.

---

### 5. Start the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

You can now log in using the admin credentials and explore the project.

---

