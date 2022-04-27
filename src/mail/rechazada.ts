export function rechazadaMail (name: string) {
    return `<div>
    <div style="display:block;">
       <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"> <h1>${name}, tu orden fue rechazada!</h1></div> 
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
       <h3 style="display:block">Hubo un problema al procesar el pago.</h3>
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
         <h3 style="display:block">¡Vuelve a intentarlo!, si el problema sigue ocurriendo ponte en contacto con el vendedor</h3>
    </div>
    <div style="display:flex; justify-content:flex-end">
        <p>Equipo de Markets Center</p>
    </div>
</div>`
}