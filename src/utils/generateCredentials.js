
export const generateShopCredentials = () => {
    // Generate Random Login ID (SHOP-XXXXXX)
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const loginId = `SHOP-${randomId}`;

    // Generate Strong Random Password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    let password = "";
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return { loginId, password };
};
