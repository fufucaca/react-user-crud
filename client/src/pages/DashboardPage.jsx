import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    // state untuk menyimpan data user dari API
    const [users, setUsers] = useState([]);
    // state untuk loading 
    const [loading, setLoading] = useState(true);
    // state untuk error
    const [error, setError] = useState(null);
    // state form untuk create atau update user 
    const [newUser, setNewUser] = useState({name: '', email: '', password: ''});
    // state untuk melacak user mana yang sedang edit 
    const [editingUser, setEditingUser] = useState(null);
    // state untuk menampung data saat mengedit
    const [currentUserData, setCurrentUserData] = useState({id: null, name: '', email: '', password: ''});
    // state untuk menampung search
    const [searchQuery, setSearchQuery] = useState('');
    // hook navigate
    const navigate = useNavigate();
    

    // useEffect akan berjalan satu kali saat komponen pertama kali di-render 
    useEffect(() => {
        // definisikan fungsi async dalam useEffect
        const fetchUsers = async () => {
            try {
                // panggil API menggunakan axios
                const response = await axios.get('http://localhost:3001/users');
                // simpan data ke state 
                setUsers(response.data);
            } catch (err) {
                // jika terjadi error, simpan pesan error ke state
                setError('Gagal memuat data pengguna.');
                console.error(err);
            } finally {
                // apapun hasilnya (sukses atau gagal), hentikan loading
                setLoading(false);
            }
        };

        // panggil fungsi tersebut 
        fetchUsers();
    }, []); // array kosong berarti ini berjalan hanya sekali (componentDidMount)

    const handleDelete = async userId => {
        // konfirmasi penghapusan 
        if (window.confirm('Apakah Anda yakin ingin menghapus user ini ?')) {
            try {
                // kirim permintaan DELETE ke server
                await axios.delete(`http://localhost:3001/users/${userId}`);
                // jika berhasil, perbaharui state di frontend menggunakan filter
                setUsers(currentUsers => 
                    currentUsers.filter(user => user.id !== userId)
                );
            } catch (err) {
                setError(`Gagal mengapus user.`);
            }
        }
    };

    // fungsi handle form 
    const handleInputChange = async e => {
        const {name, value} = e.target;
        setNewUser(prevState => ({...prevState, [name]: value}));
    };

    // fungsi submit form 
    const handleCreateUser = async e => {
        e.preventDefault(); // mencegah reload halaman 
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert('Semua field harus diisi');
            return;
        }
        try {
            // kirim data baru ke server
            const response = await axios.post('http://localhost:3001/users', newUser);
            // tambahkan user baru ke state frontend 
            setUsers(currentUsers => [...currentUsers, response.data]);
            // kosongkan form 
            setNewUser({ name: '', email: '', password: ''});
        } catch (err) {
            setError('Gagal membuat user baru.');
            console.error(err);
        }
    };

    // saat tombol "Edit" diklik
    const handleEditClick = user => {
        setEditingUser(user.id); // set id user yang akan diedit
        setCurrentUserData({...user}); // salin data user ke form edit 
    }

    // saat tombol "Cancel" diklik
    const handleCancelEdit = () => {
        setEditingUser(null); // Keluar mode edit
    };

    // saat mengetik form edit
    const handleUpdateInputChange = e => {
        const {name, value} = e.target;
        setCurrentUserData(prevState => ({...prevState, [name]: value}));
    }

    const handleUpdateUser = async e => {
        e.preventDefault();
        try {
            // kirim data yang diperbaharui ke API menggunakan axios.put
            const response = await axios.put(`http://localhost:3001/users/${editingUser}`, currentUserData);
            // perbaharui state user dengan data yang sudah diupdate
            setUsers(users.map(user => 
                user.id === editingUser ? response.data : user
            ));
            // keluar dari mode edit 
            setEditingUser(null);
        } catch (err) {
            setError('Gagal mempebaharui User.');
            console.error(err);
        }
    };

    const handleLogout = async () => {
        try {
            // update status session di server menjadi false 
            await axios.patch('http://localhost:3001/session', { isLoggedIn: false});
            // arahkan pengguna kembali ke halaman login
            navigate('/login'); 
        } catch (error) {
            console.error("Gagal untuk Logout", error);
        }
    };

    // tampilan saat loading
    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    // tampilan saat terjadi error 
    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>
    }

    // logika untuk fungsi search
    const filteredUsers = users.filter(user => 
        // cek apakah nama pengguna mengandung teks pencarian
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // atau cek apakah email mengandung kata yang ada di pencarian
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // tampilan utama jika data berhasil dimuat 
    return (
        <div className="container mx-auto px-4">
         <h1 className="text-2xl font-bold m-4">Dashboard Manajemen User</h1>
         <button
         onClick={handleLogout}
         className="bg-red-500 text-white mb-2 px-4 py-2 rounded-md hover:bg-red-600"
         >
            Logout
         </button>

         {/* Form untuk menambah user baru */}
         <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Tambah User Baru</h2>
          <form onSubmit={handleCreateUser} className="flex flex-col sm:flex-grow gap-3">
            <input 
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Nama"
            className="p-2 border rounded-md flex-1" 
            />
            <input 
            type="text"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="p-2 border rounded-md flex-1" 
            />
            <input 
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="p-2 rounded-md flex-1" 
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
              Tambah
            </button>
          </form>
         </div>

         {/* input search */}
         <div className="mb-4">
           <input 
           type="text"
           placeholder="Cari berdasarkan nama atau email..."
           value={searchQuery}
           onChange={e => setSearchQuery(e.target.value)}
           className="w-full p-2 border rounded-md"
           />
         </div>

         {/* table untuk menampilkan data user */}
         <div className="overflow-x-auto rounded-md">
          <table className="min-w-full bg-white border border-gray-200">
           <thead className="bg-gray-200">
             <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nama</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Aksi</th>
             </tr>
           </thead>
           <tbody>
            {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-100">
                   {editingUser === user.id ? (
                    // tampilan saat mode edit
                    <>
                      <td className="py-2 px-4 border-b text-center">{user.id}</td>
                      <td className="py-2 px-4 border-b">
                        <input type="text" name="name" value={currentUserData.name} onChange={handleUpdateInputChange} className="p-1 border rounded w-full" />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input type="text" name="email" value={currentUserData.email} onChange={handleUpdateInputChange} className="p-1 border rounded w-full" />
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button onClick={handleUpdateUser} className="text-green-500 hover:underline mr-2">Save</button>
                        <button onClick={handleCancelEdit} className="text-gray-500 hover:underline">Cancel</button>
                      </td>
                    </>
                   ) : (
                    // tampilan normal
                    <>
                      <td className="py-2 px-4 border-b text-center">{user.id}</td>
                      <td className="py-2 px-4 border-b text-center">{user.name}</td>
                      <td className="py-2 px-4 border-b text-center">{user.email}</td>
                      <td className="py-2 px-4 border-b text-center">
                      <button 
                      onClick={() => handleEditClick(user)} 
                      className="text-blue-500 hover:underline mr-2">Edit</button>
                      <button 
                      onClick={() =>  handleDelete(user.id)}
                      className="text-red-500 hover:underline">Delete</button>
                      </td>
                    </>
                   )}
                </tr>
            ))}
           </tbody>
          </table>
         </div>
        </div>
    );
}

export default DashboardPage;