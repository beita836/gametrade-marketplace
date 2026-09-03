// 🔐 Supabase Configuration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm';

// Your Supabase credentials (public key is safe to share)
const SUPABASE_URL = 'https://wggyfkrbnmnbfakidilv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZ3lma3Jibm1uYmZha2lkaWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTA2NTMsImV4cCI6MjEwNDAyNjY1M30.4BeWBykbNWS1b9-_0Or2cTZDowkGCdWc8JMY0ZRp54Y';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 📝 REGISTER NEW USER
async function registerUser(email, password, username) {
  try {
    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (error) throw error;

    const userId = data.user.id;

    // Create user profile in database
    await createUserProfile(userId, username, email);

    console.log('✅ User registered successfully!');
    return { success: true, userId };
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    return { success: false, error: error.message };
  }
}

// 🔓 LOGIN USER
async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    console.log('✅ Login successful!');
    return { success: true, user: data.user };
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return { success: false, error: error.message };
  }
}

// 🚪 LOGOUT USER
async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('✅ Logout successful!');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    return { success: false, error: error.message };
  }
}

// 👤 GET CURRENT USER
async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session?.user || null;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
}

// 📊 CREATE USER PROFILE
async function createUserProfile(userId, username, email) {
  try {
    const { error } = await supabase.from('users').insert([
      {
        auth_id: userId,
        username: username,
        email: email,
        created_at: new Date()
      }
    ]);

    if (error) throw error;
    console.log('✅ User profile created!');
  } catch (error) {
    console.error('❌ Error creating profile:', error.message);
  }
}

// 👤 GET USER PROFILE
async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error getting profile:', error.message);
    return null;
  }
}

// 📦 ADD ORDER TO USER
async function addOrderToUser(userId, order) {
  try {
    // Insert order into orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        order_id: order.id,
        order_time: order.time,
        buyer_name: order.buyer,
        product_title: order.title,
        amount: order.amount,
        status: order.status,
        created_at: new Date()
      }])
      .select();

    if (orderError) throw orderError;

    console.log('✅ Order added to user account!');
    return { success: true, order: orderData[0] };
  } catch (error) {
    console.error('❌ Error adding order:', error.message);
    return { success: false, error: error.message };
  }
}

// 📦 GET USER ORDERS
async function getUserOrders(userId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, orders: data };
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    return { success: false, orders: [] };
  }
}

// 🔍 SEARCH USER BY USERNAME
async function findUserByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error searching user:', error.message);
    return null;
  }
}

// Export all functions
export {
  supabase,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  createUserProfile,
  getUserProfile,
  addOrderToUser,
  getUserOrders,
  findUserByUsername
};