import pic from '../assets/user.png'

function Profile() {
    return (
        <div className="w-full h-full flex justify-center pt-[20px]">
            <div className="w-[80%] h-[50%] flex bg-slate-200 rounded-2xl">
                <div className="w-[20%] h-full flex justify-center items-center">
                    <img src={pic} alt='' className='w-[60%]'></img>
                </div>
                <div className="w-[80%] h-full">
                    <div className='w-full h-[50%] flex flex-col justify-end'>
                        <h1 className='text-[15px]'>Santiago Lozano</h1>
                    </div>
                    <div className='w-full h-[50%]'>
                        <h1 className='text-[15px]'>A01198114</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
