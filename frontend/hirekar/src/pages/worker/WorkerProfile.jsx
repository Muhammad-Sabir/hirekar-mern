import { useState, useEffect } from "react";

// Extracted validation function
const validateAddress = (address) => {
  const addressRegex = /, [a-zA-Z\s]+, [a-zA-Z\s]+$/;
  return addressRegex.test(address);
};

const WorkerProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone_number: "",
    password: "********",
    designation: "Electrician",
    skills: "",
    hourly_rate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://16.171.195.37/api/user/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFormData({
          name: data.user.name,
          address: data.user.address,
          email: data.user.email,
          phone_number: data.user.phone_number,
          password: "********",
          designation: data.worker.designation,
          skills: data.worker.skills.join(", "),
          hourly_rate: data.worker.hourly_rate,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddress(formData.address)) {
      setError(
        "Please specify the city and country in the address \n (e.g., House No 82, Block B, Model Town, Lahore, Pakistan)."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://16.171.195.37/api/user/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map((skill) => skill.trim()),
        }),
      });
      const data = await response.json();
      console.log("Profile updated:", data);
      setError("");
      alert("Profile has been updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
      <h2 className="mb-2 text-lg font-semibold">Your Profile</h2>
      <p className="mb-4 text-sm">
        You can update your profile information below:
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="address" className="block mb-1 font-semibold">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phone_number" className="block mb-1 font-semibold">
            Phone Number:
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            disabled
            className="w-full px-4 py-2 text-sm bg-gray-200 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="designation" className="block mb-1 font-semibold">
            Designation:
          </label>
          <select
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Driver">Driver</option>
            <option value="Gardener">Gardener</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
          </select>
        </div>
        <div>
          <label htmlFor="skills" className="block mb-1 font-semibold">
            Skills (comma separated):
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="hourly_rate" className="block mb-1 font-semibold">
            Hourly Rate:
          </label>
          <input
            type="number"
            id="hourly_rate"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-700"
          >
            Update
          </button>
        </div>
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default WorkerProfile;
