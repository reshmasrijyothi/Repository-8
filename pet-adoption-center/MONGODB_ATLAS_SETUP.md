# 🗄️ MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. **Visit MongoDB Atlas**: Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)

2. **Sign Up**: Click "Try Free" and create your account with email

3. **Verify Email**: Check your email and verify your account

## Step 2: Create Your First Cluster

1. **Welcome Screen**: After login, you'll see "Deploy a database"

2. **Choose FREE Tier**: 
   - Select **M0 Sandbox** (FREE)
   - Provider: **AWS** 
   - Region: Choose closest to your location
   - Cluster Name: `pet-adoption-cluster` (or keep default)

3. **Click "Create"**

## Step 3: Create Database User

1. **Database Access**:
   - On left sidebar, click "Database Access"
   - Click "Add New Database User"

2. **User Settings**:
   - Authentication Method: **Password**
   - Username: `petadmin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: **Atlas admin**

3. **Click "Add User"**

## Step 4: Configure Network Access

1. **Network Access**:
   - On left sidebar, click "Network Access"
   - Click "Add IP Address"

2. **Allow Access**:
   - Click "Allow Access from Anywhere" 
   - This sets IP to `0.0.0.0/0` (good for development)
   - Click "Confirm"

## Step 5: Get Connection String

1. **Connect to Cluster**:
   - Go back to "Database" (left sidebar)
   - Click "Connect" on your cluster

2. **Connect Your Application**:
   - Choose "Drivers"
   - Select "Node.js" and version "4.1 or later"
   - Copy the connection string

3. **Your connection string looks like**:
```
mongodb+srv://petadmin:<password>@pet-adoption-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Backend Environment

Replace in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://petadmin:YOUR_ACTUAL_PASSWORD@pet-adoption-cluster.xxxxx.mongodb.net/pet-adoption?retryWrites=true&w=majority
```

**Important**: 
- Replace `<password>` with your actual password
- Replace `xxxxx` with your actual cluster identifier
- Add `/pet-adoption` after `.net` to specify database name

## Step 7: Test Connection

Run in your backend directory:
```bash
cd backend
npm run seed
```

If successful, you'll see:
```
🌱 Starting database seeding...
✅ Database seeded successfully!
```

## 🎉 You're Ready!

Your MongoDB Atlas database is now connected and ready to use with sample data!