class Usuario{
    constructor(nombreUsuario,apellidoUsuario,rol,correo,contrasena,hashContrasena,idPyme, idUsuario){
        this.nombreUsuario=nombreUsuario;
        this.apellidoUsuario=apellidoUsuario;
        this.rol=rol;
        this.correo=correo;
        this.contrasena=contrasena;
        this.hashContrasena=hashContrasena;
        this.idPyme=idPyme;
        this.idUsuario=idUsuario;
    }
}


export default Usuario;