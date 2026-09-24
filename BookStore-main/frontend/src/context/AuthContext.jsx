import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const getInitialUser = () => {
	try {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	} catch (error) {
		console.error("Error parsing user from localStorage:", error);
		localStorage.removeItem("user");
		return null;
	}
};

const getInitialToken = () => {
	try {
		return localStorage.getItem("token") || null;
	} catch (error) {
		console.error("Error reading token from localStorage:", error);
		return null;
	}
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(getInitialUser);
	const [token, setToken] = useState(getInitialToken);

	const login = (userData, jwtToken) => {
		try {
			localStorage.setItem("user", JSON.stringify(userData));
			localStorage.setItem("token", jwtToken);
		} catch (error) {
			console.error("Error saving auth data to localStorage:", error);
		}
		setUser(userData);
		setToken(jwtToken);
	};

	const logout = () => {
		try {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		} catch (error) {
			console.error("Error clearing auth data from localStorage:", error);
		}
		setUser(null);
		setToken(null);
	};

	useEffect(() => {
		const handleStorageChange = () => {
			setUser(getInitialUser());
			setToken(getInitialToken());
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				setUser,
				login,
				logout,
				isAuthenticated: Boolean(user && token),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};


