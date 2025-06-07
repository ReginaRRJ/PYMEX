class Usuario{
    constructor(nombreUsuario,apellidoUsuario,rol,correo,contrasena,hashContrasena,idPyme){
        this.nombreUsuario=nombreUsuario;
        this.apellidoUsuario=apellidoUsuario;
        this.rol=rol;
        this.correo=correo;
        this.contrasena=contrasena;
        this.hashContrasena=hashContrasena;
        this.idPyme=idPyme;
    }
}


export default Usuario;