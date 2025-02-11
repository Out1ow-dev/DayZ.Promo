// Используем относительные пути
const checkAuth = async () => {
    try {
        const response = await fetch('/api/Auth/check', {
            credentials: 'include'
        });
        // ...
    } catch (error) {
        console.error('Auth check error:', error);
    }
}; 