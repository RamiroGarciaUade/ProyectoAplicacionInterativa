const API_URL = "http://localhost:8080/auth";

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      
      const userResponse = await fetch(`http://localhost:8080/users/email/${email}`, {
        headers: {
          "Authorization": `Bearer ${data.access_token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user data");
      }

      const userData = await userResponse.json();
      
      return {
        access_token: data.access_token,
        user: userData
      };
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        imageUrl: userData.imageUrl,
      };

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
