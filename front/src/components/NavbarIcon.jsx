function NavbarIcon({icon, text, onClick, selected}) {
    return (
        <button 
            onClick={onClick}
            className={`w-[80%] h-[60px] rounded-xl bg-blue-500 flex items-center mb-[10px] pl-[10px] ${selected ? 'btn-selected' : 'btn-nonselected'}`}>
            <div className="w-[70%] h-[70%] flex items-center">
                <img src={icon} alt="" className={`w-[20%] mr-[15px] ${selected ? 'invert brightness-0' : ''}`}/>
                <h1 className={`${selected ? 'text-white' : 'text-black'} text-[15px]`}>{text}</h1>
            </div>
        </button>
    )
}

export default NavbarIcon
