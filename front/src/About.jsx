import React from 'react';
import LoginHeader from "./components/LoginHeader"
import Circle from "./components/Circle"

const About = () => {
    return (
        <>
            <Circle/>
            <div className="absolute w-full h-[15%] z-50">
                <LoginHeader />
            </div>
            <div className="h-screen w-screen flex justify-center items-center flex-col relative">
                <p className="text-[40px]">Sobre nosotros</p>
                <br />
                <br />
                <br />
                <div className="h-[250px] w-3/5 bg-blue-700 rounded-[50px] flex flex-col justify-center items-center">
                    <p className="text-white">Nancy Silva Alvarez - A00833627</p>
                    <p className="text-white">Carolina De los Santos - A01174992</p>
                    <p className="text-white">Michelle González - A00837313</p>
                    <p className="text-white">Santiago Miguel Lozano Cedillo - A01198114</p>
                    <p className="text-white">Regina Reyes Juárez - A01275790</p>
                </div>
            </div>
        </>
    )
}

export default About