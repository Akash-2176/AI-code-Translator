const BASE_URL = "http://localhost:5000"; // Later, you can .env this

// Fetches token from localStorage and sends request to translate code
export const translateCode = async (code, sourceLang, targetLang) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  
  if (!token) {
    throw new Error("No token found. Please login again.");
  }

  const res = await fetch(`${BASE_URL}/api/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Attach token in Authorization header
    },
    body: JSON.stringify({ code, sourceLang, targetLang }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Translation failed");
  }

  return await res.json(); // Return the translated code from response
};

// User registration function
export const registerUser = async (username, email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.error || "Registration failed" };
    }

    return await res.json();
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, message: 'Network error' };
  }
};

// User login function
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.error || "Login failed" };
    }

    const result = await res.json();

    // Store token in localStorage if login is successful
    if (result.token) {
      localStorage.setItem('token', result.token); // Store token for future requests
      return { success: true, token: result.token, username: result.username };
    } else {
      return { success: false, message: "Login failed" };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'Network error' };
  }
};
