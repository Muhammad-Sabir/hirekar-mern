import React, { useState } from 'react';

const JobPostingForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        hours: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const jobData = {
            title: formData.title,
            description: formData.description,
            price_per_hour: formData.price,
            hours: formData.hours,
            address: formData.address
        };

        try {
            const response = await fetch('http://localhost:8000/api/job/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Job created successfully:', data);
            alert("Job Added Successfully");
            // You can also reset the form here if needed
            setFormData({
                title: '',
                description: '',
                price: '',
                hours: '',
                address: ''
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
            <h2 className="text-lg font-semibold mb-2">Job Posting Form:</h2>
            <p className="text-sm mb-4">Please fill out the following details to create your job posting.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-3 mt-5">Enter Job Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className='col-span-2'>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder='Enter Job Title'
                                className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className='col-span-2'>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 text-sm  text-gray-400 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter job description"
                                rows={4} // Adjust the number of rows as needed
                            ></textarea>
                        </div>
                        <div className='col-span-2'>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder='Enter Job Address'
                                className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className=" font-semibold mb-3 mt-5">Enter Job Comprehension</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder='Enter Job Price/hr'
                                className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                placeholder='Enter Job Hours'
                                className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-700">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default JobPostingForm;
