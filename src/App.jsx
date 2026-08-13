import './App.css'
import {Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import {Toaster} from 'react-hot-toast'
import Protect from './components/Protect'
import AdminDashboard from './components/AdminDashboard'
import Resetpassword from './components/Resetpassword'

function App() {

  return (
    <>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toasterId="default"
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'palegreen',
              secondary: 'black',
            },
          },
        }}
      />

      <Routes>
          <Route path='/' Component={Login} />
          <Route path='/register' Component={Register} />
          <Route path='/resetpassword' Component={Resetpassword} />
          <Route path='/admin/dashboard/:id' element={<Protect>{<AdminDashboard />}</Protect>} />
          <Route path='/dashboard/:id' element={<Protect>{<Dashboard />}</Protect>} />
      </Routes>
    </>
  )
}

export default App
