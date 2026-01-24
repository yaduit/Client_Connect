import { useState } from "react";
import { SignupApi } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const navigate = useNavigate();
    const[form, setForm] = useState({
        name: "",
        email:"",
        password:"",
        role:"seeker",
    });

  const[loading, setLoading] = useState(false);
  const[error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value});
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        setLoading(true);
        setError(null);

        const data = await SignupApi(form);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/")
    }catch(err){
        setError(err.response?.data?.message|| "Signup failed");
    }finally{
        setLoading(false)
    }
    };
  

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />

      <select name="role" onChange={handleChange}>
        <option value="seeker">User</option>
        <option value="provider">Provider</option>
      </select>

      {error && <p className="text-red-500">{error}</p>}

      <button disabled={loading}>
        {loading ? "Creating account..." : "Signup"}
      </button>
    </form>
  );
};

export default SignupForm;
