<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scholarship DApp</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.ethers.io/lib/ethers-5.7.umd.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel" data-presets="react,env">
    const { useState, useEffect } = React;

    function RegisterForm({ onSubmit }) {
      const [role, setRole] = useState('student');
      const [password, setPassword] = useState('');
      const [name, setName] = useState('');
      const [gpa, setGpa] = useState('');
      const [income, setIncome] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ role, password, profile: { name, gpa: parseFloat(gpa), income: parseFloat(income) } });
      };

      return (
        <form onSubmit={handleSubmit} className="my-4 space-y-2">
          <h2 className="text-xl font-semibold">Register</h2>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="w-full p-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="institution">Institution</option>
            <option value="donor">Donor</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          {role === 'student' && (
            <>
              <input
                type="number"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="GPA"
                className="w-full p-2 border rounded"
                step="0.1"
                min="0"
                max="4"
                required
              />
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Income"
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Register
          </button>
        </form>
      );
    }

    function LoginForm({ onSubmit }) {
      const [password, setPassword] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ password });
      };

      return (
        <form onSubmit={handleSubmit} className="my-4 space-y-2">
          <h2 className="text-xl font-semibold">Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      );
    }

    function ApplyForm({ onSubmit }) {
      const [campaignId, setCampaignId] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(campaignId);
      };

      return (
        <form onSubmit={handleSubmit} className="my-4 space-y-2">
          <h2 className="text-xl font-semibold">Apply for Scholarship</h2>
          <input
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            placeholder="Campaign ID"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
            Apply
          </button>
        </form>
      );
    }

    function App() {
      const [account, setAccount] = useState(null);
      const [provider, setProvider] = useState(null);
      const [token, setToken] = useState(null);
      const [role, setRole] = useState(null);
      const [error, setError] = useState('');

      const connectWallet = async () => {
        try {
          if (!window.ethereum) {
            throw new Error("Please install MetaMask!");
          }
          
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          setProvider(provider);
          setAccount(accounts[0]);
          setError('');
        } catch (err) {
          setError(err.message);
        }
      };

      const register = async (data) => {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/register', {
            walletAddress: account,
            ...data
          });
          alert(response.data.message);
          setError('');
        } catch (err) {
          setError(err.response?.data?.message || 'Registration failed');
        }
      };

      const login = async (data) => {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            walletAddress: account,
            ...data
          });
          setToken(response.data.token);
          setRole(response.data.user.role);
          setError('');
        } catch (err) {
          setError(err.response?.data?.message || 'Login failed');
        }
      };

      const applyForScholarship = async (campaignId) => {
        try {
          await axios.post('http://localhost:5000/api/applications/apply', {
            campaignId,
            documents: ['ipfs_hash_example']
          }, { headers: { Authorization: `Bearer ${token}` } });
          alert('Application submitted successfully');
          setError('');
        } catch (err) {
          setError(err.response?.data?.message || 'Application failed');
        }
      };

      return (
        <div className="container mx-auto p-4 max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Scholarship DApp</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {!account ? (
            <button 
              onClick={connectWallet}
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-semibold">Connected Wallet:</p>
                <p className="truncate">{account}</p>
              </div>

              {!token ? (
                <div className="space-y-6">
                  <RegisterForm onSubmit={register} />
                  <LoginForm onSubmit={login} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded">
                    <p className="font-semibold">Logged in as:</p>
                    <p className="capitalize">{role}</p>
                  </div>

                  {role === 'student' && <ApplyForm onSubmit={applyForScholarship} />}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>