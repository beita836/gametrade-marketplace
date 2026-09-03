# 🔐 GameTrade Authentication Setup Guide

## Overview
This document explains how to set up and use the Supabase authentication system for your GameTrade marketplace.

## Files Added

### 1. `supabase-config.js`
- **Purpose**: Main authentication module with all Supabase functions
- **Key Functions**:
  - `registerUser()` - Create new user account
  - `loginUser()` - User login
  - `logoutUser()` - User logout
  - `getCurrentUser()` - Get current authenticated user
  - `getUserProfile()` - Fetch user profile from database
  - `addOrderToUser()` - Add an order to user's account
  - `getUserOrders()` - Get all orders for a user

### 2. `auth.html`
- **Purpose**: Login and registration page
- **Features**:
  - Beautiful UI with gradient background
  - Toggle between login and registration forms
  - Email and password validation
  - Error messages and success feedback
  - Responsive design for mobile and desktop

### 3. `migrate-orders.html`
- **Purpose**: Order migration tool
- **Features**:
  - Display all existing orders
  - Show total order count and amount
  - One-click migration to user account
  - Progress and status messages

### 4. `database-setup.sql`
- **Purpose**: Database schema and configuration
- **Tables**:
  - `profiles` - User profile information
  - `orders` - User orders
- **Security**: Includes Row Level Security (RLS) policies

## Setup Instructions

### Step 1: Set Up Database Schema

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** (in the left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `database-setup.sql`
6. Click **Run**

✅ Your database is now set up!

### Step 2: Update Your index.html

Add these lines to your existing `index.html` in the navbar section:

```html
<!-- Add to navbar -->
<div id="authSection" style="margin-left: auto;">
  <button id="loginBtn" onclick="goToAuth()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">登录/注册</button>
  <button id="logoutBtn" onclick="handleLogout()" style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; display: none;">退出登录</button>
  <span id="userDisplay" style="margin-left: 10px; display: none;"></span>
</div>

<script type="module">
  import { getCurrentUser, logoutUser } from './supabase-config.js';

  window.goToAuth = () => {
    window.location.href = 'auth.html';
  };

  window.handleLogout = async () => {
    await logoutUser();
    window.location.reload();
  };

  // Check login status on page load
  const user = await getCurrentUser();
  if (user) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('userDisplay').textContent = `欢迎, ${user.email}`;
    document.getElementById('userDisplay').style.display = 'inline';
  }
</script>
```

### Step 3: Add Migration Link to My Page

In your "我的" (My) page section, add a link to the migration tool:

```html
<a href="migrate-orders.html" style="padding: 10px 20px; background: #27ae60; color: white; border-radius: 5px; text-decoration: none; cursor: pointer;">
  📦 迁移订单到我的账户
</a>
```

## User Flow

### 1. **New User Registration**
   - User clicks "登录/注册" button
   - Goes to `auth.html`
   - Fills in username, email, and password
   - Clicks "注册" (Register)
   - Account created in Supabase
   - User profile created in database
   - Redirected to index.html

### 2. **Existing User Login**
   - User clicks "登录/注册" button
   - Goes to `auth.html`
   - Enters email and password
   - Clicks "登录" (Login)
   - Session established
   - Redirected to index.html
   - Can see "欢迎" message and logout button

### 3. **Order Migration**
   - Logged-in user clicks "迁移订单到我的账户"
   - Goes to `migrate-orders.html`
   - Views all existing orders
   - Clicks "开始迁移" (Start Migration)
   - All orders added to user's account
   - Totals updated in profile

## API Functions Reference

### registerUser(email, password, username)
```javascript
const result = await registerUser('user@email.com', 'password123', 'username');
if (result.success) {
  console.log('User ID:', result.userId);
}
```

### loginUser(email, password)
```javascript
const result = await loginUser('user@email.com', 'password123');
if (result.success) {
  console.log('Logged in:', result.user.email);
}
```

### getCurrentUser()
```javascript
const user = await getCurrentUser();
if (user) {
  console.log('User email:', user.email);
}
```

### getUserProfile(userId)
```javascript
const profile = await getUserProfile(userId);
console.log('Username:', profile.username);
console.log('Total orders:', profile.total_orders);
console.log('Total amount:', profile.total_amount);
```

### addOrderToUser(userId, order)
```javascript
const order = {
  id: "GT202608170001",
  time: "2026-08-17 19:59",
  buyer: "买家名称",
  amount: 200,
  title: "订单商品",
  status: "交易完成"
};
const result = await addOrderToUser(userId, order);
```

### getUserOrders(userId)
```javascript
const result = await getUserOrders(userId);
if (result.success) {
  console.log('User orders:', result.orders);
}
```

## Security Features

✅ **Passwords**: Hashed and encrypted by Supabase Auth
✅ **Sessions**: Secure JWT tokens
✅ **Database Access**: Row Level Security (RLS) policies
✅ **Data Protection**: Users can only access their own data
✅ **HTTPS**: All communications encrypted

## Testing

### Test Registration
1. Open `auth.html`
2. Click "立即注册"
3. Fill in username, email, password
4. Click "注册"
5. Should see success message
6. Should redirect to `index.html`

### Test Login
1. Click logout to return to auth page
2. Click "立即登录"
3. Enter your email and password
4. Click "登录"
5. Should see welcome message

### Test Order Migration
1. While logged in, click "迁移订单到我的账户"
2. Review the orders
3. Click "开始迁移"
4. Should see success message
5. Orders now associated with your account

## Troubleshooting

### "Failed to sign up" error
- Check that email is valid
- Check that password is at least 6 characters
- Check that username doesn't already exist

### "Failed to sign in" error
- Check email and password are correct
- Make sure you registered first

### Orders not migrating
- Make sure you're logged in
- Check browser console for error messages
- Verify database schema was set up correctly

### "Cannot read property 'id'" error
- Make sure you ran the `database-setup.sql` script
- Check that profiles table exists in Supabase

## Next Steps

1. ✅ Deploy to GitHub Pages
2. ✅ Test with real users
3. ✅ Add seller functionality (optional)
4. ✅ Implement payment processing (optional)
5. ✅ Add order status tracking (optional)

## Support

For issues or questions:
- Check [Supabase Documentation](https://supabase.com/docs)
- Review error messages in browser console (F12)
- Check `database-setup.sql` for correct schema

---

**Last Updated**: 2026-09-03
**Version**: 1.0.0
