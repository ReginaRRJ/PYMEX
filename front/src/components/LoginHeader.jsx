import sapLogo from '../assets/sapLogo.png'
import { useNavigate } from 'react-router-dom';
function LoginHeader() {
const navigate = useNavigate();

  return (
    <div className="w-full h-full flex">
        <div className='w-[70%] h-full flex justify-start items-center'>
            <img src={sapLogo} alt="" className='w-[5%] ml-[2rem]'/>
        </div>
        <div className='w-[30%] h-full flex justify-center items-center gap-12'>
            <h1 className='text-[0.8rem] cursor-pointer font-bold' onClick={() => navigate('/home')}>Home</h1>
            <h1 className='text-[0.8rem] cursor-pointer font-bold' onClick={() => navigate('/about')}>Sobre Nosotros</h1>
            <h1 className='text-[0.8rem] cursor-pointer text-blue-500 font-bold' onClick={() => navigate('/')}>Iniciar sesión</h1>
        </div>
    </div>
  );
}

export default LoginHeader