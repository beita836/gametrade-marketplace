(function () {
  const STORAGE_SESSION = 'gametrade_session';
  const STORAGE_PROFILES = 'gametrade_profiles';
  const STORAGE_ORDERS = 'gametrade_orders';

  const makeId = () => {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'gt-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  };

  const readStorage = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Storage unavailable:', error);
      return false;
    }
  };

  const listProfiles = () => readStorage(STORAGE_PROFILES, []);
  const saveProfiles = (profiles) => writeStorage(STORAGE_PROFILES, profiles);

  const listOrders = () => readStorage(STORAGE_ORDERS, []);
  const saveOrders = (orders) => writeStorage(STORAGE_ORDERS, orders);

  async function registerUser(email, password, username) {
    if (!email || !password || !username) {
      return { success: false, error: '请填写完整信息' };
    }

    if (password.length < 6) {
      return { success: false, error: '密码至少需要 6 个字符' };
    }

    const profiles = listProfiles();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (profiles.some((profile) => profile.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: '该邮箱已注册' };
    }

    if (profiles.some((profile) => profile.username.toLowerCase() === normalizedUsername.toLowerCase())) {
      return { success: false, error: '用户名已存在' };
    }

    const user = {
      id: makeId(),
      username: normalizedUsername,
      email: normalizedEmail,
      createdAt: new Date().toISOString()
    };

    profiles.push(user);
    saveProfiles(profiles);

    return {
      success: true,
      userId: user.id,
      requiresEmailConfirmation: false,
      user: { id: user.id, email: user.email, user_metadata: { username: user.username } }
    };
  }

  async function loginUser(email, password) {
    if (!email || !password) {
      return { success: false, error: '邮箱和密码不能为空' };
    }

    const profiles = listProfiles();
    const profile = profiles.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());

    if (!profile) {
      return { success: false, error: '账户不存在，请先注册' };
    }

    const session = {
      user: {
        id: profile.id,
        email: profile.email,
        user_metadata: { username: profile.username }
      }
    };

    writeStorage(STORAGE_SESSION, session);

    return {
      success: true,
      user: session.user
    };
  }

  async function logoutUser() {
    localStorage.removeItem(STORAGE_SESSION);
    return { success: true };
  }

  async function getCurrentUser() {
    const session = readStorage(STORAGE_SESSION, null);
    return session ? session.user : null;
  }

  async function createUserProfile(userId, username, email) {
    const profiles = listProfiles();
    const profile = profiles.find((item) => item.id === userId);

    if (!profile) {
      profiles.push({
        id: userId,
        username,
        email,
        createdAt: new Date().toISOString()
      });
      saveProfiles(profiles);
    }

    return { success: true, alreadyExists: !!profile };
  }

  async function getUserProfile(userId) {
    const profiles = listProfiles();
    return profiles.find((profile) => profile.id === userId) || null;
  }

  async function addOrderToUser(userId, order) {
    const orders = listOrders();
    const normalizedOrder = {
      id: order.id || `GT${Date.now()}`,
      time: order.time || new Date().toLocaleString('zh-CN'),
      buyer: order.buyer || '匿名买家',
      amount: Number(order.amount) || 0,
      title: order.title || '未知商品',
      status: order.status || '交易完成',
      user_id: userId,
      created_at: new Date().toISOString()
    };

    const existingIndex = orders.findIndex((item) => item.id === normalizedOrder.id && item.user_id === userId);

    if (existingIndex >= 0) {
      orders[existingIndex] = normalizedOrder;
    } else {
      orders.push(normalizedOrder);
    }

    saveOrders(orders);
    return { success: true, order: normalizedOrder };
  }

  async function getUserOrders(userId) {
    const orders = listOrders().filter((order) => order.user_id === userId);
    return { success: true, orders: orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) };
  }

  async function findUserByUsername(username) {
    const profiles = listProfiles();
    const usernameValue = (username || '').trim();
    return profiles.find((profile) => profile.username.toLowerCase() === usernameValue.toLowerCase()) || null;
  }

  window.GameTradeAuth = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    createUserProfile,
    getUserProfile,
    addOrderToUser,
    getUserOrders,
    findUserByUsername,
    getSession: getCurrentUser,
    profiles: listProfiles,
    orders: listOrders
  };
})();
