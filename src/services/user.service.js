import User from '../models/user.model.js';

const createUser = async ({ name, phone, email, password, company, isAgency }) => {
    const user = await User.create({
        name,
        phone,
        email,
        password,
        company,
        isAgency
    });
    return user;
};

export { createUser };
