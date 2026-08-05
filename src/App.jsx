import { useState } from "react";
import { useFormik } from "formik";

const App = () => {
  // Application State
  const [isFormOpen, setIsFormOpen] = useState(false);

// LocalStorage se data load karna, agar pehle se mojood ho
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("registered_users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);

  // Formik Initialization
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      age: "",
      password: "",
      confirmPassword: "",
    },


    validate: (values) => {
      const errors = {};
      if (!values.firstName) errors.firstName = "First Name is required";
      if (!values.lastName) errors.lastName = "Last Name is required";

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.phone) errors.phone = "Phone is required";
      if (!values.gender) errors.gender = "Gender is required";

      if (!values.age) errors.age = "Age is required";
      else if (values.age < 1 || values.age > 120) errors.age = "Enter a valid age";

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(values.password)) {
        // Nayi condition Regex ke sath
        errors.password = "Password must have at least 1 uppercase, 1 lowercase, 1 number & 1 special character";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords must match";
      }
      
      return errors;
    },

    onSubmit: (values, { resetForm }) => {
      // 1. Naye user ko purane array ke sath milana
      const updatedUsers = [...users, { ...values, id: Date.now() }];
      // 2. State ko update karna
      setUsers(updatedUsers);
      // 3. Browser ke LocalStorage mein save karna (JSON string ki shakal mein)
      localStorage.setItem("registered_users", JSON.stringify(updatedUsers));
      // 4. Form reset aur popup band karna
      resetForm();
      setIsFormOpen(false);
    },
  });

  // Filter users based on search term (Name) and Age Range slider
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesAge = Number(user.age) >= minAge && Number(user.age) <= maxAge;
    return matchesSearch && matchesAge;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Signup Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management Dashboard</h1>
            <p className="text-sm text-slate-500">Manage user registrations, search, and dynamic age filtering.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition shadow-md shadow-blue-100 cursor-pointer"
          >
            Signup User
          </button>
        </div>

        {/* Modal / Inline Form Popup */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">User Signup Form</h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.age}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.age && formik.errors.age && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.age}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                  <select
                    name="gender"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.gender}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters Section (Search Bar & Age Range Slider) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Type name or characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age Range Slider Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Filter by Age Range
              </label>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {minAge} yrs - {maxAge} yrs
              </span>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400">Min: {minAge}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400">Max: {maxAge}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Registered Users List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Gender</th>
                  <th className="p-4 font-semibold">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="p-4 text-slate-600">{user.email}</td>
                      <td className="p-4 text-slate-600">{user.phone}</td>
                      <td className="p-4 text-slate-600">{user.gender}</td>
                      <td className="p-4 text-slate-600">{user.age}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;