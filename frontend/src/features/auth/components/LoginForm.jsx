import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Admin: admin / 1234
    // Staff: staff / 1234
    // User: user / (ไม่ต้องใช้ password)
    if (credentials.username === 'admin' && credentials.password === '1234') {
      login('admin');
    } else if (credentials.username === 'staff' && credentials.password === '1234') {
      login('staff');
    } else if (credentials.username === 'user') {
      login('user');
    } else {
      setError('Username หรือ Password ไม่ถูกต้อง (ลอง admin/1234 หรือ staff/1234 หรือ user/อะไรก็ได้)');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-pink-100 rounded-2xl mb-4">
             <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">WELCOME BACK</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">เข้าสู่ระบบ Helpdesk Support</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Username</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#eb25b6] focus:bg-white outline-none transition-all"
              placeholder="admin / staff / user"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#eb25b6] focus:bg-white outline-none transition-all"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl text-center animate-pulse">
              ❌ {error}
            </p>
          )}

          <button 
            type="submit" 
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg hover:bg-[#eb25b6] transform hover:scale-[1.02] transition-all duration-300"
          >
            LOG IN
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginForm;