import React, { useState } from 'react';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: 'John Doe',
        address: '123 Main St, Anytown',
        email: 'johndoe@example.com',
        password: '********'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can implement logic to update the profile
        console.log(formData);
    };

    return (
        <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
            <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
            <p className="text-sm mb-4">You can Update your profile information below:</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="font-semibold mb-1 block">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="font-semibold mb-1 block">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="font-semibold mb-1 block">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="font-semibold mb-1 block">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        disabled
                        className="w-full px-4 text-sm py-2 border rounded-lg bg-gray-200"
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-700">Update</button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
