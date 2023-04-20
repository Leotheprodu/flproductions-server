
const dateNow = async () => {
    let fecha = new Date();
    let anio = fecha.getFullYear();
    let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    let dia = ('0' + fecha.getDate()).slice(-2);
    
    let fechaActual = anio + '-' + mes + '-' + dia;
    
    return(fechaActual);
}

module.exports = dateNow;